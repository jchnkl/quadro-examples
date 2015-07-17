var batteries = [];

upowerEnumerateDevices().forEach(function(dev) {
  if (upowerGetType(dev) == Type.Battery) {
    batteries.push(dev);
  }
});

var fontFamily = 'Ubuntu Light';
var fontSize = 50;

var statusGap = 10;
var statusRadius = 50;
var statusStrokeWidth = 40;

var statusEmptyColor   = '#ff0000';
var statusFullColor    = '#00ff00';
var statusNeutralColor = '#808080';

/******************************************************************************/

var sysPath = '/sys/class/power_supply';

var size = view.size;
var center = { x: size.width / 2, y: size.height / 2 };

var g_status = {};
var g_base_circles = new Layer();
var g_status_circles = new Layer();

var getPosition = window.common.getPosition;
var arcPathPoints = window.common.arcPathPoints;

var State = {
  Unknown:     0,
  Charging:    1,
  Discharging: 2
};

function toState(status)
{
  switch(status) {
    case 'Unknown': return State.Unknown;
    case 'Charging': return State.Charging;
    case 'Discharging': return State.Discharging;
  };
}

function updateState(path)
{
  var nativePath = upowerGetNativePath(path);
  var mstate = File.read(sysPath + '/' + nativePath + '/status');
  if (mstate.error == null) {
    g_status[path].state = toState(mstate.content.replace(/\n/,''));
  }
}

function initPercentage()
{
  for (var i in batteries) {
    var path = batteries[i];
    var nativePath = upowerGetNativePath(path);

    g_status[path] = { 'state': null, 'percentage': null };

    g_status[path].percentage = upowerGetDeviceProperty(path, 'Percentage');

    // upower state is unreliable
    var mstate = File.read(sysPath + '/' + nativePath + '/status');

    if (mstate.error == null) {
      g_status[path].state = toState(mstate.content.replace(/\n/,''));
    }
  }
}

function initBaseCircles()
{
  var i = 0;
  for (var path in g_status) {
    var posargs = { n: i, columns: 1, size: statusStrokeWidth / 2 + statusGap + statusRadius };
    var c = new Path.Circle(
        { center: getPosition(posargs)
        , radius: statusRadius
        , opacity: 0.4
        , strokeColor: statusNeutralColor
        , strokeWidth: statusStrokeWidth
        });

    g_base_circles.addChild(c);
    ++i;
  }
}

function renderStatusCircles()
{
  g_status_circles.removeChildren();

  var i = 0;
  for (var path in g_status) {
    var state      = g_status[path].state;
    var percentage = g_status[path].percentage;

    var angle = percentage / 100 * 360;
    var posargs = { n: i, columns: 1, size: statusStrokeWidth / 2 + statusGap + statusRadius };
    var points = arcPathPoints({ center: getPosition(posargs), angle: angle, radius: statusRadius });
    var arc = new Path.Arc(points);

    switch (state) {
      case State.Unknown:
        arc.strokeColor = statusNeutralColor;
        break;
      case State.Charging:
        arc.strokeColor = statusFullColor;
        break;
      case State.Discharging:
        arc.strokeColor = statusEmptyColor;
        break;
    }

    arc.strokeWidth = statusStrokeWidth;

    g_status_circles.addChild(arc);
    ++i;
  }

  paper.view.update();
}

function update(msg)
{
  if (msg.signal == 'PropertiesChanged') {
    updateState(msg.path);
    g_status[msg.path]['percentage'] = msg.contents[1]['Percentage'];
  }
  renderStatusCircles();
}

initPercentage();
initBaseCircles();
renderStatusCircles();

DBus.system.attach(
    'org.freedesktop.UPower',
    '/org/freedesktop/UPower/devices/battery_BAT1',
    'org.freedesktop.DBus.Properties',
    'PropertiesChanged');

DBus.system.notify.connect(this, update);
