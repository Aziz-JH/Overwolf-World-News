(function() {
	var gaUrl = 'https://www.google-analytics.com/collect';
	var trackID = 'UA-27761316-10';
	var appVersion, screenName, sc;

	var getUserId = function() {
		var gaTrackUserID = ls.get('gaTrackUserID');
		if(typeof gaTrackUserID == 'undefined') {
			gaTrackUserID = guid();
			ls.set('gaTrackUserID', gaTrackUserID);
		}
		return gaTrackUserID;
	};

	var run = function() {
		if(!trackID || ls.get('gaNoTrack') || !appVersion || !screenName) return;

		var data = {
			v: 1,
			tid: trackID,
			cid: getUserId(),
			t: 'screenview',
			an: 'World News',
			av: appVersion,
			ds: 'app',
			ua: navigator.userAgent,
			sr: window.screen.width + 'x' + window.screen.height,
			aip: true,
			//ul: settings.load().lang,
			cd: screenName,
			z: new Date().getTime()
		};
		if(typeof sc != 'undefined') data.sc = sc;

		$.post(gaUrl, data);
	};
	window.ga = {
		start: function(name) {
			if(typeof name == 'undefined' && !name) return;
			screenName = name;
			setTimeout(function() {
				getManifest(function(e) {
					appVersion = e.meta.version;
					sc = 'start';
					run();
					console.info('GA_START(' + name + ')');
				});
			}, 1000);
		},
		end: function(name) {
			if(typeof name == 'undefined' && !name) return;
			screenName = name;
			getManifest(function(e) {
				appVersion = e.meta.version;
				sc = 'end';
				run();
				console.info('GA_END(' + name + ')');
			});
		}
	};
})();