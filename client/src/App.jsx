import { useEffect, useState } from "react";
import axios from "axios";
import AppRoutes from "./Routes/route";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
