import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SummaryLine = (props) => {

  const { daysSeries, portfolioSeries} = props;

  const options = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: true,
      },
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.05)',
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false,
        }
      },
      yaxis: {
        lines: {
          show: true,
        },
      }
    },
    xaxis: {
      crosshairs: {
        show: true
      },
      categories: daysSeries,
      axisTicks: {
        show: true,
      },
      tooltip: {
        enabled: true
      },
      labels: {
        show: false
      },
      axisBorder: {
        show: true,
      },
    
    },
    
    yaxis: {
      title: {
        text: ''
      },
      
      labels: {
        style: {
          colors: "#D1D5DB"
        },
        formatter: (value) => {
          return `${value.truncateDecimals(3)} $`;
        },
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: [
          {
            offset: 0,
            color: '#4F7FFA',
            opacity: 1
          },
          {
            offset: 100,
            color: '#4F7FFA',
            opacity: 0
          },
        ]
      }
    },
    tooltip: {
      enabled: true,
      enabledOnSeries: undefined,
      shared: true,
      followCursor: false,
      custom: undefined,
      style: {
        fontSize: '10px',
      },
    }
  };



  var series = [
    {
      name: "Portfolio",
      data: portfolioSeries
    }
  ]

  return (
    <Chart options={options} series={series} type="area" height={300} />
  )
};

export default SummaryLine;