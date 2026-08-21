import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import AnalysisView from "../pages/AnalysisView/AnalysisView";
import Recommendations from "../pages/Recommendations/Recommendations";
import SummarizerTest from "../components/analysis/SummarizerTest";
import AnalysisLauncher
  from "../pages/AnalysisLauncher/AnalysisLauncher";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/analysis/:id"
          element={<AnalysisView />}
        />

        <Route
          path="/recommendations/:id"
          element={<Recommendations />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

        <Route
          path="/analysis/new"
          element={<AnalysisLauncher />}
        />

        <Route
          path="/test/summarizer"
          element={<SummarizerTest />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;