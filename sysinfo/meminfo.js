function readMemInfo()
{
  var file = File.read('/proc/meminfo');
  if (file.error == null) {
    return file.content.split('\n');
  } else {
    return null;
  }
}

function toMemInfo(lines)
{
  var info = {};
  // last line is only '\n'
  for (var i = 0, l = lines.length - 1; i < l; ++i) {
    var line = lines[i];
    var entries = line.split(':');
    var key = entries[0];
    var value = parseInt(entries[1].replace(/\s+/g,' ').trim().split(' ')[0]);
    info[key] = value;
  }
  return info
}

function getMemInfo()
{
  return toMemInfo(readMemInfo());
}

if (window.sysinfo == null) {
  window.sysinfo = {}
}

window.sysinfo.meminfo =
  { readMemInfo: readMemInfo
  , toMemInfo: toMemInfo
  , getMemInfo: getMemInfo
  };
