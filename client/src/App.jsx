import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [health, setHealth] = useState("…");

  useEffect(() => {
    axios.get("/api/health")          // nginx proxy or Vite dev proxy
         .then(res => setHealth(res.data.status))
         .catch(() => setHealth("DOWN"));
  }, []);

  return <h1>Backend health: {health}</h1>;
}

export default App;
