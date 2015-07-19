window.common =
  { arcPathPoints: arcPathPoints
  , multiCircle: multiCircle
  , segmentPathPoints: segmentPathPoints
  , getPosition: getPosition
  , toRad: toRad
  , fromRad: fromRad
  , padConfig: padConfig
  };

// data.angle: arc angle from 0 on
// data.radius: radius of circle arc
// data.center: center position as Point
function arcPathPoints(data)
{
  return segmentPathPoints({ from: 0, to: data.angle, radius: data.radius, center: data.center });
}

// args.infos: [{ percent: v, text: v }]
// args.innerRadius: radius of smallest circle
// args.outerRadius: radius of biggest circle
// args.center: center position as Point
// args.circleGap: gap between circle segments
// args.color: color of status circle segment
// args.opacity: opacity of stauts circle segment
// args.baseColor: color of background circle
// args.baseOpacity: opacity of background circle
function multiCircle(args)
{
  var infos       = args.infos;
      center      = args.center;
      innerRadius = args.innerRadius;
      outerRadius = args.outerRadius;
      circleGap   = args.circleGap;
      color       = args.color;
      opacity     = args.opacity;
      baseColor   = args.baseColor;
      baseOpacity = args.baseOpacity;
      fontColor   = args.fontColor;
      fontFamily  = args.fontFamily;
      relFontSize = args.relFontSize;

      width       = (outerRadius - innerRadius) / infos.length - circleGap;

  var layer = new Layer();

  var n = 0;
  infos.forEach(function(info) {

    // augment info with radius
    {
      info.radius = innerRadius + n * (circleGap + width);
      ++n;
    }

    // create base circle
    {
      var from = 90;
          to   = 360;
          points = segmentPathPoints({ center: center, radius: info.radius, from: from, to: to });
          arc = new Path.Arc(points);

      arc.opacity = baseOpacity;
      arc.strokeColor = baseColor;
      arc.strokeWidth = width;

      layer.addChild(arc);
    }

    // create actual segment
    {
      var radius  = info.radius;
          percent = info.percent;
          from    = (100 - 0.75 * percent) / 100 * 360;
          to      = 360;

          points = segmentPathPoints({ center: center, radius: radius, from: from, to: to });
          arc = new Path.Arc(points)

      arc.strokeWidth = width;
      arc.strokeColor = info.color == null ? color : info.color;
      arc.opacity     = info.opacity == null ? opacity : info.opacity;

      layer.addChild(arc);

      var text = new PointText(
          { point:         { x: center.x + 0.5 * width, y: center.y - radius }
          , fillColor:     fontColor
          , fontFamily:    fontFamily
          , fontWeight:    'bold'
          , fontSize:      relFontSize * width
          , justification: 'left'
          , content:       info.text
          });

      // magical values
      text.position.y += 85 * text.strokeBounds.height / 300;

      layer.addChild(text);
    }

  });

  return layer;
}

// draw a circle segment beginning at from and ending at to
// data.from: angle in degrees (360) where the segment should begin
// data.to:   angle in degrees (360) where the segment should end
// data.radius: circle radius
// data.center: circle center position as Point
function segmentPathPoints(args)
{
  var from_angle = toRad(args.from);
      to_angle   = toRad(args.to);
      radius     = args.radius;
      center     = args.center;

      through_angle = from_angle + (to_angle - from_angle) / 2;

      from_rel      = new Point(Math.sin(from_angle) * radius, -Math.cos(from_angle) * radius);
      through_rel   = new Point(Math.sin(through_angle) * radius, -Math.cos(through_angle) * radius);
      to_rel        = new Point(Math.sin(to_angle) * radius, -Math.cos(to_angle) * radius);

      from_abs      = new Point(center) + from_rel;
      through_abs   = new Point(center) + through_rel;
      to_abs        = new Point(center) + to_rel;

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

function toRad(angle)
{
  return angle / 180.0 * Math.PI;
}

function fromRad(rad)
{
  return rad * 180.0 / Math.PI;
}

function padConfig(defaultConfig, partialConfig)
{
  if (partialConfig == null) {
    return defaultConfig;
  }

  for (var p in defaultConfig) {
    if (partialConfig[p] == null) {
      partialConfig[p] = defaultConfig[p];
    }
  }
  return partialConfig;
}
