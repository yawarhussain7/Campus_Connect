import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";

/*
 * DataProvider deliberately lives inside App.jsx, wrapping only the signed-in
 * shell: mounted here (above the router) it would fire the five /admin list
 * requests on every page — including /login — where the only possible answer
 * is 401/403.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
