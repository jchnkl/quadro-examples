var getNumCpus               = window.sysinfo.cpuinfo.getNumCpus;
    coreInfo                 = window.sysinfo.cpuinfo.coreInfo;
    cpuUsagePercent          = window.sysinfo.cpuinfo.cpuUsagePercent;
    cpuUsagePercentSinceBoot = window.sysinfo.cpuinfo.cpuUsagePercentSinceBoot;

var nCpus = getNumCpus();
    maxPercent = nCpus * 100;
    maxDataElems = 20;
    interval = 3000;
    // interval = 500;

var usageData = [];
var cpuInfo = [];

var svg = null;

function render(data)
{
  svg.remove();
  svg = dimple.newSvg('#cpuinfo', 600, 400);
  var chart = new dimple.chart(svg, data);

  chart.setBounds(0, 30, 600, 270);

  var x = chart.addCategoryAxis('x', 'index');
  x.hidden = true;

  var y = chart.addMeasureAxis('y', 'usage');
  y.hidden = true;

  var s = chart.addSeries('cpu', dimple.plot.area);
  s.interpolation = 'cardinal';
  chart.addLegend(0, 0, 550, 10, 'center');
  chart.draw();
}

function main()
{

  // var data = [
  //   { index: 0, cpu: 0, usage: 30 },
  //   { index: 0, cpu: 1, usage: 15 },
  //   { index: 0, cpu: 2, usage: 45 },
  //   { index: 0, cpu: 3, usage: 50 },
  //   { index: 1, cpu: 0, usage: 60 },
  //   { index: 1, cpu: 1, usage: 70 },
  //   { index: 1, cpu: 2, usage: 80 },
  //   { index: 1, cpu: 3, usage: 90 },
  //   { index: 2, cpu: 0, usage: 10 },
  //   { index: 2, cpu: 1, usage: 20 },
  //   { index: 2, cpu: 2, usage: 30 },
  //   { index: 2, cpu: 3, usage: 40 },
  //   { index: 3, cpu: 0, usage: 15 },
  //   { index: 3, cpu: 1, usage: 40 },
  //   { index: 3, cpu: 2, usage: 70 },
  //   { index: 3, cpu: 3, usage: 20 }
  // ];
  //
  // data.forEach(function(d) { d.cpu = 'cpu' + d.cpu.toString(); });

  // var obj = data[0];
  // for (var p in obj) {
  //   console.log('obj[' + p + '] = ' + obj[p]);
  // }

  var index = 0;
  var data = [];
  var last = {};

  svg = dimple.newSvg('#cpuinfo', 600, 400);

  for (var n = 0; n < nCpus; ++n) {
    last[n] = coreInfo(n);
    var usage = cpuUsagePercentSinceBoot(last[n]);
    data.push({ index: index, cpu: 'cpu' + n, usage: usage });
  }
  ++index;

  setInterval(function() {

    var doShift = data.length == nCpus * maxDataElems;

    for (var n = 0; n < nCpus; ++n) {

      if (doShift) {
        data.shift();
      }

      var now = coreInfo(n);
      var usage = cpuUsagePercent(last[n], coreInfo(n));
      last[n] = now;

      data.push({ index: index, cpu: 'cpu' + n, usage: usage });
    }

    ++index;

    render(data.slice());

  }, interval);
}

function main2()
{

  var data = [
    { "Month": 0, "Channel": "0", "Unit Sales": 30 },
    { "Month": 0, "Channel": "1", "Unit Sales": 15 },
    { "Month": 0, "Channel": "2", "Unit Sales": 45 },
    { "Month": 0, "Channel": "3", "Unit Sales": 50 },
    { "Month": 1, "Channel": "0", "Unit Sales": 60 },
    { "Month": 1, "Channel": "1", "Unit Sales": 70 },
    { "Month": 1, "Channel": "2", "Unit Sales": 80 },
    { "Month": 1, "Channel": "3", "Unit Sales": 90 },
    { "Month": 2, "Channel": "0", "Unit Sales": 10 },
    { "Month": 2, "Channel": "1", "Unit Sales": 20 },
    { "Month": 2, "Channel": "2", "Unit Sales": 30 },
    { "Month": 2, "Channel": "3", "Unit Sales": 40 },
    { "Month": 3, "Channel": "0", "Unit Sales": 15 },
    { "Month": 3, "Channel": "1", "Unit Sales": 40 },
    { "Month": 3, "Channel": "2", "Unit Sales": 70 },
    { "Month": 3, "Channel": "3", "Unit Sales": 20 }
  ];

  var svg = dimple.newSvg("#cpuinfo", 590, 400);

  // d3.tsv("example_data.tsv", function (data) {

    // data = dimple.filterData(data, "Owner", ["Aperture", "Black Mesa"]);

    var obj = data[0];
    for (var p in obj) {
      console.log('obj[' + p + '] = ' + obj[p]);
    }

    var myChart = new dimple.chart(svg, data);

    myChart.setBounds(60, 30, 505, 305);

    var x = myChart.addCategoryAxis("x", "Month");
    x.hidden = true;
    x.addOrderRule("Date");

    var y = myChart.addMeasureAxis("y", "Unit Sales");
    y.hidden = true;

    var s = myChart.addSeries("Channel", dimple.plot.area);
    // myChart.addLegend(60, 10, 500, 20, "right");
    myChart.draw();

  // });
}
