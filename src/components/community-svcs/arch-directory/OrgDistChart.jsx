import React, {useState, useEffect} from 'react';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Doughnut3D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
ReactFC.fcRoot(FusionCharts, Doughnut3D, FusionTheme);

const OrgDistChart = props => {
  const [chartConfig, setChartConfig] = useState({});

  useEffect(() => {
    setChartConfig(
      {
        type: 'doughnut3d',// The chart type
        width: '450', // Width of the chart
        height: '420', // Height of the chart
        dataFormat: 'json', // Data type
        dataEmptyMessage: {/* Removed due to contract */},
        dataSource: {
          "chart": {
            "decimals": "0",
            "theme": "fusion",
            'enableSlicing': 0,
            'showLabels': 0,
            'startingAngle': 180,
            'paletteColors': `#FFD700, #00A3E0, #002F6C, #b4d405, #0c69b0, #890C58, 
                              #d82424, #3A397B, #d93900, #00af53, #b10040, #00aca8`, 
          },
          "data": props.orgData
        },
        "events": {
          "legendItemClicked": function(ev) {
            props.clickHandler(ev.data.label);
          },
          "dataPlotClick": function(ev) {
            props.clickHandler(ev.data.categoryLabel);
          }
        }
      }
    )
  }, [props])

  return (
    <ReactFC {...chartConfig}/>
  );
};

export default OrgDistChart;