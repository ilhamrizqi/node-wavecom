var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var portList = [];

serialport.list(function (err, ports)
{
	console.log("Detecting serial ports...")
	portList = ports;
	ports.forEach(function(port)
	{
		console.log("Found: "+port.comName);
		serial = new SerialPort(port.comName, 
			{
				baudrate: 115200,
				buffersize: 1024,
				parser: serialport.parsers.readline("\n")
			});

		serial.on('open', function()
		{
			console.log(port.comName + ': Port open');
			serial.write('ATE0\r\n');			
			serial.write('AT+CGMI\r\n');
			serial.write('AT+CGMM\r\n');			
			serial.write('AT+CGMR\r\n');
			serial.write('AT+CGSN\r\n');
		});

		serial.on('data', function(data)
		{
			console.log(">> "+data);
		});					
	});
});