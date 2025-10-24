import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./css/styles.css"; // optional tweaks
import "./css/pokemon-color.css";
import ThemeProvider from "./theme/ThemeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
   <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);