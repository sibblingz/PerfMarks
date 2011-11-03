var express = require('express');
var app = express.createServer();

app.configure(function () {
    app.use(express.static(__dirname + '/../'));
    app.use(express.logger());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.get('/', function (req, res) {
    res.writeHead(301, {
        location: '/index.html'
    });
    res.end();
});

app.post('/results', function (req, res) {
    var jsonData = '';
    req.on('data', function (data) {
        jsonData += data.toString('utf8');
    });

    req.on('end', function () {
        var data = JSON.parse(jsonData);
        console.log(data);
        res.end();
    });

    req.resume();
});

app.listen(3002);
console.log('Listening on :3002');
