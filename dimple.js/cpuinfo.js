var getNumCpus               = window.procfs.cpuinfo.getNumCpus;
    coreInfo                 = window.procfs.cpuinfo.coreInfo;
    cpuUsagePercent          = window.procfs.cpuinfo.cpuUsagePercent;
    cpuUsagePercentSinceBoot = window.procfs.cpuinfo.cpuUsagePercentSinceBoot;

var nCpus = getNumCpus();
    maxPercent = nCpus * 100;
    maxDataElems = 20;
    interval = 3000;
    // interval = 500;

// globals, initialized in main
var svg         = null;
    svgWidth    = null;
    svgHeight   = null;
    graphWidth  = null;
    graphHeight = null;

function render(data)
{
  svg.remove();
  svg = dimple.newSvg('#cpuinfo', svgWidth, svgHeight);
  var chart = new dimple.chart(svg, data);

  chart.setBounds(0, 0, graphWidth, graphHeight);

  var x = chart.addCategoryAxis('x', 'index');
  x.hidden = true;

  var y = chart.addMeasureAxis('y', 'usage');
  y.hidden = true;
  y.overrideMin = 0;
  y.overrideMax = nCpus * 100;

  var s = chart.addSeries('cpu', dimple.plot.area);
  s.interpolation = 'cardinal';
  chart.draw();
}

function main(width, height)
{
  var div = document.createElement('div');
  div.id = 'cpuinfo';
  document.body.appendChild(div);

  svgWidth    = width;
  svgHeight   = height;
  graphWidth  = svgWidth;
  graphHeight = svgHeight - 1;
  svg         = dimple.newSvg('#cpuinfo', svgWidth, svgHeight);

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

  // gather initial data points
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
