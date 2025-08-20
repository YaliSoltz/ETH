import React from "react";

import Main from "./components/main";
import { Route, Routes } from "react-router-dom";
import FullChart from "./components/fullChart";
import PageSelect from "./components/pageSelect/pageSelect";
import CoinSelect from "./components/coinSelect/coinSelect";

const App = () => {
  return (
    <>
      <CoinSelect />
      <PageSelect />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/full-chart" element={<FullChart />} />
      </Routes>
    </>
  );
};

export default App;
