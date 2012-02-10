var fs = require('fs');
var jsBase = __dirname + '/../js';
var un = require(jsBase + '/unrequire');
un.require.config({ baseUrl: jsBase });

var dataStructure = {};

var fileCount = 0;

var THING = 'sprites';
var PARAM = 'spriteSheet';

un.require( ['util/report'], function(report){
	fs.readdir( "../results", function(err, files){
		var toProcess = files.filter( function(filename){
			return filename.match(/\.json$/);
		});
	
		fileCount = toProcess.length;
	
		toProcess.forEach( function(filename){
			fs.readFile("../results/" + filename, 'utf8', function (err, json) {
				var data = JSON.parse(json);
				var name = data.userData.agentMetadata.name;
				var browser = data.userData.agentMetadata.browser;
				var userAgent = data.userData.agentMetadata.userAgent;
				var type = data.userData.agentMetadata.type;
				var combo = type + "-" + browser;
				
				if(!dataStructure[combo]){
					dataStructure[combo] = [
						[],
						[type,browser],
						[]
					];
				}
				
				var row = [name];
				var columnLabels = [""];
				Object.keys(data.userData.results[THING][PARAM]).sort().forEach( function(key){
					var spriteResults = data.userData.results[THING][PARAM][key];
					
					var translate = spriteResults.translate;
					var vals = [null];
					if( translate ){
						vals = [translate.objectCount];
					}
					
					columnLabels = columnLabels.concat( key );
					row = row.concat( vals );
				});
				
				dataStructure[combo][2] = columnLabels;
				dataStructure[combo].push( row );
				
				fileCount -= 1;
				if( fileCount === 0 ){
					foo();
				}
			});
		});
	});

	function foo(){
		var toSave = [];
		var roundUp = [[], ["","objectCount","technique"]];
		Object.keys(dataStructure).forEach( function(combo){
			var rows = dataStructure[combo];
			var averages = ['averages'];
			var best = 0;
			var bestTechnique = null;
			for( var i = 1; i < rows[2].length; i++ ){
				var sum = 0;
				for( var j = 3; j < rows.length; j++ ){
					sum += rows[j][i];
				}
				var avg = sum / (rows.length - 3);
				averages[i] = avg;
				if( avg > best ){
					best = avg;
					bestTechnique = rows[2][i];
				}
			}
			toSave = toSave.concat( rows, [averages] );
			roundUp.push( [combo, best, bestTechnique] );
		});
		console.log( roundUp );
		toSave = toSave.concat( roundUp );
		
		fs.writeFile( "../summary/" + THING + "-" + PARAM + ".csv", report.csvByTable(toSave), 'utf8', function(err){
			if(err) throw err;
			console.log("saved!");
		} );
	}
});