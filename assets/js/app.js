/*    SUPER CLEVER PLAN    */
/* (C) 2019 Jakub Półgęsek */

/* Config */
maxHours = 11;
weekDays = 5;


/* Global ui */
var table = document.getElementById("maintable");
var select_units = document.getElementById("units");
var select_teachers = document.getElementById("teachers");
var select_rooms = document.getElementById("rooms");
var networkstatus = document.getElementById("networkStatus"); //TODO: should be safe to remove this
var navbar_info = document.getElementById("navbar-info");
var data_googleindex_info = document.getElementById("data-googleindex-info");

/* Global variables */
var data = "wait";
var teachermap = "wait"; 
var teacherMapping = "wait"; 
var timeSteps = "wait";
var overrideData = "wait";
var overrides_disabled = false;

var compat = false;
var isIE = detectIE();




var app = {
	_ui_loaded: false,
	_features: {
		prod: {
			diff_diff: false,
			diff_select_version: false,
			theme_manager: true,
			theme_manager_ui: false,
			theme_christmas_by_default: false,
			new_hashparser: false,
			prefs_enable: false,
			prefs_transition: false,
			overrides_summaryModal: false,
			new_settings: false
		},
	
		dev: {
			diff_diff: true,
			diff_select_version: true,
			theme_manager: true,
			theme_manager_ui: false,
			theme_christmas_by_default: false,
			new_hashparser: false,
			prefs_enable: true,
			prefs_transition: true,
			overrides_summaryModal: true,
			new_settings: true
		},
	
		internal: {
			diff_diff: true,
			diff_select_version: true,
			theme_manager: true,
			theme_manager_ui: false,
			theme_christmas_by_default: false,
			new_hashparser: true,
			prefs_transition: true,
			prefs_enable: true,
			overrides_summaryModal: true,
			new_settings: true
		}
	},
	
	isCustomDataVersion: false,
	isMobile: true,
	isDiff: false,
	ip: "0.0.0.0",
	testMode: false,
	dummy_enable_dnitechnika: true,
	currentView: {
		selectedType: "",
		selectedValue: ""
	},
	element: {
		diff: {
			help: document.getElementById("diff-help"),
			info: document.getElementById("diff-info")
		},
		navbar: {
			container: document.getElementById("navbar-container"),
			buttons: {
				container: document.getElementsByClassName("navbar-buttons")[0],
				history: document.getElementById("navbar-btn-history"),
				android: document.getElementById("navbar-btn-android"),
				print: document.getElementById("navbar-btn-print")
			}
		},
		notification: {
			bar: document.getElementById("notification-bar"),
			text: document.getElementById("notification-text")
		},
		loader: {
			animation: document.getElementById("loading"),
			title: document.getElementById("loader-title"),
			text: document.getElementById("loader-status")
		},
		networkStatus: document.getElementById("networkStatus"),
		status: document.getElementById("status")
	},
	prefs: {
		"ui.selected_groups": [],
		"ui.show_only_selected_group": false,
		"ui.show_group_info": false,
		"ui.normalize_subject": false
	},
	isEnabled: function(feature_name){
		if (typeof(ZSEILPLAN_BUILD) == "undefined"){
			var featureSet = this._features.internal;
		}else if ((ZSEILPLAN_BUILD.indexOf("DEV") != -1)){
			var featureSet = this._features.dev;
		}else{
			var featureSet = this._features.prod;
		}
		if (typeof featureSet[feature_name] == "undefined"){
			utils.warn("app", "isEnabled(" + feature_name + ") = undefined");
			return false;
		}else{
			return featureSet[feature_name];
		}
	},
	as: function(v){
		//todo: disabler
		try{gtag('event','screen_view',{'app_name':'zseilplan','screen_name':v});}catch(e){};
	},
	ae: function(a,c,l){
		//todo: disabler
		try{gtag('event', a,{'event_category':c,'event_label':l});}catch(e){};
	},
	init: function(){
		app.ui = ui;
		app.modal = modal;
		app.storage = myStorage;
		app.refreshView = refreshView;

		try {
			if ((typeof(ZSEILPLAN_BUILD) == "undefined") || (preferences.get("tests_enabled") == "true") || (ZSEILPLAN_BUILD.indexOf("DEV") != -1)){
				utils.warn("internal","[X] TESTS ARE ENABLED, MAKE SURE YOU KNOW WHAT ARE YOU DOING! [X]");
				app.testMode = true;
				data.normalizationData = {
					"IM9": "Bazy danych",
					"IM10": "PHP/JS",
					"zaj. wych.": "Wychowawcza",
					"j. polski": "Polski",
					"j. angielski": "Angielski",
					"j. niemiecki": "Niemiecki",
					"hist. i społ": "Historia (his)"
				};
			}
		} catch (e) {}

		if (this._ui_loaded) return;

		if (this.isEnabled("new_settings")){
			ui.createNavbarButton('<i class="icon-cog"></i>', "Ustawienia2", function(){settings.createModal()});
		}

		if (this.isEnabled("theme_manager")){
			if (app.themeManager != undefined){
				utils.log("app", "Found theme manager");
				app.themeManager.init();
			}
			if (this.isEnabled("theme_christmas_by_default") && !preferences.get("disable_auto_themes")){
				if (preferences.get("disable_auto_themes_once")){
					preferences.set("disable_auto_themes_once", false, true);
				}else{
					if (preferences.get("ui.darkMode")){
						app.themeManager.activate(0,1);
					}else{	
						app.themeManager.activate(0,0);
					}
				}
			}
		}

		if (this.isEnabled("diff_diff")){
			app.element.navbar.buttons.history.style.display = null;
		}

		window.addEventListener("hashchange", app.parseHash, false);
		this._ui_loaded = true;
	},
	getUrlRouter: function(){
		var path = document.location.pathname;
		if (path.indexOf("/klasa/") != -1){
			return "klasa";
		}else if (path.indexOf("/nauczyciel/") != -1){
			return "nauczyciel";
		}else if (path.indexOf("/sala/") != -1){
			return "sala";
		}
		return false;
	},
	parseHash: function(){
		if (app.isEnabled("new_hashparser")){
			var path = document.location.pathname;
			if (path.indexOf("/klasa/") != -1){
				value = document.location.pathname.substring(document.location.pathname.indexOf("/klasa/")).split("/")[2];
				jumpTo(2,value.toUpperCase());
			}else if (path.indexOf("/nauczyciel/") != -1){
				value = document.location.pathname.substring(document.location.pathname.indexOf("/nauczyciel/")).split("/")[2];
				if (typeof data.teachermap[value] == "undefined"){
					for (key in data.teachermap){
						if (data.teachermap[key].split('-').join(" ").toLowerCase().split(' ').join("-") == value){
							value = key;
						}
					}
				}
				jumpTo(0,value.toUpperCase());
			}else if (path.indexOf("/sala/") != -1){
				value = document.location.pathname.substring(document.location.pathname.indexOf("/sala/")).split("/")[2];
				jumpTo(1,value.toUpperCase());
			}
		}else{
			/* Allow to link directly to specific timetable */
			if (location.hash.length > 2){
				if(location.hash[1] == "n"){
					jumpTo(0,location.hash.substr(2).toUpperCase());
				}else if(location.hash[1] == "s"){
					jumpTo(1,location.hash.substr(2).toUpperCase());
				}else if(location.hash[1] == "k"){
					jumpTo(2,location.hash.substr(2).toUpperCase());
				}
			}
		}
	},

	setDataSource: function(dataSource){
		try {
			localStorage.setItem("app.dataSource", dataSource);
		} catch (e) {
			utils.error("app", "Saving new dataSource failed, reason: " + e);
			return false;
		}

		return;
	}
}

function sortAsc (a, b) {
	return a.localeCompare(b);
}

function init(){
	//try {utils.consoleStartup();} catch (e) {}
	utils.log("app", "Initializing");

	ui.loader.setStatus("Ładuję preferencje");
	ui.setStatus("Ładowanie preferencji...");

	if (preferences.get("tests_enabled") == "true"){
		this._features.prod = this._features.dev;
	}

	if (app.isEnabled("prefs_enable")){
		preferences.load();
	}else{
		/* If HTML5 storage is available, try to load user saved settings */
		if (typeof(Storage) !== "undefined") {
			myStorage.load();
		}
	}

	ui.setStatus("Ładowanie danych planu...");
	ui.loader.setStatus("Pobieram dane");
	fetchData();
}

function init2(){
	utils.log("app", "Loading app");

	try{
		app.init();
	} catch(e) {}
	
	if (!navigator.onLine) {
		utils.warn("app", "App is offline, be careful!");
		ui.setNetworkStatus(false);
	}
	
	app.ui.loader.setStatus("Wczytuję dane");
	app.ui.initSelects();
	app.ui.setStatus("");
	app.ui.showBuild();
	
	overrideData = data.overrideData; //Quick fix, overrides were not loading on 08.11.2018

	if (app.testMode) {
		ui.updateStatus("<b>Tryb testowy, uważaj!</b><br>");
	}

	app.ui.initComments();

	if (screen.width >= 768) {
		utils.log("app", "Screen width >= 768, displaying whole week.");
		app.isMobile = false;
		columns.setActive(-1);
	} else if ((d.getDay() == 6) || (d.getDay() == 0)) {
		columns.setActive(1);
	}

	myTime.checkTime();
	setInterval(myTime.checkTime,60*1000); //TODO: it's not working on mobile

	quicksearch.init();
	try {
		ui.loader.setStatus("Ładuję interfejs");
		dom.addClass(document.getElementsByClassName('loader')[0], "opacity-0");
		dom.removeClass(document.getElementsByClassName('container')[0], "opacity-0");
		document.getElementsByClassName('loader')[0].parentElement.removeChild(document.getElementsByClassName('loader')[0]);
		document.body.style.background = null;
	} catch(e){};

	
	if (app.isEnabled("prefs_enable")){
		preferences.parse();
	}else{
		if (typeof(Storage) !== "undefined") {
			app.storage.load();
			refreshView();
		}
	}
	
	if(navigator.userAgent.indexOf('Windows NT 5.1') != -1){
		if((navigator.userAgent.indexOf('Chrome/49') != -1) || (navigator.userAgent.indexOf('Firefox/52') != -1)){
			//przegladarka jest dosc swieza, odwolujemy akcje
			return;
		}
		app.ui.showXPinfo();
	}

	app.parseHash();
	

	window.addEventListener('offline', function(e) { 
		ui.setNetworkStatus(false);
	});
	window.addEventListener('online', function(e) { 
		ui.setNetworkStatus(true);
	});

	
	try {
		if (isToday(new Date("01 Apr 2019"))){
			app.adminPanel.init();
		}
	} catch (e) {}

	try {getIPs(function(a){app.ip = a;});}catch(e){};
	diff.loadIndex();
}


function refreshView(){
	if (select_units.value != "default") {
		app.currentView.selectedType = "unit";
		app.currentView.selectedValue = select_units.value;
		app.currentView.selectedShort = "k" + select_units.value;
	} else if (select_teachers.value != "default") {
		app.currentView.selectedType = "teacher";
		app.currentView.selectedValue = select_teachers.value;
		app.currentView.selectedShort = "n" + select_teachers.value;
	} else if (select_rooms.value != "default") {
		app.currentView.selectedType = "room";
		app.currentView.selectedValue = select_rooms.value;
		app.currentView.selectedShort = "s" + select_rooms.value;
	} else {
		utils.log("app", "Nothing is selected, not refreshing view");
		return;
	}

	utils.log("app", "Refreshing view");
	
	try {
		if (app.isEnabled("new_hashparser")){
			var urlRouter = app.getUrlRouter();
			if (urlRouter){
				baseURL = document.location.pathname.substring(0,document.location.pathname.indexOf("/" + urlRouter +"/")) + "/";
			}else{
				baseURL = document.location.pathname;
				if (baseURL.indexOf("index.html") != -1){
					baseURL = baseURL.split("index.html")[0];
				}
			}

			var newURL = baseURL;
			switch (app.currentView.selectedType){
				case 'unit':
					newURL += "klasa/";
					newValue = app.currentView.selectedValue;
					break;
				
				case 'teacher':
					newURL += "nauczyciel/";
					newValue = data.teachermap[app.currentView.selectedValue].split('-').join(" ").toLowerCase().split(' ').join("-");
					break;
				
				case 'room':
					newURL += "sala/";
					newValue = app.currentView.selectedValue;
					break;
				
				default:
					break;
			}
			history.pushState(null, null, newURL + newValue);
		}else{
			history.pushState(null, null, "#" + app.currentView.selectedShort);
		}
	} catch (error) {
		utils.error("app", error);
	}

	if (this.id != undefined){
		ui.resetSelects(this.id);
	}

	//TODO: isn't there a function to do that?
	if (detectIE() && document.super_fucking_old_ie){
		while (table.hasChildNodes()) {
			table.removeChild(table.lastChild);
		}
	}else{
		table.innerHTML = "";
	}
	createHeader(table);
	
	/* This looks terrible */

	for (hour=1; hour<maxHours; hour++){
		row = insertNumber(table,hour);
		for (day=1; day<6; day++){
			var cell = row.insertCell(-1); //-1 for backwards compatibility
			
			/* Show unit view */
			if (select_units.value != "default"){
				ui.itemDisplayType = 2;
				try {
					classesArr = data.timetable[day][hour][select_units.value];
					for (cls in classesArr){
						cell.appendChild(ui.createItem(classesArr[cls]));
					}
				}catch (e){}
				

			/* Show teacher view */
			}else if (select_teachers.value != "default"){
				ui.itemDisplayType = 0;
				try {
					if (typeof data.teachers_new != 'undefined'){
						//New - fixed view of teachers timetable
						itemData = data.teachers_new[select_teachers.value][day][hour];
						for (var i in itemData){
							cell.appendChild(ui.createItem(itemData[i]));
						}
					}else{
						itemData = data.teachers[select_teachers.value][day][hour];
						cell.appendChild(ui.createItem(itemData));
					}
				}catch (e){}
			
			/* Show room view */
			}else if (select_rooms.value != "default"){
				ui.itemDisplayType = 1;
				try {		
					for (unit in data.timetable[day][hour]){
						itemData = data.timetable[day][hour][unit].filter(function(v){return v.s == select_rooms.value;});
						if (itemData.length > 0){
							itemData = itemData[0];
							itemData.k = unit;
							cell.appendChild(ui.createItem(itemData));
						}
					}
				}catch (e){}
			}
		}
	}
	
	if (select_units.value != "default"){
		app.ae('timetable', 'show.unit', 'unit='+select_units.value);
	}else if (select_teachers.value != "default"){
		app.ae('timetable', 'show.teacher', 'teacher='+select_teachers.value);
	}else if (select_rooms.value != "default"){
		app.ae('timetable', 'show.room', 'room='+select_rooms.value);
	}

	if (app.isDiff){
		console.log("redo diff");
		diff.generateDiff();
		app.element.diff.help.style.display = "inherit";
	}else{
		app.element.diff.help.style.display = "none";
	}

	columns.showSelected();	
	checkForOverrides();
	myTime.checkTime();

	try {
		data_info = document.getElementById("data_info");
		if (data._info == undefined){
			data_info.parentElement.removeChild(data_info);
		}else{
			data_info_src = data._info;
		}
		if (data_info_src.text != undefined && 
			data_info_src.text != "" && 
			data_info_src.style != undefined && 
			data_info_src.style != "" && 
			data_info_src.style != "none" && 
			data_info_src.style != "hide"){
				data_info.innerHTML = data_info_src.text;
				data_info.style.display = "block";
				//TODO: style
			}
	} catch (e) {}
}

function createHeader(table){
	//compat
	//var header = table.insertRow();
	var header = table.insertRow(-1); //-1 for backwards compatibility

	header.className = "header";
	for (i=0; i<6; i++){
		header.insertCell();
	}
	
	table.rows[0].cells[0].innerHTML = "Nr";
	table.rows[0].cells[1].innerHTML = "Poniedziałek";
	table.rows[0].cells[2].innerHTML = "Wtorek";
	table.rows[0].cells[3].innerHTML = "Środa";
	table.rows[0].cells[4].innerHTML = "Czwartek";
	table.rows[0].cells[5].innerHTML = "Piątek";
	
}

function insertNumber(table, y){
	//compat
	//var row = table.insertRow();
	//var cell = row.insertCell();
	var row = table.insertRow(-1); //-1 for backwards compatibility
	var cell = row.insertCell(-1); //-1 for backwards compatibility
	
	cell.innerHTML = "<b class='col-lesson-number'>"+y+"</b>"; //TODO: fix me
	cell.innerHTML += "<span class='col-lesson-timespan'>" + timeSteps[(y*2-2)] + " - "+ timeSteps[(y*2)-1] + "</span>"; //TODO: fix me
	return row;
}

function jumpTo(type, value){
	select_units.value = "default";
	select_teachers.value = "default";
	select_rooms.value = "default";

	if (type == 0){
		if(!isIE){
			if (data.teachermap[value] == undefined){
				return;
			}
		}
		select_teachers.value = value;
		select_teachers.onchange();

	}else if (type == 1){
		if(!isIE){
			if (data.classrooms.find(function(x){return x == value}) == undefined){
				return;
			}
		}
		select_rooms.value = value;
		select_rooms.onchange();

	}else if (type == 2){
		if(!isIE){
			if (data.units.find(function(x){return x == value}) == undefined){
				return;
			}
		}
		select_units.value = value;
		select_units.onchange();
	}
}



function fetchData(customURL){	
	try {
		utils.log("app", "Found fetch" + fetch.toString().substr(0,0));
	} catch (error) {
		utils.warn("app", "Fetch not found, enabling compatibility layer");
		compat = true;
	}
	
	
	
	timestamp = Date.now();

	/* %old-ie-remove-start% */
	if (!navigator.onLine) {
		ui.loader.setStatus("Jesteś offline, próbuję pobrać plan z lokalnego cache");
		timestamp = "localstorage";
	}
	/* %old-ie-remove-end% */

	url = 'data.php?ver='+timestamp;
	
	if (customURL != undefined){
		utils.log("app", "Will load custom timetable version: " + customURL);
		url = customURL;
	}

	data = "wait";


	if (compat){
		//Compatibility mode
		ui.loader.setStatus("Rozpoczynam pobieranie danych w trybie kompatybilności wstecznej");
		
		timestamp = Date.now();
		var fetchDataCompatXHR = new XMLHttpRequest();
		fetchDataCompatXHR.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				jdata = JSON.parse(fetchDataCompatXHR.responseText);
				data = jdata;
				teachermap = data.teachermap;
				teacherMapping = data.teachermap;
				
				/*
				if (getTextDate() in data.timesteps){
					console.log("[COMPAT] Specjalny rozklad godzin dla dnia "+getTextDate()+" - laduje");
					timeSteps = data.timesteps[getTextDate()];
				}else{
					timeSteps = data.timesteps['default'];
				}
				*/
				timeSteps = data.timesteps['default'];
					
				utils.log("app", "Downloaded data.json using XHR");
				init2();
			}
		};
		fetchDataCompatXHR.open("GET", url, true);
		fetchDataCompatXHR.send();
		return true;
	}
	
	isOK = true;

	/* %old-ie-remove-start% */
	/* is this needed? TODO
	try {
		fetch('data.php?ver=localstorage').then(function(response) {return response.json();})["catch"]();
	} catch (e) {}
	*/
	
	fetch(url).then(function(response) {
		return response.json();
	}).then(function(jdata) {
		data = jdata;
		teachermap = data.teachermap;
		teacherMapping = data.teachermap;
		
		if ((getTextDate() in data.timesteps) && myTime.time < "17:00"){
			console.log("Specjalny rozklad godzin dla dnia "+getTextDate()+" - laduje");
			timeSteps = data.timesteps[getTextDate()];
		}else{
			timeSteps = data.timesteps['default'];
		}
			

		utils.log("app", "Downloaded data.json using fetch");
		init2();
	})["catch"](function(error){
		isOK = false;
		ui.loader.setError("<b>Nie udało się pobrać planu lekcji</b>", "Upewnij się że masz połączenie z internetem i spróbuj ponownie.");
		utils.error("app", "Fetch - failed to download data.json. Reason: " + error);
	});
	/* %old-ie-remove-end% */

	if (!isOK){
		ui.loader.setStatus("<b>Nie udało się pobrać planu lekcji</b><br>Sprawdź czy masz połączenie z internetem.");
		utils.error("app", "Failed to download data.json");
	}else{
		ui.loader.setStatus("Pobrano plan lekcji");
	}
	return isOK;
}


document.body.onload = init;



var notifications_enabled = false;

/* %old-ie-remove-start% */
/* Tak. */
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('sw.js').then(function(registration) {
			utils.log("app", "ServiceWorker registration successful with scope: " + registration.scope);
			try {fetch('index.html?launcher=true').then(function(response) {console.log("------")})["catch"]();} catch (e) {} // Make first request in background to force service worker to cache index page.
			registration.pushManager.getSubscription().then(function(sub) {
				if (sub === null) {
					utils.log("app", "Not subscribed to push service");
				} else {
					utils.log("app", "Subscription object: " + sub);
					subscribeUser();
				}
				});
		}, function(err) {
			utils.error("app", "ServiceWorker registration failed: " + err);
		});
	});
	}

	function toggleNotifications(v){
		if (v){
			subscribeUser();
		}else{
			unsubscribeUser();
		}
	}
	
	function unsubscribeUser() {
		navigator.serviceWorker.ready.then(function(reg) {
			reg.pushManager.getSubscription().then(function(subscription) {
			  subscription.unsubscribe().then(function(successful) {
				ui.toast.show("Wyłączyłem powiadomienia");
			  })["catch"](function(e) {
				ui.toast.show("Wystąpił nieznany błąd :(");
			  })
			})        
		  });
	}

	function urlBase64ToUint8Array(base64String) {
		var padding = '='.repeat((4 - base64String.length % 4) % 4);
		var base64 = (base64String + padding)
		  .replace(/-/g, '+')
		  .replace(/_/g, '/');
	  
		var rawData = window.atob(base64);
		var outputArray = new Uint8Array(rawData.length);
	  
		for (var i = 0; i < rawData.length; ++i) {
		  outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	  }

	function subscribeUser() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready.then(function(reg) {
		reg.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array('BONWBKVMibu_3nM_nAlQoiLCPm1BFTcag06eSaCnbgPx_QHtwv1mYIuR81nyzqldPeN4LeIiVNqi3WRtCH0CKRE')
		}).then(function(sub) {
			console.log('Endpoint URL: ', sub.endpoint);
			notifications_enabled = true;
			fetch("registerNotification.php?new", {
				method: 'POST', // or 'PUT'
				body: JSON.stringify(sub), 
				headers: new Headers({
				  'Content-Type': 'application/json'
				})
			  }).then(function(){
				  console.log("Wyslano");
			  })
			  ["catch"](function(error){console.error('Error:', error)})
			  .then(function(response){console.log('Success:', response)});
			
		})["catch"](function(e) {
			if (Notification.permission === 'denied') {
				console.warn('Permission for notifications was denied');
				ui.toast.show("Brak uprawnień :(");
			} else {
				console.error('Unable to subscribe to push', e);
				ui.toast.show("Wystąpił nieznany błąd :(");
			}
		});
		})
	}
	}

function dbg_clearCache(){
	return;
}
/* %old-ie-remove-end% */


function updateData(){
	location.reload();
}


function tempTest(){
	o = "";
	o += "in:"+window.innerWidth;
	o += ",ou:"+window.outerWidth;
	o += ",ih:"+window.innerHeight;
	o += ",oh:"+window.outerHeight;
	o += ",dpr:"+window.devicePixelRatio;
	o += ",dw:"+document.width;
	o += ",sw:"+screen.width;
	o += ",aw:"+screen.availWidth;
	alert(o);
}

function detectIE() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
	  // IE 10 or older => return version number
	  return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}
  
	var trident = ua.indexOf('Trident/');
	if (trident > 0) {
	  // IE 11 => return version number
	  var rv = ua.indexOf('rv:');
	  return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}
  /*
	var edge = ua.indexOf('Edge/');
	if (edge > 0) {
	  // Edge (IE 12+) => return version number
	  return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}
	*/
	return false;
  }


if (detectIE()){
	console.log("Uzywasz IE, wspolczuje...");	
}


