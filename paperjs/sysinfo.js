var columns = 4;

var gap = 10;
var radius = 50;
var strokeWidth = 40;
var strokeColor = '#eea551';

var fontFamily = 'Ubuntu Light';
var fontColor = strokeColor;
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

// data.size: size of element
// data.n: position for nth element
// data.columns: arrange elements x columns
function getPosition(data)
{
  var col = data.n % data.columns;
  var row = Math.ceil((data.n+1) / data.columns) - 1;

  var x = data.size + 2 * col * data.size;
  var y = data.size + 2 * row * data.size;

  return new Point(x, y);
}

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
