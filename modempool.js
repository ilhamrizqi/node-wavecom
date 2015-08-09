var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var portList = [];
var events = require('events');
var emitter = new events.EventEmitter();

function cmd(serial, command, response)
{
	serial.write(command, function(){
		serial.drain();
	});
}

serialport.list(function (err, ports)
{
	console.log("\r\nDetecting serial ports...")
	portList = ports;
	ports.forEach(function(port)
	{
		console.log("Found: "+port.comName);
		var responseBuffer = '';



		serial = new SerialPort(port.comName, 
			{
				baudrate: 115200,
				buffersize: 1024,
				parser: serialport.parsers.readline("\r\n")
			});

		serial.on('open', function()
		{

			emitter.on('response', function(response){
				console.log(port.comName+': '+response.trim());
			});

			serial.on('data', function(data)
			{				
				if(data.trim() == "OK")
				{
					emitter.emit('response', responseBuffer);
					responseBuffer = "";
				}
				else if(data.trim() == "ERROR")
				{
					responseBuffer = "";	
				}
				else
				{
					responseBuffer = responseBuffer + data;
				}
			});			

			console.log(port.comName + ': Port open');
			var response = '';
			cmd(serial, 'ATE0\r\n', response);
			cmd(serial, 'AT+CGMI\r\n', response);
			cmd(serial, 'AT+CGMM\r\n', response);
			cmd(serial, 'AT+CGSN\r\n', response);
		});					
	});
});