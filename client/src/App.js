import React from "react";

import Main from "./components/main";
import { Route, Routes } from "react-router-dom";
import FullChart from "./components/fullChart";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/full-chart" element={<FullChart />} />
    </Routes>
  );
};

export default App;
