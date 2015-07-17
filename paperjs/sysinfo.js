var columns = 4;

var gap = 10;
var radius = 50;
var strokeWidth = 40;
var strokeColor = '#eea551';

var fontFamily = 'Ubuntu Light';
var fontColor = strokeColor;
var fontSize = 20;

var getPosition = window.common.getPosition;
var arcPathPoints = window.common.arcPathPoints;

function renderUsageGraph(n, usage)
{
  var data = { n: n, columns: columns, size: strokeWidth / 2 + gap + radius };
  if (usage < 100) {
    var angle = usage / 100 * 360;
    var points = arcPathPoints(getPosition(data), angle, radius);
    var arc = new Path.Arc(points);
  } else {
    var arc = new Path.Circle(
        { center: getPosition(data)
        , radius: radius
        });
  }

  arc.strokeColor = strokeColor;
  arc.strokeWidth = strokeWidth;

  return arc;
}

function renderUsageText(n, usage)
{
    var data = { n: n, columns: columns, size: strokeWidth / 2 + gap + radius };
    var text = new PointText(
        { point:         getPosition(data)
        , fillColor:     fontColor
        , fontFamily:    fontFamily
        , fontWeight:    'bold'
        , fontSize:      fontSize
        , justification: 'center'
        , content:       usage.toFixed(0) + '%'
        });

    // magic values..
    text.position.y += 8 * text.strokeBounds.height / 30;

    return text;
}

function main()
{
  var last = [];

  for (var i = 0; i < 8; ++i) {
    last[i] = coreInfo(i);
  }

  var ncpus = getNumCpus();

  var bottomLayer = new Layer();

  var bottomColor = new Color(strokeColor).convert('hsb')
  bottomColor.saturation = 0.2;

  for (var n = 0; n < ncpus; ++n) {
    var data = { n: n, columns: columns, size: strokeWidth / 2 + gap + radius };
    var c = new Path.Circle(
        { center: getPosition(data)
        , radius: radius
        , opacity: 0.5
        , strokeColor: bottomColor
        , strokeWidth: strokeWidth
        });
    bottomLayer.addChild(c);
  }

  var layer = new Layer();

  for (var i = 0; i < ncpus; ++i) {
    var usage = cpuUsagePercentSinceBoot(coreInfo(i));
    var graph = renderUsageGraph(i, usage);
    var text  = renderUsageText(i, usage);
    layer.addChild(graph);
    layer.addChild(text);
  }

  setInterval(function() {
    layer.removeChildren();

    for (var i = 0; i < ncpus; ++i) {
      var now = coreInfo(i);
      var usage = cpuUsagePercent(last[i], now)
      var graph = renderUsageGraph(i, usage);
      var text  = renderUsageText(i, usage);
      layer.addChild(graph);
      layer.addChild(text);
      last[i] = now;
    }

    paper.view.update();

  }, 3000);
}

main();
