import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from './PieChart.module.css';

function AUDbase() {
  //"newCurrency": stores the current value of the input field where users can enter a currency code.
  const [newCurrency, setNewCurrency] = useState("");
  //"chartData": an array of arrays, where each inner array contains objects representing exchange rate data for a specific currency code. Each object has a "date" property and a "rate" property.
  const [chartData, setChartData] = useState([]);
  //"chartInstance": a reference to the ECharts instance used to render the chart.
  const [chartInstance, setChartInstance] = useState(null);
  //"fetchedCurrencies": an array of currency codes that have already been fetched and displayed in the chart.
  const [fetchedCurrencies, setFetchedCurrencies] = useState([]);
  //"legendData": an array of currency codes that have been added to the chart's legend.
  const [legendData, setLegendData] = useState([]);


  //startDate is today's date, and enddate is the same date for last month.
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  
//"fetchData": a function that sends a GET request to an API to fetch exchange rate data for a specific currency code within the last 30 days. 
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.apilayer.com/exchangerates_data/timeseries?start_date=${formatDate(endDate)}&end_date=${formatDate(startDate)}&base=AUD&symbols=${newCurrency}`,
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

  //"formatDate": a function that takes a Date object and returns a string in the format "YYYY-MM-DD".
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //checks whether the entered currency code has already been fetched, 
  const handleButtonClick = () => {
    if (fetchedCurrencies.includes(newCurrency)) {
      alert("You have already entered this currency.");
    } else {
      fetchData();
      setNewCurrency("");
      setLegendData((prevData) => [...prevData, newCurrency]);
    }
  };

  //initializes the ECharts instance
  useEffect(() => {
    if (!chartInstance) {
      setChartInstance(echarts.init(document.getElementById("chart")));
    }
  }, [chartInstance]);

  //updates the chart data and options
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
      <div>Enter any currency name like "NZD", graph shows 1 AUD == ?? NZD </div>
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

export default AUDbase;
