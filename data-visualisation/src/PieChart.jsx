import React from 'react';
import * as echarts from 'echarts';
import { Link } from 'react-router-dom';
import styles from './PieChart.module.css';

function PieChart() {



  const chartRef = React.useRef(null);

  const data = [
    { name: 'China', value: 1, url: '/CNY' },
    { name: 'New Zealand', value: 1, url: '/NZD' },
    { name: 'Australia', value: 1, url: '/AUD' },
  ];


  //initializes the PieChart instance and update the chart data with 3 countries.
  React.useEffect(() => {
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      
      series: [
        {
          name: 'Country',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: data.map((item) => ({
            name: item.name,
            value: item.value,
          })),
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

          labelLine: {
            show: true
          }
        },
      ],
    });


    chart.on('click', function (params) {

      const url = data.find(item => item.name === params.name)?.url;
      if (url) {

        window.location.href = url;
      }
    });
  }, [data]);

  return (
  <div>
    <h1>Currency Exchange and Inquiry</h1>
    <h3>Choose a Country to search the exchange rate change within one month.</h3>
    <div ref={chartRef} style={{ width: '100%', height: '500px' }}></div>
    <div style={{ marginTop: '-80px' }}> <h3 >Today's Currency Exchange Calculator</h3></div>
    <div style={{ marginTop: '50px' }}>
    <Link to="/exchange" className={styles['convert-btn']}>Go to exchange currency</Link>
    </div>

  </div>);
}

export default PieChart;
