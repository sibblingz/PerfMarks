var fs = require('fs');
var jsBase = __dirname + '/../js';
var un = require(jsBase + '/unrequire');
un.require.config({ baseUrl: jsBase });

var dataStructure = [["browser", "pass", "coldLatency", "warmLatency"]];

var fileCount = 0;

un.require( ['util/report'], function(report){
	fs.readdir( "../results", function(err, files){
		var toProcess = files.filter( function(filename){
			return filename.match(/\.json$/);
		});
	
		fileCount = toProcess.length;
	
		toProcess.forEach( function(filename){
			fs.readFile("../results/" + filename, 'utf8', function (err, json) {
				var data = JSON.parse(json);
				var browser = data.userData.agentMetadata.name;
				var audioLatency = data.userData.results.audioLatency;
				var vals = [];
				if( audioLatency ){
					vals = Object.keys(audioLatency).map(function(k){
						return audioLatency[k];
					});
				}
				dataStructure.push( [browser].concat(vals) );
				fileCount -= 1;
				if( fileCount === 0 ){
					foo();
				}
			});
		});
	});

	function foo(){
		fs.writeFile( "../summary/audioLatency.csv", report.csvByTable(dataStructure), 'utf8', function(err){
			if(err) throw err;
			console.log("saved!");
		} );
	}
});