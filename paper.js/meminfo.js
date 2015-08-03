var getMemInfo = window.sysinfo.meminfo.getMemInfo;

var MemInfo =
  { main: main
  , renderUsage: renderUsage
  };

var padConfig   = window.common.padConfig;
var multiCircle = window.common.multiCircle;
var colorMix    = window.common.colorMix;
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
  var meminfo   = getMemInfo();
      memTotal  = meminfo.MemTotal;
      swapTotal = meminfo.SwapTotal;

  var infos = [];

  function addInfo(max_len, name, percent)
  {
    var ws = Array(max_len - name.length + 1).join(' ');
    infos.push({ percent: percent.toFixed(2), text: name + '%' + ws + percent.toFixed(0) });
  }

  var max_len = 16; // Committed_AS

  var ps = [ 'Committed_AS'
           , 'Buffers'
           , 'Cached'
           , 'Active'
           , 'Inactive'
           , 'Dirty'
           , 'Writeback'
           ];

  addInfo(max_len, 'MemUsed', (memTotal - meminfo.MemAvailable) / memTotal * 100);

  ps.forEach(function(p) {
    addInfo(max_len, p, meminfo[p] / memTotal * 100);
  });

  if (swapTotal > 0) {
    addInfo(max_len, 'SwapUsed', (swapTotal - meminfo.SwapFree) / swapTotal * 100);
    addInfo(max_len, 'SwapCached', meminfo.SwapCached / swapTotal * 100);
  }

  return infos;
}

function addUsageColor(info)
{
  info.color = colorMix({ percent: info.percent / 100
                        , min_color: '#618a3d'
                        , med_color: '#eee04c'
                        , max_color: '#ec3b3b'
                        });
  return info;
}

function main()
{
  var radius = Math.min(view.size.width, view.size.height);

  var defaultConfig =
    { interval:      3

    , center:        { x: view.size.width / 2, y: view.size.height / 2 }

    , innerRadius:   0.1 * radius / 2
    , outerRadius:   radius / 2

    , circleGap:     2

    , statusColor:   '#85b3c4'
    , statusCpacity: 1.0

    , fontFamily:    'Ubuntu Mono'
    , fontColor:     '#535353'
    , relFontSize:   0.85

    , baseColor:     '#808080'
    , baseOpacity:   0.75
    };

  // for setInterval
  var self = this;

  self.config = padConfig(defaultConfig, window.meminfo.config);

  self.layer = self.renderUsage(getUsageInfos().map(addUsageColor));

  setInterval(function() {
    self.layer.removeChildren();

    self.layer = self.renderUsage(getUsageInfos().map(addUsageColor));

    paper.view.update();
  }, self.config.interval * 1000)
}

MemInfo.main();
