var getMemInfo = window.sysinfo.meminfo.getMemInfo;

var CpuInfo =
  { main: main
  , renderUsage: renderUsage
  , getUsageInfos: getUsageInfos
  };

var padConfig   = window.common.padConfig;
var multiCircle = window.common.multiCircle;
var getMemInfo  = window.sysinfo.meminfo.getMemInfo;

function renderUsage(infos)
{
  return multiCircle({ infos:         infos
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
}

function getUsageInfos()
{
  var infos = [];

  var meminfo = getMemInfo();
      total   = meminfo.MemTotal;
      active  = meminfo.Active;

      usage = (total - active) / total * 100;

  var min_color = new Color('#618a3d');
  var med_color = new Color('#eee04c');
  var max_color = new Color('#ec3b3b');

  var percent = usage / 100;
  var color = new Color(null);

  var med = Math.abs(Math.round(percent) * 2 - percent * 2);
      min = (1 - percent) - med / 2;
      max = percent - med / 2;

  color.red   = max * max_color.red   + med * med_color.red   + min * min_color.red;
  color.green = max * max_color.green + med * med_color.green + min * min_color.green;
  color.blue  = max * max_color.blue  + med * med_color.blue  + min * min_color.blue;

  infos.push({ percent: usage
             , color: color
             , text: 'Mem% ' + usage.toFixed(0)
             });

  return infos;
}

function main()
{
  var radius = Math.min(view.size.width, view.size.height);

  var defaultConfig =
    { interval:      3

    , center:        { x: view.size.width / 2, y: view.size.height / 2 }

    , innerRadius:   0.4 * radius / 2
    , outerRadius:   radius / 2

    , circleGap:     0

    , statusColor:   '#85b3c4'
    , statusCpacity: 1.0

    , fontFamily:    'Ubuntu Condensed'
    , fontColor:     '#535353'
    , relFontSize:   0.5

    , baseColor:     '#808080'
    , baseOpacity:   0.75
    };

  // for setInterval
  var self = this;

  self.config = padConfig(defaultConfig, window.meminfo.config);

  self.layer = self.renderUsage(self.getUsageInfos());

  setInterval(function() {
    self.layer.removeChildren();

    self.layer = self.renderUsage(self.getUsageInfos());

    paper.view.update();
  }, self.config.interval * 1000)
}

CpuInfo.main();
