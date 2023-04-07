import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './BarChart.module.css';
import { Link } from 'react-router-dom';

//localStorage
const KEY_FROM_CURRENCY = 'fromCurrency';
const KEY_TO_CURRENCY = 'toCurrency';
const KEY_AMOUNT = 'amount';

//4 variables show in the page
var from = "";
var to = "";
var money = "";
var resultmoney = "";


function BarChart() {
    const [fromCurrency, setFromCurrency] = useState(localStorage.getItem(KEY_FROM_CURRENCY) || '');
    const [toCurrency, setToCurrency] = useState(localStorage.getItem(KEY_TO_CURRENCY) || '');
    const [amount, setAmount] = useState(localStorage.getItem(KEY_AMOUNT) || '');
    const [result, setResult] = useState(null);
    const chartRef = useRef(null);

    //fetch API
    const handleConvert = async () => {
        const url = `https://api.apilayer.com/exchangerates_data/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`;
        try {
            const response = await fetch(url, {
                headers: { 'apikey': 'pozJewn1ep7SZBIQF8l7MB2cyqbPFSHT' },
            });
            if (!response.ok) {
                alert('Please enter a valid currency or amount');
            } else {
                const data = await response.json();
                setResult(data.result);
                from = fromCurrency;
                to = toCurrency;
                money = amount;
                resultmoney = data.result;
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        localStorage.setItem(KEY_FROM_CURRENCY, fromCurrency);
        localStorage.setItem(KEY_TO_CURRENCY, toCurrency);
        localStorage.setItem(KEY_AMOUNT, amount);

        //initializes the ECharts instance and update the chart data
        if (chartRef.current && result) {
            const myChart = echarts.init(chartRef.current);
            const option = {
                xAxis: {
                    type: 'category',
                    data: [fromCurrency, toCurrency],
                    center: ['50%', '50%'],
                },
                yAxis: {
                    type: 'value',
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        const { name, data } = params[0];
                        return `${name}: ${data}`;
                    }
                },
                series: [
                    {
                        data: [amount, result],
                        type: 'bar',
                    },
                ],
            };
            myChart.setOption(option);
        }
    }, [result]);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <div>
                    <label>From:</label>
                    <input value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} placeholder="e.g. AUD"/>
                </div>
                <div>
                    <label>To:</label>
                    <input value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} placeholder="e.g. NZD" />
                </div>
                <div>
                    <label>Amount:</label>
                    <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100" />
                </div>
                <button className={styles['convert-btn']} onClick={handleConvert}>Convert</button>
            </div>
            
            {result && <div>{from}({money}) is equal to {to}({resultmoney})</div>}
            {result && <div ref={chartRef} style={{ width: '1200px', height: '400px' }} />}
            <div></div>
            <div >
                <Link to="/" className={styles['convert-btn']}>Return</Link>
            </div>
            <div>
            <img style={{ marginTop: '15px' }} src={"Countries-and-their-currencies-symbols.png"} alt="My Image" />
            </div>
        </div>
    );
}

export default BarChart;
