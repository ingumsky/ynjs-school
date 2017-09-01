var express 	= require("express");
var app 		= express();
var path    	= require('path');

var staticRoot = path.resolve(path.join(__dirname, './'));

var server 		= app.listen(3000, function () {
	console.log("Listening on port %s...", server.address().port);
});

app.get(/(.+)/i, staticFile);

app.get('*', function(req, res, next) {
	res.sendFile(path.join(staticRoot, 'index.html'));
});

function staticFile(req, res, next) {
	return res.sendFile(path.join(staticRoot, req.path));
}