import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../Portfolio/layouts/MainLayout";
import { Suspense } from "react";
import { routes } from "./routeConfig";
const getLayout = (layout, element) => {
  if (layout === "main") return <MainLayout>{element}</MainLayout>;
  return element;
};

const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      {routes.map(({ path, element, layout, protected: isProtected }, i) => (
        <Route key={i} path={path} element={getLayout(layout, element)} />
      ))}
    </Routes>
  </Suspense>
);

export default AppRoutes;
