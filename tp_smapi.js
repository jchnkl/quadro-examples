var TpSmapi = {
  IDLE        : 0,
  CHARGING    : 1,
  DISCHARGING : 2,

  path: '/sys/devices/platform/smapi/',

  state: function(bat)
  {
    var state = file.read(this.path + 'BAT' + bat + '/state');

    if (f.error == null) {
      if (state == 'idle') {
        return IDLE;
      } else if (state == 'charging') {
        return CHARGING;
      } else if (state == 'discharging') {
        return DISCHARGING;
      }
    } else {
      return null;
    }
  },

  remainingPercent: function(bat)
  {
    var f = file.read(this.path + 'BAT' + bat + '/remaining_percent');
    if (f.error == null) {
      return f.content;
    } else {
      return null;
    }
  },

  remainingRunningTime: function(bat)
  {
    var f = file.read(this.path + 'BAT' + bat + '/remaining_running_time');
    if (f.error == null) {
      if (f.content == 'not_discharging') {
        return null;
      } else {
        return f.content;
      }
    } else {
      return null;
    }
  }
};

// function onLoad()
// {
//   var dev = '/org/freedesktop/UPower/devices/battery_BAT0';
//   document.getElementById('battery').innerHTML = 'Battery';
//   document.getElementById('battery').innerHTML += '<br>';
//   document.getElementById('battery').innerHTML += upowerOnBattery();
//   document.getElementById('battery').innerHTML += '<br>';
//   document.getElementById('battery').innerHTML += upowerGetDeviceProperty(dev, 'Percentage');
//   document.getElementById('battery').innerHTML += '<br>';
//
//   var properties = upowerGetDeviceProperties(dev);
//
//   document.getElementById('battery').innerHTML +=
//     '<img id=\"icon\" src=\"' + getIconPath(properties['IconName']) + '\" alt=\"'
//     + properties['IconName'] + '\"></img>'
//
//   // for (p in properties) {
//   //   var tmp = 'properties[' + p + '] = ' + properties[p];
//   //   document.getElementById('battery').innerHTML += '<br>';
//   //   document.getElementById('battery').innerHTML += tmp;
//   // }
//
//   var smapi_state_file = '/sys/devices/platform/smapi/BAT0/state';
//   var state = file.read(smapi_state_file);
//
//   document.getElementById('battery').innerHTML += '<br>';
//   if (state.error == null) {
//     document.getElementById('battery').innerHTML += 'state.content: ' + state.content;
//   } else {
//     document.getElementById('battery').innerHTML += 'state.error: ' + state.error;
//   }
//
//   /*
//   document.getElementById('battery').innerHTML += '<br>';
//   // document.getElementById('battery').innerHTML += file.read(smapi_state_file);
//   var state = file.open(smapi_state_file);
//
//   // document.getElementById('battery').innerHTML += 'typeof file: ' + typeof file + '<br>';
//   // for (p in file) {
//   //   document.getElementById('battery').innerHTML += 'state[' + p + '] = ' + file[p];
//   //   document.getElementById('battery').innerHTML += '<br>';
//   // }
//
//   document.getElementById('battery').innerHTML += 'typeof state: ' + typeof state + '<br>';
//   for (p in state) {
//     document.getElementById('battery').innerHTML += 'state[' + p + '] = ' + state[p];
//     document.getElementById('battery').innerHTML += '<br>';
//   }
//
//   document.getElementById('battery').innerHTML += 'content: ' + state.content;
//   document.getElementById('battery').innerHTML += '<br>';
//   */
//
//   /*
//   var test = file.test;
//   document.getElementById('battery').innerHTML += 'typeof test: ' + typeof test;
//   document.getElementById('battery').innerHTML += '<br>';
//   document.getElementById('battery').innerHTML += 'typeof test.content: ' + typeof test.content;
//   document.getElementById('battery').innerHTML += '<br>';
//   document.getElementById('battery').innerHTML += 'typeof test.error: ' + typeof test.error;
//   document.getElementById('battery').innerHTML += '<br>';
//   document.getElementById('battery').innerHTML += 'test.content: ' + test.content;
//   document.getElementById('battery').innerHTML += '<br>';
//   document.getElementById('battery').innerHTML += 'test.error: ' + test.error;
//   document.getElementById('battery').innerHTML += '<br>';
//
//   for (p in test) {
//     document.getElementById('battery').innerHTML += 'test[' + p + '] = ' + test[p];
//     document.getElementById('battery').innerHTML += '<br>';
//   }
//
//   var test2 = file.test2;
//   document.getElementById('battery').innerHTML += 'typeof test2: ' + typeof test2;
//   document.getElementById('battery').innerHTML += '<br>';
//   document.getElementById('battery').innerHTML += 'typeof test2.content: ' + typeof test2.content;
//   document.getElementById('battery').innerHTML += '<br>';
//   document.getElementById('battery').innerHTML += 'typeof test2.error: ' + typeof test2.error;
//   document.getElementById('battery').innerHTML += '<br>';
//   document.getElementById('battery').innerHTML += 'test2.content: ' + test2.content;
//   document.getElementById('battery').innerHTML += '<br>';
//   document.getElementById('battery').innerHTML += 'test2.error: ' + test2.error;
//   document.getElementById('battery').innerHTML += '<br>';
//
//   for (p in test2) {
//     document.getElementById('battery').innerHTML += 'test2[' + p + '] = ' + test2[p];
//     document.getElementById('battery').innerHTML += '<br>';
//   }
//   */
//
// }
//     </script>
//   </head>
//   <body onload='onLoad();'>
//     <div id='battery'>
//     </div>
//   </body>
// </html>
