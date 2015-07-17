window.common =
  { toRad: toRad
  , arcPathPoints: arcPathPoints
  , segmentPathPoints: segmentPathPoints
  , getPosition: getPosition
  };

function toRad(angle)
{
  return angle / 180.0 * Math.PI;
}

// data.angle: arc angle from 0 on
// data.radius: radius of circle arc
// data.center: center position as Point
function arcPathPoints(data)
{
  var rad         = toRad(data.angle);

      from_rel    = new Point(0, -data.radius);
      through_rel = new Point(Math.sin(rad / 2) * data.radius, -Math.cos(rad / 2) * data.radius);
      to_rel      = new Point(Math.sin(rad) * data.radius, -Math.cos(rad) * data.radius);

      from_abs    = new Point(data.center) + from_rel;
      through_abs = new Point(data.center) + through_rel;
      to_abs      = new Point(data.center) + to_rel;

  return { from: from_abs, through: through_abs, to: to_abs };
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
