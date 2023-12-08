import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import NotFound from "./pages/NotFound";
import Login from "./components/Login"; 
import Chat from "./components/Chat";
const ProjectRoutes = () => {
  return (
    <React.Suspense fallback={<>Loading...</>}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat/:username" element={<Chat />} />
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </Router>
    </React.Suspense>
  );
};
export default ProjectRoutes;
