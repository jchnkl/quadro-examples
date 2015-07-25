var CpuInfo =
  { main: main
  , renderUsage: renderUsage
  , getUsageInfos: getUsageInfos
  };

var padConfig                = window.common.padConfig;
var multiCircle              = window.common.multiCircle;
var getNumCpus               = window.sysinfo.cpuinfo.getNumCpus;
var coreInfo                 = window.sysinfo.cpuinfo.coreInfo;
var cpuUsagePercent          = window.sysinfo.cpuinfo.cpuUsagePercent;
var cpuUsagePercentSinceBoot = window.sysinfo.cpuinfo.cpuUsagePercentSinceBoot;

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

function getUsageInfos(getCoreUsage)
{
  var infos = [];

  for (var n = 0; n < this.ncpus; ++n) {
    var usage = getCoreUsage(n);

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
               , text: 'core' + (n+1) + '% ' + usage.toFixed(0)
               });
  }

  return infos;
}

function main()
{
  var radius = Math.min(view.size.width, view.size.height);

  var defaultConfig =
    { interval:      3

    , center:        { x: view.size.width / 2, y: view.size.height / 2 }

    , innerRadius:   0.25 * radius / 2
    , outerRadius:   radius / 2

    , circleGap:     2

    , statusColor:   '#85b3c4'
    , statusCpacity: 1.0

    , fontFamily:    'Ubuntu Mono'
    , fontColor:     '#636363'
    , relFontSize:   0.8

    , baseColor:     '#808080'
    , baseOpacity:   0.75
    };

  // for setInterval
  var self = this;

  self.config = padConfig(defaultConfig, window.cpuinfo.config);
  self.ncpus = getNumCpus();
  self.last = [];

  for (var n = 0; n < 8; ++n) {
    self.last[n] = coreInfo(n);
  }

  var infos = self.getUsageInfos(function(n) {
    return cpuUsagePercentSinceBoot(coreInfo(n));
  });

  self.layer = self.renderUsage(infos);

  setInterval(function() {
    self.layer.removeChildren();

    var infos = self.getUsageInfos(function(n) {
      var now = coreInfo(n);
      old = self.last[n];
      self.last[n] = now;
      return cpuUsagePercent(old, now);
    });

    self.layer = self.renderUsage(infos);

    paper.view.update();
  }, self.config.interval * 1000)
}

CpuInfo.main();
