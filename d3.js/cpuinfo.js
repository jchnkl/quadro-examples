// var CpuInfo =
//   { main: main
//   , renderUsage: renderUsage
//   , getUsageInfos: getUsageInfos
//   };
//
// var padConfig                = window.common.padConfig;
// var multiCircle              = window.common.multiCircle;
// var colorMix                 = window.common.colorMix;
// var getNumCpus               = window.sysinfo.cpuinfo.getNumCpus;
// var coreInfo                 = window.sysinfo.cpuinfo.coreInfo;
// var cpuUsagePercent          = window.sysinfo.cpuinfo.cpuUsagePercent;
// var cpuUsagePercentSinceBoot = window.sysinfo.cpuinfo.cpuUsagePercentSinceBoot;
//
// function renderUsage(infos)
// {
//   var layer = new Layer();
//
//   var rect = new Rectangle();
//
//   // return multiCircle({ infos:         infos
//   //                    , center:        this.config.center
//   //                    , innerRadius:   this.config.innerRadius
//   //                    , outerRadius:   this.config.outerRadius
//   //
//   //                    , circleGap:     this.config.circleGap
//   //
//   //                    , statusColor:   this.config.statusColor
//   //                    , statusCpacity: this.config.statusCpacity
//   //
//   //                    , fontFamily:    this.config.fontFamily
//   //                    , fontColor:     this.config.fontColor
//   //                    , relFontSize:   this.config.relFontSize
//   //
//   //                    , baseColor:     this.config.baseColor
//   //                    , baseOpacity:   this.config.baseOpacity
//   //                    });
// }
//
// function getUsageInfos(getCoreUsage)
// {
//   var infos = [];
//
//   for (var n = 0; n < this.ncpus; ++n) {
//     var usage = getCoreUsage(n);
//
//     var color = colorMix({ percent: usage / 100
//                          , min_color: '#618a3d'
//                          , med_color: '#eee04c'
//                          , max_color: '#ec3b3b'
//                          });
//
//     infos.push({ percent: usage
//                , color: color
//                , text: 'core' + (n+1) + '% ' + usage.toFixed(0)
//                });
//   }
//
//   return infos;
// }
//
// function main()
// {
//   var radius = Math.min(view.size.width, view.size.height);
//
//   var defaultConfig =
//     { interval:      3
//
//     , center:        { x: view.size.width / 2, y: view.size.height / 2 }
//
//     , innerRadius:   0.25 * radius / 2
//     , outerRadius:   radius / 2
//
//     , circleGap:     2
//
//     , statusColor:   '#85b3c4'
//     , statusCpacity: 1.0
//
//     , fontFamily:    'Ubuntu Mono'
//     , fontColor:     '#636363'
//     , relFontSize:   0.8
//
//     , baseColor:     '#808080'
//     , baseOpacity:   0.75
//     };
//
//   // for setInterval
//   var self = this;
//
//   self.config = padConfig(defaultConfig, window.cpuinfo.config);
//   self.ncpus = getNumCpus();
//   self.last = [];
//
//   for (var n = 0; n < 8; ++n) {
//     self.last[n] = coreInfo(n);
//   }
//
//   var infos = self.getUsageInfos(function(n) {
//     return cpuUsagePercentSinceBoot(coreInfo(n));
//   });
//
//   self.layer = self.renderUsage(infos);
//
//   setInterval(function() {
//     self.layer.removeChildren();
//
//     var infos = self.getUsageInfos(function(n) {
//       var now = coreInfo(n);
//       old = self.last[n];
//       self.last[n] = now;
//       return cpuUsagePercent(old, now);
//     });
//
//     self.layer = self.renderUsage(infos);
//
//     paper.view.update();
//   }, self.config.interval * 1000)
// }
//
// CpuInfo.main();



// function getCpuInfos()
// {
//   var infos = [];
//   for (var n = 0; n < nCpus; ++n) {
//     infos.push({ cpu: n, info: coreInfo(n) });
//   }
// }

// function getCpuUsage(, infos)
// {
//   usage.push(cpuUsagePercent(infos[-2], infos[-1]));
// }

var getNumCpus               = window.sysinfo.cpuinfo.getNumCpus;
    coreInfo                 = window.sysinfo.cpuinfo.coreInfo;
    cpuUsagePercent          = window.sysinfo.cpuinfo.cpuUsagePercent;
    cpuUsagePercentSinceBoot = window.sysinfo.cpuinfo.cpuUsagePercentSinceBoot;

// var getNumCpus               = window.sysinfo.cpuinfo.getNumCpus;
// var coreInfo                 = window.sysinfo.cpuinfo.coreInfo;
// var cpuUsagePercent          = window.sysinfo.cpuinfo.cpuUsagePercent;
// var cpuUsagePercentSinceBoot = window.sysinfo.cpuinfo.cpuUsagePercentSinceBoot;

// function render(foo)
// {
//   // d3.select('#chart svg').remove();
//
//   // var data = [ { key: "foo", values: [ [0,1], [2,3], [4,5] ] }
//   //            , { key: "bar", values: [ [6,7], [8,9], [10,11] ] }
//   //            ];
//
//   var bar = [ [0,1, 2,3, 4,5]
//             , [6,7, 8,9, 10,11]
//             ];
//
//   var data = [ { key: "foo", values: [ [0,1, 2,3, 4,5] ] }
//              , { key: "bar", values: [ [6,7, 8,9, 10,11] ] }
//              ];
//
//   // d3.json('stackedAreaData.json', function(data) {
//   nv.addGraph(function() {
//       var chart = nv.models.stackedAreaChart()
//                     .offset('wiggle')
//                     .order('inside-out')
//                     .margin({right: 100})
//                     //We can modify the data accessor functions...
//                     // .x(function(d) { console.log('x: ' + d[0]); return d[0]; })
//                     // .x(function(d) { console.log('x: ' + d); return 0; })
//                     // .x(function(d) {  return 0; })
//                     // .x(function(d) { console.log('x: ' + d); return d + 0; })
//                     .x(function(d) { console.log('x: ' + d); return d[0]; })
//                     //...in case your data is formatted differently.
//                     // .y(function(d) { console.log('y: ' + d[1]); return d[1]; })
//                     // .y(function(d) { console.log('y: ' + d); return 1; })
//                     // .y(function(d) {  return 1; })
//                     // .y(function(d) { return d })
//                     // .y(function(d) { console.log('y: ' + d); return d + 1; })
//                     .y(function(d) { console.log('y: ' + d); return d[1]; })
//                     .useInteractiveGuideline(false)    //Tooltips which show all data points. Very nice!
//                     .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
//                     // .transitionDuration(500)
//                     .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
//                     .clipEdge(true);
//
//       //Format x-axis labels with custom function.
//       // chart.xAxis
//       //     .tickFormat(function(d) {
//       //       return d3.time.format('%x')(new Date(d)) 
//       // });
//
//       chart.yAxis
//           .tickFormat(d3.format(',.2f'));
//
//       // for (var p in usage) {
//       //   console.log('usage[' + p + '] = ' + usage[p]);
//       // }
//
//       d3.select('#chart svg')
//         .datum(bar)
//         .call(chart);
//         // .datum(usage)
//         // .datum(data)
//
//       nv.utils.windowResize(chart.update);
//
//       return chart;
//     });
//   // })
// }

function render(data)
{
  // for (var p in data) {
  //   var obj = data[p];
  //   for (var x in obj) {
  //   console.log(obj[x]);
  //   }
  // }
  nv.addGraph(function() {
      var chart = nv.models.stackedAreaChart()
                    .offset('wiggle')
                    // .offset('expand')
                    // .offset('silhouette')
                    .order('inside-out')
                    .x(function(d) { return d[0]; })
                    .y(function(d) { return d[1]; })
                    .useInteractiveGuideline(false)
                    .clipEdge(true);

      chart.yAxis.tickFormat(d3.format(',.2f'));

      d3.select('#chart svg').datum(data).call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
}


function main()
{
  var i = 0;
  var data = [];
  var infos = {};
  var usage = {};
  var nCpus = getNumCpus();

  var percent_sum = 0;
  for (var n = 0; n < nCpus; ++n) {
    var info = coreInfo(n);
    infos[n] = [];
    infos[n].push(info);
    usage[n] = [];
    usage[n].push([i, cpuUsagePercentSinceBoot(info)]);
    percent_sum += usage[n][usage[n].length-1][1];
  }

  for (var n = 0; n < nCpus; ++n) {
    // console.log('usage[' + n + '][1](' + usage[n][1] + ') /= ' + percent_sum + ' = ' + usage[n][1] / percent_sum);
    usage[n][usage[n].length-1][1] /= percent_sum;
    data.push({ key: n, values: usage[n] });
  }

  render(data);

  setInterval(function() {
    ++i;
    data = [];

  // var data = [
  //   { key: "", values: [ [0+n,1+n], [2+n,3+n], [4+n,5+n] ] },
  //   { key: "", values: [ [6+n,7+n], [8+n,9+n], [10+n,11+n] ] }
  // ];

    var percent_sum = 0;
    for (var n = 0; n < nCpus; ++n) {
      var nInfos = infos[n];
      var now = coreInfo(n);
      usage[n].push([i, cpuUsagePercent(nInfos[nInfos.length - 1], now)]);
      nInfos.push(now);
      percent_sum += usage[n][usage[n].length-1][1];
    }

    for (var n = 0; n < nCpus; ++n) {
      if (usage[n].length > 30) {
        usage[n].shift();
      }
      usage[n][usage[n].length-1][1] /= percent_sum;
      data.push({ key: n, values: usage[n] });
    }


    // var data = [];
    // for (var n = 0; n < nCpus; ++n) {
    // }

    render(data);

  }, 3000);

  // setInterval(function() {
  //   for (var n = 0; n < nCpus; ++n) {
  //     var nInfos = infos[n];
  //     var now = coreInfo(n);
  //     usage[n].push(cpuUsagePercent(nInfos[nInfos.length - 1], now));
  //     nInfos.push(now);
  //   }
  //
  //   // var chart = d3.select('chart').transition();
  //   // d3.select('chart').transition().update();
  //   // chart.update();
  //   //   d3.select('#chart svg')
  //   //     // .datum(usage)
  //   //     .datum(data)
  //   //     .call(chart);
  //
  //   var data = [ { key: "foo", values: [ 6,7, 8,9, 10,11 ] }
  //              , { key: "bar", values: [ 0,1, 2,3, 4,5 ] }
  //              ];
  //
  //   render(data);
  //   // d3.select('#chart svg').datum(data).update();
  //
  //   // var svg = d3.selectAll("chart").datum(data).transition();
  //                // svg.select(".line").attr("d", valueline(data));
  //                // call(chart);
  //
  // }, 1000);
}

main();

/*Data sample:
{ 
      "key" : "North America" , 
      "values" : [ [ 1025409600000 , 23.041422681023] , [ 1028088000000 , 19.854291255832],
       [ 1030766400000 , 21.02286281168], 
       [ 1033358400000 , 22.093608385173],
       [ 1036040400000 , 25.108079299458],
       [ 1038632400000 , 26.982389242348]
       ...

*/
