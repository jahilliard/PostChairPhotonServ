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
var request = require('request');

var webAppURL = "oldeb.res.cmu.edu:3000/inputstreamround"
var sendURL;

var dataArr = [0,0,0,0]

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


// Add headers
setInterval(function(){
	console.log(dataArr);
		sendURL= "http://" +  webAppURL + '/' + dataArr[0] + '/' 
			+ dataArr[1] + '/' + dataArr[2] + '/' + dataArr[3];
			console.log(sendURL)
		request(sendURL, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	console.log(Date.now());
		  } else {
		  	console.log("This is an Error:  " + error);
		  }
		});
}, 3000)

setInterval(function(){
	device.getVariable("fsrReading1", function(err, data) {
		  if (err) {
		    console.log('An error occurred while getting attrs:', err);
		  } else {
		    dataArr[0] = data.result
		  }
	});
}, 500)

setInterval(function(){
	device.getVariable("fsrReading2", function(err, data) {
		  if (err) {
		    console.log('An error occurred while getting attrs:', err);
		  } else {
		    dataArr[1] = data.result
		  }
	});
}, 500)

setInterval(function(){
	device.getVariable("fsrReading3", function(err, data) {
		  if (err) {
		    console.log('An error occurred while getting attrs:', err);
		  } else {
		    dataArr[2] = data.result
		  }
	});
}, 500)

setInterval(function(){
	device.getVariable("fsrRead
		ing4", function(err, data) {
		  if (err) {
		    console.log('An error occurred while getting attrs:', err);
		  } else {
		    dataArr[3] = data.result
		  }
	});
}, 500)



app.listen(port, ipaddress, function() {
        console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
});




