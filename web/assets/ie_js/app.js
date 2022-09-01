/*    SUPER CLEVER PLAN    */
/* (C) 2020 Jakub Półgęsek */

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
			diff_diff: true,
			diff_select_version: true,
			theme_manager: true,
			theme_manager_ui: false,
			theme_christmas_by_default: false,
			new_hashparser: true,
			prefs_enable: true,
			prefs_transition: true,
			overrides_summaryModal: false,
			new_settings: true
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
		return false;
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
			timestamp = new Date().getTime();
			url = "data.json?ver=" + timestamp;
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
			
			var has_special_timesteps = (typeof data.timesteps[getTextDate()]) != 'undefined';
			if (has_special_timesteps && myTime.time < "17:00"){
				console.log("Specjalny rozklad godzin dla dnia "+getTextDate()+" - laduje");
				timeSteps = data.timesteps[getTextDate()];
			}else{
				timeSteps = data.timesteps['default'];
			}
	
			init2();
		}, function(e){
			app.ui.loader.setError("<b>Nie udało się pobrać planu lekcji</b><br>Sprawdź czy masz połączenie z internetem.", "<a style='color: white;' href='#' onclick='document.location.reload()'>Spróbuj ponownie</a>");
			utils.error("app", "Failed to download data.json");
		});
	},
	
	init: function(){
		//try {utils.consoleStartup();} catch (e) {}
		utils.log("app", "Initializing");

		try {
			if ((typeof(ZSEILPLAN_BUILD) == "undefined") || (preferences.get("tests_enabled") == "true") || (ZSEILPLAN_BUILD.indexOf("DEV") != -1)){
				utils.warn("app","[X] TESTS ARE ENABLED, MAKE SURE YOU KNOW WHAT ARE YOU DOING! [X]");
				app.testMode = true;
			}
		} catch (e) {}
		utils.log("app", "a1");
		app.ui.setStatus("Ładowanie danych planu...");
		utils.log("app", "a2");
		app.ui.loader.setStatus("Pobieram dane");
		utils.log("app", "a3");
		app.fetchData();
	},

	init3: function(){
		app.ui.modal = modal;
		app.refreshView = refreshView;

		if (this._ui_loaded) return;
		
		app.ui.createNavbarButton('<i class="icon-toolbox"></i>', "Narzędzia", function(){app.tools.selectToolModal()});

		if (this.isEnabled("new_settings")){
			app.ui.createNavbarButton('<i class="icon-cog"></i>', "Ustawienia", function(){settings.createModal()});
		}

		if (this.isEnabled("theme_manager")){
			if (typeof app.themeManager != 'undefined'){
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
				app.jumpTo(2,value.toUpperCase());
			}else if (path.indexOf("/nauczyciel/") != -1){
				value = document.location.pathname.substring(document.location.pathname.indexOf("/nauczyciel/")).split("/")[2];
				if (typeof data.teachermap[value] == "undefined"){
					for (key in data.teachermap){
						if (data.teachermap[key].split('-').join(" ").toLowerCase().split(' ').join("-") == value){
							value = key;
						}
					}
				}
				app.jumpTo(0,value.toUpperCase());
			}else if (path.indexOf("/sala/") != -1){
				value = document.location.pathname.substring(document.location.pathname.indexOf("/sala/")).split("/")[2];
				app.jumpTo(1,value.toUpperCase());
			}
		}else{
			/* Allow to link directly to specific timetable */
			if (location.hash.length > 2){
				if(location.hash[1] == "n"){
					app.jumpTo(0,location.hash.substr(2).toUpperCase());
				}else if(location.hash[1] == "s"){
					app.jumpTo(1,location.hash.substr(2).toUpperCase());
				}else if(location.hash[1] == "k"){
					app.jumpTo(2,location.hash.substr(2).toUpperCase());
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
	},

	jumpTo: function(type, value){
		app.ui.resetSelects();
	
		if (type == 0){
			if(!isIE){
				if (typeof data.teachermap[value] == 'undefined'){
					return;
				}
			}
			select_teachers.value = value;
			select_teachers.onchange();
	
		}else if (type == 1){
			if(!isIE){
				if (data.classrooms.indexOf(value) != -1){
					return;
				}
			}
			select_rooms.value = value;
			select_rooms.onchange();
	
		}else if (type == 2){
			if(!isIE){
				if (data.units.indexOf(value) != -1){
					return;
				}
			}
			select_units.value = value;
			select_units.onchange();
		}
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
		// app.ui.setNetworkStatus(false);
	}
	
	app.ui.loader.setStatus("Wczytuję dane");
	app.ui.initSelects();
	app.ui.setStatus("");
	app.ui.showBuild();
	
	overrideData = data.overrideData; //Quick fix, overrides were not loading on 08.11.2018

	if (app.testMode) {
		app.ui.updateStatus("<b>Tryb testowy, uważaj!</b> | ");
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
}


function refreshView(){
	utils.warn("app", "USAGE OF GLOBAL FUNCTION - refreshview!");
	if (select_units.value != "default") {
		app.currentView.selectedType = "unit";
		app.currentView.selectedValue = select_units.value;
		app.currentView.selectedShort = "k" + select_units.value;
		app.ui.setPageTitle("Plan klasy " + select_units.value);
	} else if (select_teachers.value != "default") {
		app.currentView.selectedType = "teacher";
		app.currentView.selectedValue = select_teachers.value;
		app.currentView.selectedShort = "n" + select_teachers.value;
		app.ui.setPageTitle("Plan nauczyciela " + data.teachermap[select_teachers.value]);
	} else if (select_rooms.value != "default") {
		app.currentView.selectedType = "room";
		app.currentView.selectedValue = select_rooms.value;
		app.currentView.selectedShort = "s" + select_rooms.value;
		app.ui.setPageTitle("Plan sali " + select_rooms.value);
	} else {
		utils.log("app", "Nothing is selected, not refreshing view");
		return;
	}

	utils.log("app", "Refreshing view");
	
	try {
		history.pushState(null, null, "#" + app.currentView.selectedShort);
	} catch (error) {
		utils.error("app", "history push fail: " + error);
	}
	if (typeof this.id != 'undefined'){
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
		if (typeof data._info == "undefined"){
			data_info.parentElement.removeChild(data_info);
		}else{
			data_info_src = data._info;
		}
		if (typeof data_info_src.text != "undefined" && 
			data_info_src.text != "" && 
			typeof data_info_src.style != "undefined" && 
			data_info_src.style != "" && 
			data_info_src.style != "none" && 
			data_info_src.style != "hide"){
				data_info.innerHTML = data_info_src.text;
				data_info.style.display = "block";
				//TODO: style
			}
	} catch (e) {}
}

app.getSWURL = function(){
	base_url = document.location.href;
	base_url = base_url.split("#")[0];
	ur = app.getUrlRouter();
	if (ur){
		base_url = base_url.split(ur)[0];
	}
	base_url = base_url.split("/");
	base_url.pop();
	return base_url.join("/") + "/";
}

app.resetURL = function(){
	history.pushState(null, null, app.getSWURL());
}

app.serviceWorkersSuck = {
	register: function(){
		return false;
	},

	notifications: {
		state: null,
		serverkey: '',

		stateCheck: function(){
			return false;
		},

		toggle: function(value){
			return false;
		},

		subscribe: function(){
			return false;
		},

		unsubscribe: function(){
			return false;
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


