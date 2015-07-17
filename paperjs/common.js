window.common = {
  toRad: toRad,
  arcPathPoints: arcPathPoints,
  getPosition: getPosition,
};

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
