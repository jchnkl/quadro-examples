var BatteryInfo =
  { main: main
  , render: render
  , update: update
  , getBatteryInfo: getBatteryInfo
  };

var padConfig   = window.common.padConfig;
var multiCircle = window.common.multiCircle;
var State       = window.sysinfo.battery.State;
var getState    = window.sysinfo.battery.getState;

function updateState(path)
{
  var nativePath = upowerGetNativePath(path);
  this.status[path].state = getState(nativePath);
}

// TODO: update when device added / removed

function update(msg)
{
  if (msg.signal == 'PropertiesChanged') {
    this.infos[msg.path] = this.getBatteryInfo(
        { path: msg.path, properties: msg.contents[1] });
  }

  this.render();
}

function getTime(seconds)
{
  var date = new Date(null);
  date.setSeconds(seconds);
  return { hours: date.getUTCHours()
         , minutes: date.getUTCMinutes()
         , seconds: date.getUTCSeconds()
         };
}

function getBatteryInfo(args)
{
  var path       = args.path;
      properties = args.properties

      rawtime    = null;
      color      = this.config.unknownColor;
      nativePath = upowerGetNativePath(path);

  switch (getState(nativePath)) {
    case State.Charging:
      color = this.config.chargingColor;
      rawtime = properties.TimeToFull;
      break;
    case State.Discharging:
      color = this.config.dischargingColor;
      rawtime = properties.TimeToEmpty;
      break;
    default:
      color = this.config.unknownColor;
      rawtime = properties.TimeToEmpty;
      break;
  };

  var percent = properties.Percentage;

  var max_color = new Color('#618a3d');
  var med_color = new Color('#eee04c');
  var min_color = new Color('#ec3b3b');

  var pcent = percent / 100;
  var color = new Color(null);

  var med = Math.abs(Math.round(pcent) * 2 - pcent * 2);
      min = (1 - pcent) - med / 2;
      max = pcent - med / 2;

  color.red   = max * max_color.red   + med * med_color.red   + min * min_color.red;
  color.green = max * max_color.green + med * med_color.green + min * min_color.green;
  color.blue  = max * max_color.blue  + med * med_color.blue  + min * min_color.blue;

  var text = '';

  if (rawtime == 0) {
    text = nativePath + ': ' + percent.toFixed(0) + '%';
  } else {
    var time    = getTime(rawtime);
        hours   = ('00' + time.hours).slice(-2)
        minutes = ('00' + time.minutes).slice(-2)
        seconds = ('00' + time.seconds).slice(-2)
    text = hours + ':' + minutes + ':' + seconds
         + '@' + (Math.round(properties.EnergyRate * 100) / 100) + 'W';
  }

  return { percent: percent
         , color: color
         , text: text
         };
}

function render()
{
  this.layer.removeChildren();

  var infos = [];
  for (var p in this.infos) {
    infos.push(this.infos[p]);
  }

  this.layer = multiCircle({ infos:         infos
                           , center:        this.config.center
                           , innerRadius:   this.config.innerRadius
                           , outerRadius:   this.config.outerRadius

                           , circleGap:     this.config.circleGap

                           , statusColor:   this.config.statusColor
                           , statusCpacity: this.config.statusCpacity

                           , fontFamily:    this.config.fontFamily
                           , fontColor:     this.config.fontColor
                           , relFontSize:   this.config.relFontSize

                           , baseColor:     this.config.baseColor
                           , baseOpacity:   this.config.baseOpacity
                           });

  paper.view.update();
}

function main()
{
  var radius = Math.min(view.size.width, view.size.height);

  var defaultConfig =
    { interval:         3

    , center:           { x: view.size.width / 2, y: view.size.height / 2 }

    , innerRadius:      0.5 * radius / 2
    , outerRadius:      radius / 2

    , circleGap:        2

    , statusColor:      '#85b3c4'
    , statusCpacity:    1.0

    , fontFamily:       'Ubuntu Condensed'
    , fontColor:        '#85b3c4'
    , relFontSize:      0.75

    , baseOpacity:      0.6

    , unknownColor:     '#808080'
    , chargingColor:    '#00f000'
    , dischargingColor: '#f00000'
    };

  defaultConfig.baseColor = new Color(defaultConfig.statusColor).convert('hsb');
  defaultConfig.baseColor.saturation = 0.2;

  var self = this;

  self.config = padConfig(defaultConfig, null);
  self.layer = new Layer();
  self.infos = {};

  upowerEnumerateDevices().forEach(function(path) {
    if (upowerGetType(path) == Type.Battery) {
      self.infos[path] = self.getBatteryInfo(
          { path: path, properties: upowerGetDeviceProperties(path) });

      DBus.system.attach(
          'org.freedesktop.UPower',
          path,
          'org.freedesktop.DBus.Properties',
          'PropertiesChanged');
    }
  });

  self.render();

  DBus.system.notify.connect(self, self.update);
}

BatteryInfo.main()
