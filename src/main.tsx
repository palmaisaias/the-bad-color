import { createRoot } from "react-dom/client";
import App from "./App";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Theme overrides + variables
import "./theme.css";

createRoot(document.getElementById("root")!).render(<App />);