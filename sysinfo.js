function getNumCpus()
{
  var cpuinfo = File.read('/proc/cpuinfo');
  if (cpuinfo.error == null) {
    return cpuinfo.content.match(/^processor/mg).length;
  } else {
    return -1;
  }
}

function getProcStatLine(nthCpu)
{
  var core = 'cpu' + nthCpu;
  var file = File.read('/proc/stat');
  if (file.error == null) {
    var content = file['content'].split('\n');
    for (ln in content) {
      var line = content[ln];
      if (line.slice(0,core.length) == core) {
        return line.slice(core.length + 1);
      }
    }
    return 'no core info for ' + core;
  } else {
    return null;
  }
}

function coreInfo(nthCpu)
{
  var line = getProcStatLine(nthCpu);
  if (line != null) {
    var entries = line.split(' ');
    return { 'user':       parseInt(entries[0])
           , 'nice':       parseInt(entries[1])
           , 'system':     parseInt(entries[2])
           , 'idle':       parseInt(entries[3])
           , 'iowait':     parseInt(entries[4])
           , 'irq':        parseInt(entries[5])
           , 'softirq':    parseInt(entries[6])
           , 'steal':      parseInt(entries[7])
           , 'guest':      parseInt(entries[8])
           , 'guest_nice': parseInt(entries[9])
           };
  }
}

function cpuUsagePercent(pre, now)
{
  var diff_idle = (now.idle + now.iowait) - (pre.idle + pre.iowait);

  var now_total = now.user + now.system + now.idle + now.iowait;
                + now.irq + now.softirq + now.steal + now.guest + now.guest_nice;

  var pre_total = pre.user + pre.system + pre.idle + pre.iowait;
                + pre.irq + pre.softirq + pre.steal + pre.guest + pre.guest_nice;

  var diff_total = now_total - pre_total;

  return 100 * (diff_total - diff_idle) / diff_total;
}
