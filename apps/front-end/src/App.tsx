import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard";
import Workflow from "./pages/workflow";
import Landing from "./pages/landing";

function App() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workflow/new" element={<Workflow />} />
            <Route path="/workflow/:id" element={<Workflow />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
