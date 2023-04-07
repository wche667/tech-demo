
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Link } from 'react-router-dom';
import styles from './PieChart.module.css';
import './App.css';
import axios from "axios";

//same as AUD base, only different in fetch.


function CNYbase() {
  const [newCurrency, setNewCurrency] = useState("");
  const [chartData, setChartData] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);
  


  const [fetchedCurrencies, setFetchedCurrencies] = useState([]);
  const [legendData, setLegendData] = useState([]);

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.apilayer.com/exchangerates_data/timeseries?start_date=${formatDate(
          endDate
        )}&end_date=${formatDate(startDate)}&base=CNY&symbols=${newCurrency}`,
        {
          headers: {
            apikey: "pozJewn1ep7SZBIQF8l7MB2cyqbPFSHT",
          },
        }
      );
      const { rates } = response.data;
      const chartData = Object.entries(rates).map(([date, rates]) => ({
        date,
        rate: rates[newCurrency],

      }));

      setChartData((prevData) => [...prevData, chartData]);
      setFetchedCurrencies((prevCurrencies) => [...prevCurrencies, newCurrency]);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleButtonClick = () => {
    if (fetchedCurrencies.includes(newCurrency)) {
      alert("You have already entered this currency.");
    } else {
      fetchData();
      setNewCurrency("");
      setLegendData((prevData) => [...prevData, newCurrency]);
    }
  };

  useEffect(() => {
    if (!chartInstance) {
      setChartInstance(echarts.init(document.getElementById("chart")));
    }
  }, [chartInstance]);

  useEffect(() => {
    if (chartData.length > 0 && chartInstance) {
      const seriesData = chartData.map((data) =>
        data.map(({ date, rate }) => [date, rate])
      );
      const option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: legendData,
        },
        xAxis: {
          type: "category",
          data: chartData[0].map(({ date }) => date),
        },
        yAxis: {
          type: "value",
        },
        series: seriesData.map((data, index) => ({
          name: legendData[index],
          type: "line",
          data,
        })),
      };
      chartInstance.setOption(option);
    }
  }, [chartData, chartInstance, legendData]);

  return (
    <div>
      <div>Enter any currency name like "NZD", graph shows 1 CNY == ?? NZD </div>
      <input
        type="text"
        value={newCurrency}
        onChange={(e) => setNewCurrency(e.target.value)}
      />
      <button className={styles['convert-btn']} onClick={handleButtonClick}>Add currency</button>
      <div id="chart" style={{ width: "1300px", height: "700px" }}></div>
      <Link to="/" className="return-link">Return</Link>
    </div>
  );
  }
  
  export default CNYbase;