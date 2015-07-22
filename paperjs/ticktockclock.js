var size = view.size;
var center = { x: size.width / 2, y: size.height / 2 };

var fontFamily = 'Ubuntu Light';
var fontSize = 40;

var hourStrokeWidth = 35;
var hourStrokeColor = '#85b3c4';
var hourFontSize = 65;
var hourFontColor = '#85b3c4';
var hourFontFamily = fontFamily;

var minuteStrokeWidth = 25;
var minuteStrokeColor = '#b7ba52';
var minuteFontSize = 55;
var minuteTrailLength = 15;
var minuteFontColor = '#b7ba52';
var minuteFontFamily = fontFamily;

var secondStrokeWidth = 15;
var secondStrokeColor = '#eea551';
var secondFontSize = 40;
var secondTrailLength = 15;
var secondFontColor = '#eea551';
var secondFontFamily = fontFamily;

var dateFontSize = fontSize * 0.5;
var dateFontColor = '#b3b3b3';

var secondRadius = (size.width - 2 * secondStrokeWidth) / 2;
var minuteRadius = secondRadius - minuteStrokeWidth;
var hourRadius = minuteRadius - hourStrokeWidth;

var segmentPathPoints = window.common.segmentPathPoints;

function segmentPath(center, radius, time_base, time)
{
  var gap    = 0.5;
      angle  = (time / time_base) * 360;
      width  = 360 / time_base;
      from   = angle - width + gap;
      to     = angle - gap;

      points = segmentPathPoints({ from: from, to: to, radius: radius, center: center });
      arc    = new Path.Arc(points);

  arc.opacity = 0.9;

  return arc;
}

function secondPath(center, second)
{
  var arc = segmentPath(center, secondRadius, 60, second);
  arc.strokeWidth = secondStrokeWidth;
  arc.strokeColor = secondStrokeColor;
  // arc.strokeColor = secondColors[second];
  // arc.opacity = 1.0;
  // var gradient = new Gradient([secondStrokeColor, minuteStrokeColor]);
  // arc.strokeColor = { gradient: { stops: [secondStrokeColor, minuteStrokeColor] }
  //   , origin: topLeft, destination: bottomRight } ;

  return arc;
}

function minutePath(center, minute)
{
  var arc = segmentPath(center, minuteRadius, 60, minute);
  arc.strokeWidth = minuteStrokeWidth;
  arc.strokeColor = minuteStrokeColor;
  // arc.strokeColor = minuteColors[minute];
  // arc.opacity = 1.0;
  return arc;
}

function hourPath(center, hour)
{
  if (hour > 12) {
    hour -= 12;
  }
  var arc = segmentPath(center, hourRadius, 12, hour);
  arc.strokeWidth = hourStrokeWidth;
  arc.strokeColor = hourStrokeColor;
  return arc;
}

function addTime(pathfn, layer, from, till, base)
{
  if (from > till) {
    from = 1;
    layer.removeChildren();
  }
  for (var t = from; t <= till % base; ++t) {
    layer.addChild(pathfn(center, t));
  }
}

var secondCircleColor = new Color(secondStrokeColor).convert('hsb')
secondCircleColor.saturation = 0.3;
var secondCircle = new Path.Circle(
    { center: center
    , radius: secondRadius
    , opacity: 0.4
    , strokeColor: secondCircleColor
    , strokeWidth: secondStrokeWidth
    });

var minuteCircleColor = new Color(minuteStrokeColor).convert('hsb')
minuteCircleColor.saturation = 0.3;
var minuteCircle = new Path.Circle(
    { center: center
    , radius: minuteRadius
    , opacity: 0.4
    , strokeColor: minuteCircleColor
    , strokeWidth: minuteStrokeWidth
    });

var hourCircleColor = new Color(hourStrokeColor).convert('hsb')
hourCircleColor.saturation = 0.3;
var hourCircle = new Path.Circle(
    { center: center
    , radius: hourRadius
    , opacity: 0.4
    , strokeColor: hourCircleColor
    , strokeWidth: hourStrokeWidth
    });

var circleLayer = new Layer([secondCircle, minuteCircle, hourCircle]);

var currentDate   = new Date();
var currentHour   = currentDate.getHours();
var currentMinute = currentDate.getMinutes();
var currentSecond = currentDate.getSeconds();

var secondLayer = new Layer();
var minuteLayer = new Layer();
var hourLayer   = new Layer();

// function addHours(from, till) {
//   if (from > till) {
//     from = 1;
//     doRemoveHours = false;
//     hourLayer.removeChildren();
//   }
//   addTime(hourPath, hourLayer, from, till, 12);
// }
//
// function addMinutes(from, till) {
//   if (from > till) {
//     from = 1;
//     doRemoveMinutes = false;
//     minuteLayer.removeChildren();
//   }
//   addTime(minutePath, minuteLayer, from, till, 12);
// }
//
// function addSeconds(from, till) {
//   if (from > till) {
//     from = 1;
//     doRemoveSeconds = false;
//     secondLayer.removeChildren();
//   }
//   addTime(secondPath, secondLayer, from, till, 12);
// }

function addHours(from, till) { addTime(hourPath, hourLayer, from, till, 12); }
function addMinutes(from, till) { addTime(minutePath, minuteLayer, from, till, 60); }
function addSeconds(from, till) { addTime(secondPath, secondLayer, from, till, 60); }

addHours(1, currentHour);
addMinutes(1, currentMinute);
addSeconds(1, currentSecond);

// secondLayer.addChild(secondPath(center, currentSecond));
// minuteLayer.addChild(minutePath(center, currentMinute));
// hourLayer.addChild(hourPath(center, currentHour));

var timePosition = new Point(center.x, center.y - 0.5 * fontSize);

var secondText = new PointText(
    { point:         timePosition
    , fillColor:     secondFontColor
    , fontFamily:    fontFamily
    , fontWeight:    'bold'
    , fontSize:      fontSize
    , justification: 'center'
    , content:       ('00' + currentSecond).slice(-2)
    });

var fstSep = new PointText(
    { point:         timePosition
    , opacity:       0.75
    , fillColor:     '#808080'
    , fontFamily:    fontFamily
    , fontWeight:    'bold'
    , fontSize:      fontSize
    , justification: 'center'
    , content:       ':'
    });

var minuteText = new PointText(
    { point:         timePosition
    , fillColor:     minuteFontColor
    , fontFamily:    fontFamily
    , fontWeight:    'bold'
    , fontSize:      fontSize
    , justification: 'center'
    , content:       ('00' + currentMinute).slice(-2)
    });

var sndSep = new PointText(
    { point:         timePosition
    , opacity:       0.75
    , fillColor:     '#808080'
    , fontFamily:    fontFamily
    , fontWeight:    'bold'
    , fontSize:      fontSize
    , justification: 'center'
    , content:       ':'
    });

var hourText   = new PointText(
    { point:         timePosition
    , fillColor:     hourFontColor
    , fontFamily:    fontFamily
    , fontWeight:    'bold'
    , fontSize:      fontSize
    , justification: 'center'
    , content:       ('00' + currentHour).slice(-2)
    });

var datePosition = new Point(timePosition.x, timePosition.y + 2.25 * dateFontSize);

var dayText = new PointText(
    { point:         datePosition
    , fillColor:     dateFontColor
    , fontFamily:    fontFamily
    , fontWeight:    'bold'
    , fontSize:      dateFontSize
    , justification: 'center'
    , content:       moment(currentDate).locale('en').format('dddd,')
    });

var monthText = new PointText(
    { point:         new Point(datePosition.x, datePosition.y + 1.1 * dateFontSize)
    , fillColor:     dateFontColor
    , fontFamily:    fontFamily
    , fontWeight:    'bold'
    , fontSize:      dateFontSize
    , justification: 'center'
    , content:       moment(currentDate).locale('en').format('Do of MMMM,')
    });

var yearText = new PointText(
    { point:         new Point(datePosition.x, datePosition.y + 2.2 * dateFontSize)
    , fillColor:     dateFontColor
    , fontFamily:    fontFamily
    , fontWeight:    'bold'
    , fontSize:      dateFontSize
    , justification: 'center'
    , content:       moment(currentDate).locale('en').format('YYYY')
    });

var circleText = new Layer([secondCircle, minuteCircle, hourCircle,
                            dayText, monthText, yearText]);

fstSep.position.x = minuteText.position.x
                  - minuteText.bounds.width / 2
                  - fstSep.bounds.width / 2;

hourText.position.x = fstSep.position.x
                    - fstSep.bounds.width / 2
                    - hourText.bounds.width / 2;

sndSep.position.x = minuteText.position.x
                  + minuteText.bounds.width / 2
                  + sndSep.bounds.width / 2;

secondText.position.x = sndSep.position.x
                      + sndSep.bounds.width / 2
                      + secondText.bounds.width / 2;

var textGroup = new Group([hourText, fstSep, minuteText, sndSep, secondText]);
textGroup.position.y += 8 * minuteText.strokeBounds.height / 30;

var doRemoveSeconds = false;
var doRemoveMinutes = false;
var doRemoveHours   = false;

function draw(hour, minute, second)
{
  var secondNotSlipped = second == currentSecond || second == (currentSecond + 1) % 60;
  var minuteNotSlipped = minute == currentMinute || minute == (currentMinute + 1) % 60;
  var hourNotSlipped   = hour   == currentHour   || hour == (currentHour + 1) % 24;

  if (secondNotSlipped && minuteNotSlipped && hourNotSlipped) {
    if (second == 1) {
      secondLayer.removeChildren();
      secondLayer.addChild(secondPath(center, second));
    } else {
      secondText.content = ('00' + second).slice(-2);
      secondLayer.addChild(secondPath(center, second));
    }

    if (second == 1 && minute % 60 == 0) {
      minuteLayer.removeChildren();
    } else if (minute == (currentMinute + 1) % 60) {
      minuteText.content = ('00' + minute).slice(-2);
      minuteLayer.addChild(minutePath(center, minute));
    }

    if (second == 1 && hour % 24 == 0) {
      hourLayer.removeChildren();

      dayText.content = moment(currentDate).locale('en').format('dddd,');
      monthText.content = moment(currentDate).locale('en').format('Do of MMMM,');
      yearText.content = moment().locale('en').format('YYYY');

    } else if (hour == (currentHour + 1) % 24) {
      if (hour == 13) {
        hourLayer.removeChildren();
      }
      hourText.content = ('00' + hour).slice(-2);
      hourLayer.addChild(hourPath(center, hour));
    }

  } else {
    secondLayer.removeChildren();
    minuteLayer.removeChildren();
    hourLayer.removeChildren();
    addSeconds(1, second);
    addMinutes(1, minute);
    addHours(1, hour);
    secondText.content = ('00' + second).slice(-2);
    minuteText.content = ('00' + minute).slice(-2);
    hourText.content = ('00' + hour).slice(-2);
  }

  currentSecond = second;
  currentMinute = minute;
  currentHour   = hour;

  paper.view.update();
}

setInterval(function() {
  var now = new Date();
  draw(now.getHours(), now.getMinutes(), now.getSeconds());
}, 1000);

// var i_second = 0;
// var i_minute = 0;
// var i_hour = 0;
// setInterval(function() {
//     ++i_second;
//     var second = i_second % 60;
//
//     if (second == 0) {
//       i_minute = (i_minute + 1) % 60;
//     }
//
//     var minute = i_minute;
//
//     if (minute == 0 && second == 0) {
//       i_hour = (i_hour + 1) % 24;
//     }
//
//     var hour = i_hour;
//
//     // console.log(hour + ':' + minute + ':' + second);
//
//     draw(hour, minute, second);
// }, 1);
