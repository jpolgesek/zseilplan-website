/*    SUPER CLEVER PLAN    */
/* (C) 2019 Jakub Półgęsek */

/* Global ui */
var table = document.getElementById("maintable");
var select_units = document.getElementById("units");
var select_teachers = document.getElementById("teachers");
var select_rooms = document.getElementById("rooms");
var networkstatus = document.getElementById("networkStatus"); //TODO: should be safe to remove this
//var navbar_info = document.getElementById("navbar-info");
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
			new_hashparser: true,
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

	fetchData: function(customURL){	
		// Prepare URL
		if (customURL){
			utils.log("app", "Will load custom timetable version: " + customURL);
			url = customURL;
		}else{
			if (navigator.onLine === false) {
				app.ui.loader.setStatus("Jesteś offline, próbuję pobrać plan z lokalnego cache");
				timestamp = "localstorage";
			}else{
				timestamp = Date.now();
			}
			url = `data.php?ver=${timestamp}`;
		}
	
		app.ui.loader.setStatus("Rozpoczynam pobieranie danych");
	
		app.utils.fetchJson(url, function(jdata){
			app.ui.loader.setStatus("Pobrano plan lekcji");
			utils.log("app", "Downloaded data using app.utils.fetchJson");
	
			// TODO: This should be a separate function
			data = jdata;
			app.data = data;
			teachermap = data.teachermap;
			teacherMapping = data.teachermap;		
			
			if ((getTextDate() in data.timesteps) && myTime.time < "17:00"){
				console.log("Specjalny rozklad godzin dla dnia "+getTextDate()+" - laduje");
				timeSteps = data.timesteps[getTextDate()];
			}else{
				timeSteps = data.timesteps['default'];
			}
	
			init2();
		}, function(e){
			app.ui.loader.setError("<b>Nie udało się pobrać planu lekcji</b><br>Sprawdź czy masz połączenie z internetem.", `<a style='color: white;' href='#' onclick='document.location.reload()'>Spróbuj ponownie</a>`);
			utils.error("app", "Failed to download data.json");
		});
	},
	
	init: function(){
		//try {utils.consoleStartup();} catch (e) {}
		utils.log("app", "Initializing");

		app.ui.loader.setStatus("Ładuję preferencje");
		app.ui.setStatus("Ładowanie preferencji...");

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

		app.ui.setStatus("Ładowanie danych planu...");
		app.ui.loader.setStatus("Pobieram dane");
		app.fetchData();
	},

	init3: function(){
		app.ui.modal = modal;
		app.storage = myStorage;
		app.refreshView = refreshView;

		try {
			if ((typeof(ZSEILPLAN_BUILD) == "undefined") || (preferences.get("tests_enabled") == "true") || (ZSEILPLAN_BUILD.indexOf("DEV") != -1)){
				utils.warn("app","[X] TESTS ARE ENABLED, MAKE SURE YOU KNOW WHAT ARE YOU DOING! [X]");
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
		
		app.ui.createNavbarButton('<i class="fas fa-toolbox"></i>', "Narzędzia", function(){app.tools.selectToolModal()});

		if (this.isEnabled("new_settings")){
			app.ui.createNavbarButton('<i class="icon-cog"></i>', "Ustawienia", function(){settings.createModal()});
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

		//if (this.isEnabled("diff_diff")){
		//	app.element.navbar.buttons.history.style.display = null;
		//}

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


function init2(){
	console.warn("USAGE OF GLOBAL FUNCTION - init2!");
	utils.log("app", "Loading app");
	
	try{
		app.init3();
		app.serviceWorkersSuck.register();
	} catch(e) {}
	
	if (!navigator.onLine) {
		utils.warn("app", "App is offline, be careful!");
		app.ui.setNetworkStatus(false);
	}
	
	app.ui.loader.setStatus("Wczytuję dane");
	app.ui.initSelects();
	app.ui.setStatus("");
	app.ui.showBuild();
	
	overrideData = data.overrideData; //Quick fix, overrides were not loading on 08.11.2018

	if (app.testMode) {
		app.ui.updateStatus("<b>Tryb testowy, uważaj!</b><br>");
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
		app.ui.loader.setStatus("Ładuję interfejs");
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
		app.ui.setNetworkStatus(false);
	});
	window.addEventListener('online', function(e) { 
		app.ui.setNetworkStatus(true);
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
	console.warn("USAGE OF GLOBAL FUNCTION - refreshview!");
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
		app.ui.resetSelects(this.id);
	}

	app.ui.clearTable();
	app.ui.table.createHeader(table);
	
	/* This looks terrible */

	for (hour=1; hour<(maxHours + 1); hour++){
		row = app.ui.table.insertNumber(table,hour);
		for (day=1; day<6; day++){
			var cell = row.insertCell(-1); //-1 for backwards compatibility
			
			/* Show unit view */
			if (select_units.value != "default"){
				app.ui.itemDisplayType = 2;
				try {
					classesArr = data.timetable[day][hour][select_units.value];
					for (cls in classesArr){
						cell.appendChild(app.ui.createItem(classesArr[cls]));
					}
				}catch (e){}
				

			/* Show teacher view */
			}else if (select_teachers.value != "default"){
				app.ui.itemDisplayType = 0;
				try {
					if (typeof data.teachers_new != 'undefined'){
						//New - fixed view of teachers timetable
						itemData = data.teachers_new[select_teachers.value][day][hour];
						for (var i in itemData){
							cell.appendChild(app.ui.createItem(itemData[i]));
						}
					}else{
						itemData = data.teachers[select_teachers.value][day][hour];
						cell.appendChild(app.ui.createItem(itemData));
					}
				}catch (e){}
			
			/* Show room view */
			}else if (select_rooms.value != "default"){
				app.ui.itemDisplayType = 1;
				try {		
					for (unit in data.timetable[day][hour]){
						itemData = data.timetable[day][hour][unit].filter(function(v){return v.s == select_rooms.value;});
						if (itemData.length > 0){
							itemData = itemData[0];
							itemData.k = unit;
							cell.appendChild(app.ui.createItem(itemData));
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
		//TODO: 
		//app.element.diff.help.style.display = "inherit";
	}else{
		//app.element.diff.help.style.display = "none";
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

function jumpTo(type, value){
	console.warn("USAGE OF GLOBAL FUNCTION - jumpto!");
	app.ui.resetSelects();

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


app.getSWURL = function(){
	base_url = document.location.href;
	base_url = base_url.split("#")[0];
	ur = app.getUrlRouter();
	if (ur){
		base_url = base_url.split(ur)[0];
	}
	return base_url;
}

document.body.onload = app.init;

app.resetURL = function(){
	history.pushState(null, null, app.getSWURL());
}

app.serviceWorkersSuck = {
	register: function(){
		// Uh, this is ugly. I know. Sorry.
		if (!('serviceWorker' in navigator)){
			return false;
		}
		
		navigator.serviceWorker.getRegistrations().then(registrations => {
			success = false;
			swurl = app.getSWURL();

			registrations.forEach(reg => {
				if (reg.scope == swurl){
					success = true;
					reg.update();
				}
			});

			if (success) {
				utils.log("app.sws", "Found correct service worker");
			}else{
				utils.log("app.sws", "No correct service worker. Creating iframe, lol");
				sw_iframe = document.createElement("iframe");
				sw_iframe.src =  `${swurl}register_sw.html`;
				sw_iframe.style.width = "0";
				sw_iframe.style.height = "0";
				sw_iframe.style.opacity = "0";
				document.body.appendChild(sw_iframe);
			}

			app.serviceWorkersSuck.notifications.stateCheck();
		});
	},

	notifications: {
		state: undefined,
		serverkey: 'BONWBKVMibu_3nM_nAlQoiLCPm1BFTcag06eSaCnbgPx_QHtwv1mYIuR81nyzqldPeN4LeIiVNqi3WRtCH0CKRE',

		stateCheck: function(){
			navigator.serviceWorker.ready.then((reg) => {
				reg.pushManager.getSubscription().then(function(sub) {
					if (sub === null) {
						app.serviceWorkersSuck.notifications.state = false;
						utils.log("app.sws", "Not subscribed to push service");
					} else {
						app.serviceWorkersSuck.notifications.state = true;
						utils.log("app.sws", "Subscription object: " + sub);

						//TODO: Why?
						app.serviceWorkersSuck.notifications.subscribe();
					}
				});
			});
			
		},

		toggle: function(value){
			if (value){
				app.serviceWorkersSuck.notifications.subscribe();
			}else{
				app.serviceWorkersSuck.notifications.unsubscribe();
			}
		},

		subscribe: function(){
			navigator.serviceWorker.ready.then(function(reg) {
				reg.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: urlBase64ToUint8Array(app.serviceWorkersSuck.notifications.serverkey)
				}).then((sub) => {
					utils.log("app.sws", "Endpoint URL: " + sub.endpoint);
					fetch("registerNotification.php?new", {
						method: 'POST', // or 'PUT'
						body: JSON.stringify(sub), 
						headers: new Headers({
							'Content-Type': 'application/json'
						})
					})
					.then(() => {console.log("Wyslano");})
					.catch((error) => {console.error('Error:', error)})
					.then((response) => {console.log('Success:', response)});
					
				}).catch((e) => {
					if (Notification.permission === 'denied') {
						console.warn('Permission for notifications was denied');
						app.ui.toast.show("Brak uprawnień :(");
					} else {
						console.error('Unable to subscribe to push', e);
						app.ui.toast.show("Wystąpił nieznany błąd :(");
					}
				});
			})
		},

		unsubscribe: function(){
			navigator.serviceWorker.ready.then((reg) => {
				reg.pushManager.getSubscription().then((subscription) => {
					subscription.unsubscribe().then((successful) => {
						console.log("Wyłączyłem powiadomienia");
					}).catch((e) => {
						console.log("Wystąpił nieznany błąd :(");
					});
				})        
			});
		}
	}
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

function dbg_clearCache(){
	return;
}

function updateData(){
	alert("USAGE OF GLOBAL FUNCTION - updatedate!");
	return console.warn("USAGE OF GLOBAL FUNCTION!");
	location.reload();
}


function tempTest(){
	alert("USAGE OF GLOBAL FUNCTION - temptest!");
	return console.warn("USAGE OF GLOBAL FUNCTION!");
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


