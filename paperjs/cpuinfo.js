var CpuInfo =
  { main: main
  , renderUsage: renderUsage
  , getUsageInfos: getUsageInfos
  };

var multiCircle = window.common.multiCircle;

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

function renderUsage(infos)
{
  return multiCircle({ infos:         infos.reverse()
                     , center:        this.config.center
                     , innerRadius:   this.config.innerRadius
                     , outerRadius:   this.config.outerRadius

                     , circleGap:     this.config.circleGap

                     , statusColor:   this.config.statusColor
                     , statusCpacity: this.config.statusCpacity

                     , fontFamily:    this.config.fontFamily
                     , fontColor:     this.config.fontColor
                     , fontSize:      this.config.fontSize

                     , baseColor:     this.config.baseColor
                     , baseOpacity:   this.config.baseOpacity
                     });
}

function getUsageInfos(getCoreUsage)
{
  var infos = [];

  for (var n = 0; n < this.ncpus; ++n) {
      var usage = getCoreUsage(n);

      var color = new Color(this.config.statusColor);
      color.red   += 0.4 * usage / 100;
      color.green -= 0.2 * usage / 100;
      color.blue  -= 0.2 * usage / 100;

      infos.push({ percent: usage
                 , color: color
                 , text: 'Core ' + n + '    ' + usage.toFixed(0) + '%'
                 });
  }

  return infos;
}

function main()
{
  var defaultConfig =
    { center: { x: view.size.width / 2, y: view.size.height / 2 }

    , innerRadius: 0.5 * view.size.width / 2
    , outerRadius: view.size.width / 2

    , circleGap:         10

    , statusColor: '#85b3c4'
    , statusCpacity: 1.0

    , fontFamily:  'Ubuntu Light'
    , fontColor:   '#85b3c4'
    , fontSize:    15

    , baseOpacity: 0.6
    }

  defaultConfig.baseColor = new Color(defaultConfig.statusColor).convert('hsb');
  defaultConfig.baseColor.saturation = 0.2;

  var self = this;

  self.config = padConfig(defaultConfig, null);
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

    layer = self.renderUsage(infos);

    paper.view.update();
  }, 3000)
}

CpuInfo.main();
