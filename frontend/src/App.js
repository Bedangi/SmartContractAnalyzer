import AppRoutes from "./routes/AppRoutes";
import { AnalysisProvider } from "./context/AnalysisContext";

function App() {
  return (
    <AnalysisProvider>
      <AppRoutes />
    </AnalysisProvider>
  );
}

export default App;