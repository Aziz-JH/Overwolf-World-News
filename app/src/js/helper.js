function openWindow($alias) {
	if(typeof overwolf === 'undefined') return;
	overwolf.windows.obtainDeclaredWindow($alias, function(result){
		if (result.status == "success"){
			overwolf.windows.restore(result.window.id, function(result){
			});
		}
	});
}

function closeWindow(alias, gaName) {
	if(typeof overwolf === 'undefined') return;
	overwolf.windows.obtainDeclaredWindow(alias, function(result) {
		if (result.status=="success") {
			if(typeof tracker != 'undefined') {
				ga.end(gaName);
			}
			overwolf.windows.close(result.window.id);
		}
	});
}

function dragResize(edge){
	if(typeof overwolf === 'undefined') return;
	overwolf.windows.getCurrentWindow(function(result){
		if (result.status=="success"){
			overwolf.windows.dragResize(result.window.id, edge);
		}
	});
}
function dragMove(){
	if(typeof overwolf === 'undefined') return;
	overwolf.windows.getCurrentWindow(function(result){
		if (result.status=="success"){
			overwolf.windows.dragMove(result.window.id);
		}
	});
}

function textPh(str) {
	var s = str.replace(/&(l|g|quo)t;/g, function(a,b){
		return {
			l   : '<',
			g   : '>',
			quo : '"'
		}[b];
	});
	return s;
}
function extend(){
	for(var i=1; i<arguments.length; i++)
		for(var key in arguments[i])
			if(arguments[i].hasOwnProperty(key))
				arguments[0][key] = arguments[i][key];
	return arguments[0];
}
(function() {
	var manifestCache;
	window.getManifest = function(callback) {
		if(typeof manifestCache == 'undefined') {
			overwolf.extensions.current.getManifest(function(manifest) {
				manifestCache = manifest;
				callback(manifest);
			});
			return;
		}

		callback(manifestCache);
	}
}());

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
}