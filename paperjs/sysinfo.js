var columns = 2;

var gap = 10;
var radius = 50;
var strokeWidth = 40;
// var strokeColor = '#fedcba';
var strokeColor = '#abcdef';

var fontFamily = 'Ubuntu Light';
var fontSize = 20;

function toRad(angle)
{
  return angle / 180.0 * Math.PI;
}

function arcPathPoints(center, angle, radius)
{
  var rad         = toRad(angle);

      from_rel    = new Point(0, -radius);
      through_rel = new Point(Math.sin(rad / 2) * radius, -Math.cos(rad / 2) * radius);
      to_rel      = new Point(Math.sin(rad) * radius, -Math.cos(rad) * radius);

      from_abs    = new Point(center) + from_rel;
      through_abs = new Point(center) + through_rel;
      to_abs      = new Point(center) + to_rel;

  return { from: from_abs, through: through_abs, to: to_abs };
}

function getPosition(n)
{
  var col = n % columns;
  var row = Math.ceil((n+1) / columns) - 1;

  var x = strokeWidth / 2 + gap + radius
        + 2 * col * (strokeWidth / 2 + gap + radius);

  var y = strokeWidth / 2 + gap + radius
        + 2 * row * (strokeWidth / 2 + gap + radius);

  return new Point(x, y);
}

function renderUsageGraph(n, usage)
{
  if (usage < 100) {
    var angle = usage / 100 * 360;
    var points = arcPathPoints(getPosition(n), angle, radius);
    var arc = new Path.Arc(points);
  } else {
    var arc = new Path.Circle(
        { center: getPosition(n)
        , radius: radius
        });
  }

  arc.strokeColor = strokeColor;
  arc.strokeWidth = strokeWidth;

  return arc;
}

function renderUsageText(n, usage)
{
    var text = new PointText(
        { point:         getPosition(n)
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
  for (var i = 0; i < ncpus; ++i) {
    var c = new Path.Circle(
        { center: getPosition(i)
        , radius: radius
        , opacity: 0.3
        , strokeColor: '#808080'
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
