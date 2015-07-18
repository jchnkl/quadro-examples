var columns = 4;

var gap = 10;
var radius = 35;
var strokeWidth = 25;
var strokeColor = '#85b3c4';

var fontFamily = 'Ubuntu Light';
var fontColor = '#85b3c4';
var fontSize = 15;

var multiCircle = window.common.multiCircle;

function renderUsageLayers(bottomColor, color, infos)
{
  return  multiCircle({ infos: infos.reverse()
                      , center: { x: view.size.width / 2, y: view.size.height / 2 }
                      , innerRadius: 0.5 * view.size.width / 4
                      , outerRadius: view.size.width / 4
                      , gap: 2
                      , color: color
                      , opacity: 1.0
                      , baseColor: bottomColor
                      , baseOpacity: 0.4
                      , fontColor: fontColor
                      , fontFamily: fontFamily
                      });
}


function main()
{
  var last = [];

  for (var i = 0; i < 8; ++i) {
    last[i] = coreInfo(i);
  }

  var ncpus = getNumCpus();

  var bottomColor = new Color(strokeColor).convert('hsb')
  bottomColor.saturation = 0.2;

  var layer = new Layer();

  {
    var infos = [];

    for (var i = 0; i < ncpus; ++i) {
        var usage = cpuUsagePercentSinceBoot(coreInfo(i));

        var color = new Color(strokeColor);
        color.red   += 0.4 * usage / 100;
        color.green -= 0.2 * usage / 100;
        color.blue  -= 0.2 * usage / 100;

        infos.push({ percent: usage
                   , color: color
                   , text: 'Core ' + i + '    ' + usage.toFixed(0) + '%'
                   });
    }

    layer.addChild(renderUsageLayers(bottomColor, color, infos));
  }

  setInterval(function() {
    layer.removeChildren();

    var infos = [];

    for (var i = 0; i < ncpus; ++i) {
      var now = coreInfo(i);
      var usage = cpuUsagePercent(last[i], now);

      var color = new Color(strokeColor);
      color.red   += 0.4 * usage / 100;
      color.green -= 0.2 * usage / 100;
      color.blue  -= 0.2 * usage / 100;

      infos.push({ percent: usage
                 , color: color
                 , text: 'Core ' + i + '    ' + usage.toFixed(0) + '%'
                 });

      last[i] = now;
    }

    layer = multiCircle({ infos: infos.reverse()
                        , center: { x: view.size.width / 2, y: view.size.height / 2 }
                        , innerRadius: 0.5 * view.size.width / 4
                        , outerRadius: view.size.width / 4
                        , gap: 2
                        , color: color
                        , opacity: 1.0
                        , baseColor: bottomColor
                        , baseOpacity: 0.4
                        , fontColor: fontColor
                        , fontFamily: fontFamily
                        });


    paper.view.update();

  }, 3000);
}

main();
