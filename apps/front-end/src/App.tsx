import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard";
import Workflow from "./pages/workflow";

function App() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workflow/new" element={<Workflow />} />
            <Route path="/workflow/:id" element={<Workflow />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
