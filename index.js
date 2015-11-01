var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosquitto.org');
var exec = require('child_process').exec;

var configCommand = '/home/pi/python-sense-hat-scripts/python-sense-hat-led.py';
var configDeviceId = 1;

function commandAcknowledgement(error, stdout, stderr) { 
  if (null === error) {
    console.log('Command executed.');
  }
  else {
    console.log('Command executuion error: ' + error);
  }
}
 
client.on('connect', function () {
  client.subscribe('device/'+configDeviceId);
});
 
client.on('message', function (topic, message) {
  console.log('message received: '+message);
  try {
    var data = JSON.parse(message);
    if (undefined === data.power) {
      throw new Error('Power status missing.');
    }
    var powerArgument = (true === data.power) ? "on" : "off";
    exec(configCommand+" --"+powerArgument, commandAcknowledgement);
  }
  catch(err) {
    console.log('Error:' + err.message);
  }
});
