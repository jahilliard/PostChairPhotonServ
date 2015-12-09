// Setup Environment 
var express = require('express'),
  morgan = require('morgan'),
  app = express(),
  spark = require('spark'),
  cors = require('cors');
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 50000;
var photonAccess;
var device;

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.options('*', cors());

app.use(morgan('dev'));

spark.login({username: 'justin.a.hilliard@gmail.com', password: 'Hi11i@rd'},
            function(err, body) {
  				console.log('API call login completed on callback:', body);
  				photonAccess = body.access_token
  		  		spark.getDevice('350022000147343337373738', function(err, deviceRet) {
  		  			device = deviceRet;
  					console.log('Device name: ' + device.name);
				});
	}
);

app.get("/getSensorData/", function( req, res ){
	console.log("getSENSHIT");
	getSensorDataArr(function(fullDataArr){
		console.log("fullDataArr: " + fullDataArr);
		res.send(fullDataArr);
	});
});

var getSensorDataArr = function(callback) {
	var dataArr = [];
	for (var i = 4; i > 0; i--) {
		var tempname = "fsrReading" + i;
		console.log(tempname);
		device.getVariable(tempname, function(err, data) {
		  if (err) {
		    console.log('An error occurred while getting attrs:', err);
		  } else {
		    console.log('Device attr retrieved successfully:', data);
		    dataArr.push(data.result);
		    console.log("dataArrSize: " + dataArr.length );
		    console.log("data result: " + data.result );
		    console.log("dataArr: " + dataArr )
		    if (dataArr.length == 4) {
		    	callback(dataArr);
		    }
		  }
		});
	};
}




app.listen(port, ipaddress, function() {
        console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
});




