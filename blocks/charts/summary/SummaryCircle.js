import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SummaryCircle = (props) => {
  const { title, labels, series} = props;

  var colorPalette = ['#5677D8', '#d15359']
  var options1 = {
    chart: {
      type: 'radialBar',
      width: 130,
      height: 140
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: "85%",
          labels: {
            show: true,
            showAlways: true,
            name: {
              show: true,
              showAlways: true,
              color: 'grey',
              // formatter: function (val, opt) {
              //   return "Hello world"
              // }
            },
          }
        }
      },
      stroke: {
        width: 0,
        colors: undefined
      }
    },
    colors: colorPalette,
    title: {
      text: title,
      align: 'center',
      margin: 20,
      style: {
        fontSize: '12px',
        color: "grey",
        fontWeight: '400'
      }
    },

    series: props.series,
    labels: labels,
    legend: {
      labels: {
        colors: 'grey',
        fontSize: 12,
      },
      position: 'bottom',
      offsetY: 30,
      horizontalAlign: "center",
      markers: {
        width: 4,
        height: 12,
        strokeWidth: 0,
        onClick: undefined,
      },
    },
    responsive: [
      {
        breakpoint: 768, // set the configuration for screens with width less than 768 pixels
        options: {
          chart: {
            width: "100%", // set the width of the chart container to 100% of the parent container
          },
        },
      },
    ],
  }
  var options = {
    colors: colorPalette,
    series: props.series,
          chart: {
            width: 220,
            height: 220,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '12px',
              },
              value: {
                fontSize: '12px',
                color:"#D3D3D3"
              },
              total: {
                show: false,
              }
            }
          }
        },
        labels: labels,
        };

  return (
    <div className='flex flex-col'><Chart options={options} series={series} type="radialBar" height={220} width={220} />
    <p className="text-xs mb-4">{props.title} </p>
    <div className="flex flex-col">
  <span className="mb-2 text-xxs">Available to borrow {props.data[0]} $</span>
  <span className="mb-2 text-xxs">Borrow {props.data[1]} $</span>
  <span className="text-xxs">Collateral {props.data[2]} $</span>
</div>
    </div>
  )
};

export default SummaryCircle;