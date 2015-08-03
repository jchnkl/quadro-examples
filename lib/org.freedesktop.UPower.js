var upowerService =  'org.freedesktop.UPower';

var Type = {
  Unknown:    0,
  LinePower:  1,
  Battery:    2,
  Ups:        3,
  Monitor:    4,
  Mouse:      5,
  Keyboard:   6,
  Pda:        7,
  Phone:      8
};

function upowerOnBattery()
{
  var path   = '/org/freedesktop/UPower';
  var iface  = 'org.freedesktop.DBus.Properties';
  var method = 'Get';
  var arg1   = 'org.freedesktop.UPower';
  var arg2   = 'OnBattery';
  return DBus.system.call(upowerService, path, iface, method, arg1, arg2);
}

function upowerGetDeviceProperty(devicePath, property)
{
  var iface  = 'org.freedesktop.DBus.Properties';
  var method = 'Get';
  var arg1   = 'org.freedesktop.UPower.Device';
  return DBus.system.call(upowerService, devicePath, iface, method, arg1, property);
}

function upowerGetDeviceProperties(devicePath)
{
  var iface  = 'org.freedesktop.DBus.Properties';
  var method = 'GetAll';
  var arg1   = 'org.freedesktop.UPower.Device';
  return DBus.system.call(upowerService, devicePath, iface, method, arg1);
}

function upowerEnumerateDevices()
{
  var iface  = 'org.freedesktop.UPower';
  var path   = '/org/freedesktop/UPower';
  var method = 'EnumerateDevices';
  return DBus.system.call(upowerService, path, iface, method);
}

function upowerGetNativePath(devicePath)
{
  return upowerGetDeviceProperty(devicePath, 'NativePath');
}

function upowerGetType(devicePath)
{
  return upowerGetDeviceProperty(devicePath, 'Type');
}
