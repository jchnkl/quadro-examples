var State =
  { Unknown:     0
  , Charging:    1
  , Discharging: 2
  };

function toState(status)
{
  switch(status) {
    case 'Unknown': return State.Unknown;
    case 'Charging': return State.Charging;
    case 'Discharging': return State.Discharging;
  };
}

function devicePath(dev)
{
  var sysPath = window.sysfs.path + '/class/power_supply/';
  return sysPath + dev
}

function getState(dev)
{
  var mstate = File.read(devicePath(dev) + '/status');
  if (mstate.error == null) {
    return toState(mstate.content.replace(/\n/,''));
  } else {
    return null;
  }
}

if (window.sysfs == null) {
  window.sysfs = { path: '/sys' }
}

window.sysfs.battery =
  { State: State
  , getState: getState
  };
