import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddSubject from "./AddSubject";
import Timetable from "./pages/Timetable";
import GeneratePage from "./pages/GeneratePage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-subject" element={<AddSubject />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/generate" element={<GeneratePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;