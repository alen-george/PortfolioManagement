const request = require("supertest");
const app = require("../src/index");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe("Auth Endpoints", () => {
  // Clean up test data after each test
  afterEach(async () => {
    await prisma.session.deleteMany();
    await prisma.auditAction.deleteMany();
    await prisma.portfolioDetail.deleteMany();
    await prisma.accountDetail.deleteMany();
    await prisma.userDetail.deleteMany();
  });

  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123"
      };

      const res = await request(app)
        .post("/auth/register")
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user.firstName).toBe(userData.firstName);
      expect(res.body.user.lastName).toBe(userData.lastName);
      expect(res.body.user.email).toBe(userData.email);
      expect(res.body.user).toHaveProperty("createdAt");
    });

    it("should return 400 for missing required fields", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe"
        // Missing email and password
      };

      const res = await request(app)
        .post("/auth/register")
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("First name, last name, email, and password are required");
    });

    it("should return 400 for invalid email format", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        password: "password123"
      };

      const res = await request(app)
        .post("/auth/register")
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid email format");
    });

    it("should return 400 for weak password", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "123" // Too short
      };

      const res = await request(app)
        .post("/auth/register")
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Password must be at least 8 characters long");
    });

    it("should return 409 for duplicate email", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123"
      };

      // Register first user
      await request(app)
        .post("/auth/register")
        .send(userData);

      // Try to register with same email
      const res = await request(app)
        .post("/auth/register")
        .send(userData);

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBe("Email address already registered");
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      // Register a test user
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123"
      };

      await request(app)
        .post("/auth/register")
        .send(userData);
    });

    it("should login successfully with correct credentials", async () => {
      const loginData = {
        email: "john.doe@example.com",
        password: "password123"
      };

      const res = await request(app)
        .post("/auth/login")
        .send(loginData);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user.email).toBe(loginData.email);
    });

    it("should return 401 for incorrect password", async () => {
      const loginData = {
        email: "john.doe@example.com",
        password: "wrongpassword"
      };

      const res = await request(app)
        .post("/auth/login")
        .send(loginData);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Invalid email or password");
    });

    it("should return 401 for non-existent email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123"
      };

      const res = await request(app)
        .post("/auth/login")
        .send(loginData);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Invalid email or password");
    });
  });

  describe("POST /auth/logout", () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Register and login a test user
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123"
      };

      await request(app)
        .post("/auth/register")
        .send(userData);

      const loginRes = await request(app)
        .post("/auth/login")
        .send({
          email: "john.doe@example.com",
          password: "password123"
        });

      authToken = loginRes.body.token;
      userId = loginRes.body.user.id;
    });

    it("should logout successfully and invalidate the token", async () => {
      // First, verify the token works before logout
      const profileRes = await request(app)
        .get("/user/profile")
        .set("Authorization", `Bearer ${authToken}`);

      expect(profileRes.statusCode).toBe(200);

      // Now logout
      const logoutRes = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${authToken}`);

      expect(logoutRes.statusCode).toBe(200);
      expect(logoutRes.body.message).toBe("Logout successful");

      // Verify the token is now invalid
      const invalidProfileRes = await request(app)
        .get("/user/profile")
        .set("Authorization", `Bearer ${authToken}`);

      expect(invalidProfileRes.statusCode).toBe(403);
      expect(invalidProfileRes.body.error).toBe("Session expired or invalid");
    });

    it("should return 401 for logout without token", async () => {
      const res = await request(app)
        .post("/auth/logout");

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Access token required");
    });
  });

  describe("POST /auth/logout-all-devices", () => {
    let authToken1;
    let authToken2;
    let userId;

    beforeEach(async () => {
      // Register and login a test user twice to simulate multiple devices
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123"
      };

      await request(app)
        .post("/auth/register")
        .send(userData);

      // First login (device 1)
      const loginRes1 = await request(app)
        .post("/auth/login")
        .send({
          email: "john.doe@example.com",
          password: "password123"
        });

      authToken1 = loginRes1.body.token;
      userId = loginRes1.body.user.id;

      // Second login (device 2)
      const loginRes2 = await request(app)
        .post("/auth/login")
        .send({
          email: "john.doe@example.com",
          password: "password123"
        });

      authToken2 = loginRes2.body.token;
    });

    it("should logout from all devices successfully", async () => {
      // Verify both tokens work before logout
      const profileRes1 = await request(app)
        .get("/user/profile")
        .set("Authorization", `Bearer ${authToken1}`);

      const profileRes2 = await request(app)
        .get("/user/profile")
        .set("Authorization", `Bearer ${authToken2}`);

      expect(profileRes1.statusCode).toBe(200);
      expect(profileRes2.statusCode).toBe(200);

      // Now logout from all devices using token1
      const logoutAllRes = await request(app)
        .post("/auth/logout-all-devices")
        .set("Authorization", `Bearer ${authToken1}`);

      expect(logoutAllRes.statusCode).toBe(200);
      expect(logoutAllRes.body.message).toBe("Logged out from all devices successfully");
      expect(logoutAllRes.body.sessionsInvalidated).toBeGreaterThan(0);

      // Verify both tokens are now invalid
      const invalidProfileRes1 = await request(app)
        .get("/user/profile")
        .set("Authorization", `Bearer ${authToken1}`);

      const invalidProfileRes2 = await request(app)
        .get("/user/profile")
        .set("Authorization", `Bearer ${authToken2}`);

      expect(invalidProfileRes1.statusCode).toBe(403);
      expect(invalidProfileRes1.body.error).toBe("Session expired or invalid");
      expect(invalidProfileRes2.statusCode).toBe(403);
      expect(invalidProfileRes2.body.error).toBe("Session expired or invalid");
    });

    it("should return 401 for logout from all devices without token", async () => {
      const res = await request(app)
        .post("/auth/logout-all-devices");

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Access token required");
    });

    it("should handle case when user has no active sessions", async () => {
      // First logout from all devices
      await request(app)
        .post("/auth/logout-all-devices")
        .set("Authorization", `Bearer ${authToken1}`);

      // Try to logout from all devices again
      const res = await request(app)
        .post("/auth/logout-all-devices")
        .set("Authorization", `Bearer ${authToken1}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe("Session expired or invalid");
    });
  });
}); 