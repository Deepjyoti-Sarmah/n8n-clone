import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard";
import Workflow from "./pages/workflow";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workflow/new" element={<Workflow />} />
          <Route path="/workflow/:id" element={<Workflow />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
