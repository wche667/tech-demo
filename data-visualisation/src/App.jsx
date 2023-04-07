import React from 'react';
import NZDbase from './NZDbase';
import AUDbase from './AUDbase';
import PieChart from './PieChart';
import CNYbase from './CNYbase';
import BarChart from './BarChart';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

function App() {

  return (
    <div>
      {/* Using Route to navigate */}
      <Routes>
        <Route path="/" element={<PieChart />}> </Route>
        <Route path="/NZD" element={<NZDbase></NZDbase>}></Route>
        <Route path="/AUD" element={<AUDbase></AUDbase>}></Route>
        <Route path="/CNY" element={<CNYbase></CNYbase>}></Route>
        <Route path="/Exchange" element={<BarChart ></BarChart>}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;