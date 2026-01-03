import React from "react";
import { createRoot } from "react-dom/client";
import StudyNotesApp from "./StudyNotesApp";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StudyNotesApp />
  </React.StrictMode>
);
