import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Visual } from "./Visual";
import { Home } from "./Home";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visual" element={<Visual />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
