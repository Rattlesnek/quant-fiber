import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { VisualView } from "./pages/VisualView";
import { HomeView } from "./pages/HomeView";
import { TestingView } from "./pages/TestingView";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/visual" element={<VisualView />} />
        <Route path="/testing" element={<TestingView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
