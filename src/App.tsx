import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TranslationProvider } from "./Context/TranslationContext";
import Dashboard from "./Routes/Dashboard/Dashboard";
import PublicView from "./Routes/PublicView/PublicView";

function App() {
  return (
    <TranslationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/public" element={<PublicView />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </TranslationProvider>
  );
}

export default App;
