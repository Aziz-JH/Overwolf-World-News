(function (w) {
	"use strict";

	w.i18nInt = function () {
		var arrI18nDOM = document.querySelectorAll('*[data-i18n]');
		var storeSearchObj = ls.get('searchObj');
		if (typeof storeSearchObj == 'undefined') {
			storeSearchObj.lang = 'en';
		}
		var lang = storeSearchObj.lang;
		var _i18n = i18n[lang];
		for (var i = 0, len = arrI18nDOM.length; i < len; i++) {
			var i18nDOM = arrI18nDOM[i];
			var key = i18nDOM.dataset.i18n;
			var i18nError = function (dom, key) {
				dom.innerHTML = key;
			};
			try {
				if (typeof _i18n[key] == 'undefined') {
					i18nError(i18nDOM, key);
				} else {
					i18nDOM.innerHTML = _i18n[key];
				}
			} catch (err) {
				console.error(err.message);
				i18nError(i18nDOM, key);
			}
		}
	};

	w.i18nInt();

	document.addEventListener("keyup", function (e) {
		if (e.keyCode === 27) {
			overwolf.windows.getCurrentWindow(function (result) {
				overwolf.windows.close(result.window.id);
			});
		}
	});

	google.load('search', '1');

	var NewsSearcher,
		$newsList = document.getElementById('newsList'),
		$pagination = document.getElementById('loadMore'),
		$inputText = document.getElementById('inputText'),
		$selectTopic = document.getElementById('selectTopic'),
		$settings = document.getElementById('settings'),
		$wrapper = document.getElementById('wrapper'),
		$settingsLanguage = document.getElementById('settingsLanguage'),
		$settingsRegion = document.getElementById('settingsRegion'),
		$selectOptionLocal = document.getElementById('selectOptionLocal'),
		searchObj = {
			text: '',
			region: 'en',
			lang: 'en',
			topic: 'h',
			sort: 'relevance',
			resultSize: 8
		},
		storeSearchObj = ls.get('searchObj');

	if (typeof storeSearchObj === 'undefined') storeSearchObj = {};
	searchObj = extend(searchObj, storeSearchObj);
	var getSort = function (sortAlias) {
		var sort = {
			relevance: google.search.Search.ORDER_BY_RELEVANCE,
			date: google.search.Search.ORDER_BY_RELEVANCE
		};
		return sort[sortAlias];
	};

	var onLoad = function () {
		NewsSearcher = new google.search.NewsSearch();
		search();
	};

	// set default values
	$inputText.value = searchObj.text;
	$selectTopic.value = searchObj.topic;
	$settingsLanguage.value = searchObj.lang;
	$settingsRegion.value = searchObj.region;

	function search() {
		if (searchObj.topic === '') {
			$inputText.style.display = 'block';
		} else {
			$inputText.style.display = 'none';
			$inputText.value = '';
		}
		$selectOptionLocal.innerText = config.language[searchObj.region];

		NewsSearcher.setSearchCompleteCallback(this, SearchCompiler, null);
		NewsSearcher.setResultSetSize(searchObj.resultSize);
		NewsSearcher.setRestriction(google.search.Search.RESTRICT_EXTENDED_ARGS, {
			topic: searchObj.topic,
			ned: searchObj.region,
			cf: 'all'
		});
		NewsSearcher.setResultOrder(getSort(searchObj.sort));
		NewsSearcher.execute(searchObj.text);
	}

	window.changeSearch = function () {
		searchObj.text = $inputText.value;
		searchObj.topic = $selectTopic.value;
		searchObj.region = $settingsRegion.value;
		searchObj.lang = $settingsLanguage.value;
		ls.set('searchObj', searchObj);
		search();
	};

	google.setOnLoadCallback(onLoad);

	//Related Stories generator
	function addRelatedStories(relatedStories) {
		return relatedStories;
	}

	//news element generator
	function addNewsElement(result) {
		//newsList.appendChild(result.html);
		var wrap = document.createElement('div');

		var name = document.createElement('div');
		name.className = 'title';
		name.innerHTML = textPh(result.titleNoFormatting);
		wrap.appendChild(name);

		var description = document.createElement('div');
		description.className = 'description';
		if (typeof result.image != 'undefined') {
			var descriptionImage = document.createElement('img');
			descriptionImage.src = result.image.tbUrl;
			descriptionImage.height = result.image.tbHeight;
			descriptionImage.width = result.image.tbWidth;
			description.appendChild(descriptionImage);
		}
		var descriptionText = document.createElement('p');
		descriptionText.innerHTML = textPh(result.content);
		description.appendChild(descriptionText);
		wrap.appendChild(description);

		var publisher = document.createElement('div');
		var publishedDate = moment(new Date(result.publishedDate));
		publisher.className = 'publisher';
		publisher.textContent = textPh(result.publisher) + ', ' + publishedDate.toNow(true);
		wrap.appendChild(publisher);

		if (result.relatedStories && false) {
			var relatedStories = document.createElement('div');
			relatedStories.className = 'relatedStories';
			relatedStories.textContent = addRelatedStories(result.relatedStories);
			wrap.appendChild(relatedStories);
		}

		wrap.className = 'news';
		wrap.addEventListener('click', function () {
			openLink(result.unescapedUrl);
		});
		$newsList.appendChild(wrap);
	}

	//pagination generator
	function generatePagination() {
		console.log(document.getElementById('newsWrapper').scrollTop);
		$pagination.innerHTML = '';
		document.getElementById('newsWrapper').scrollTop = 0;
		if (typeof NewsSearcher.cursor === 'undefined') {
			return;
		}

		var pages = document.createElement('span');
		if (NewsSearcher.cursor.currentPageIndex >= NewsSearcher.cursor.pages.length - 1) {
			return;
		}
		pages.innerHTML = 'load more';
		pages.addEventListener('click', function () {
			NewsSearcher.gotoPage(NewsSearcher.cursor.currentPageIndex + 1);
		});

		$pagination.appendChild(pages);
	}

	function SearchCompiler() {
		$newsList.innerHTML = '';
		try {
			console.log('PAGE', NewsSearcher.cursor.currentPageIndex + '/' + NewsSearcher.cursor.pages.length);
		} catch (err) {
		}
		generatePagination();
		var results = NewsSearcher.results;
		if (results && results.length > 0) {
			for (var i = 0; i < results.length; i++) {
				var result = results[i];

				//add News Element
				addNewsElement(result);
			}
		}
	}

	function openLink(url) {
		if (!url) {
			return;
		}
		console.info('OPEN LINK', url);
		w.open(url, '_blank');
	}

	w.toggleSettings = function () {
		$wrapper.classList.toggle('openSettings');
	};
})(window);