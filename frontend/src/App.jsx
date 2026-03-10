import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";

export default function App() {

  return (
    <BrowserRouter>

      <nav className="bg-gray-800 text-white p-4 flex gap-6">
        <Link to="/">Dashboard</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/attendance">Attendance</Link>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}