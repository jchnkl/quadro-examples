window.common =
  { toRad: toRad
  , multiCircle: multiCircle
  , arcPathPoints: arcPathPoints
  , segmentPathPoints: segmentPathPoints
  , getPosition: getPosition
  };

function toRad(angle)
{
  return angle / 180.0 * Math.PI;
}

function fromRad(rad)
{
  return rad * 180.0 / Math.PI;
}

// data.angle: arc angle from 0 on
// data.radius: radius of circle arc
// data.center: center position as Point
function arcPathPoints(data)
{
  return segmentPathPoints({ from: 0, to: data.angle, radius: data.radius, center: data.center });
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

// args.infos: [{ percent: v, text: v }]
// args.innerRadius: radius of smallest circle
// args.outerRadius: radius of biggest circle
// args.center: center position as Point
// args.gap: gap between circle segments
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
      gap         = args.gap;
      color       = args.color;
      opacity     = args.opacity;
      baseColor   = args.baseColor;
      baseOpacity = args.baseOpacity;
      fontColor   = args.fontColor;
      fontFamily  = args.fontFamily;
      // fontSize    = args.fontSize;

      width       = (outerRadius - innerRadius) / infos.length - gap;

  for (var i = 0; i < infos.length; ++i) {
    infos[i].radius = innerRadius + i * (gap + width);
  }

  var layer = new Layer();

  for (var i = 0; i < infos.length; ++i) {
    // var posargs = { n: i, columns: 1, size: statusStrokeWidth / 2 + statusGap + statusRadius };
    // var c = new Path.Circle(
    //     // { center: getPosition(posargs)
    //     { center: center
    //     , radius: infos[i].radius
    //     , opacity: baseOpacity
    //     , strokeColor: baseColor
    //     , strokeWidth: width
    //     });

    var from = 90;
        to   = 360;
        points = segmentPathPoints({ center: center, radius: infos[i].radius, from: from, to: to });
        arc = new Path.Arc(points);

    arc.opacity = baseOpacity;
    arc.strokeColor = baseColor;
    arc.strokeWidth = width;

    layer.addChild(arc);

    // layer.addChild(c);
  }
    // console.log('width: ' + width);

  // var i = 0;
  infos.forEach(function(info) {
    // var radius = innerRadius + i * (gap + width);

    var radius  = info.radius;
        percent = info.percent;
        from    = (100 - 0.75 * percent) / 100 * 360;
        to      = 360;

        points = segmentPathPoints({ center: center, radius: radius, from: from, to: to });
        arc = new Path.Arc(points)

    // console.log('percent: ' + info.percent + '; text: ' + info.text + '; radius: ' + (center.y - radius));
    // for (p in points) {
    //   console.log('points[' + p + ']: ' + points[p]);
    // }

    arc.strokeColor = info.color == null ? color : info.color;
    arc.opacity     = info.opacity == null ? opacity : info.opacity;
    // if (info.color == null) {
    //   arc.strokeColor = color;
    // } else {
    //   arc.strokeColor = info.color;
    // }

    arc.strokeWidth = width;
    // arc.opacity     = opacity;

    layer.addChild(arc);

    var textX    = center.x + 0.5 * width;
        textY    = center.y - radius ; // + textSize / 2;
        textSize = 0.9 * width;

    var text = new PointText(
        { point:         { x: textX, y: textY }
        , fillColor:     fontColor
        , fontFamily:    fontFamily
        , fontWeight:    'bold'
        , fontSize:      textSize
        , justification: 'left'
        , content:       info.text
        });

    // text.position.y += text.bounds.height / 3;
    text.position.y += 85 * text.strokeBounds.height / 300;

    // text.bounds.height = width;

    layer.addChild(text);

  });

  return layer;
}
