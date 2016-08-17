var LineChart = require("react-chartjs").Line;
var chartData = [1,2,3,4,5];
var chartOptions = '';
var MyComponent = React.createClass({
  render: function() {
    return <LineChart data={chartData} options={chartOptions} width="600" height="250"/>
  }
});

ReactDOM.render(
  <MyComponent />,
  document.getElementById('line')
);
