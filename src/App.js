import React from 'react';
import './App.css';
import Chart from './components/chart/Chart';
import { getChartData } from './utils/data';

function App() {
  const data = getChartData()
  return (
    <div className="container">
        <Chart data={data}/>
    </div>
  );
}

export default App;
