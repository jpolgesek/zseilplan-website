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
var status_span = document.getElementById("status"); //TODO: should be safe to remove this
var networkstatus = document.getElementById("networkStatus"); //TODO: should be safe to remove this
var loaderstatus = document.getElementById("loader-status"); //TODO: should be safe to remove this
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
	
		internal: {
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
		navbar: {
			container: document.getElementById("navbar-container"),
			buttons: {
				history: document.getElementById("navbar-btn-history"),
				android: document.getElementById("navbar-btn-android"),
				settings: document.getElementById("navbar-btn-settings"),
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

		if (this._ui_loaded) return;
		
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
}

function sortAsc (a, b) {
	return a.localeCompare(b);
}

function init(){
	utils.log("app", "Initializing");

	ui.loader.setStatus("Ładuję preferencje");
	ui.setStatus("Ładowanie preferencji...");

	if (preferences.get("tests_enabled") == "true"){
		this._features.prod = this._features.dev;
	}

	if (typeof(Storage) !== "undefined") {
		myStorage.load();
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

	try {
		ui.loader.setStatus("Ładuję interfejs");
		dom.addClass(document.getElementsByClassName('loader')[0], "opacity-0");
		dom.removeClass(document.getElementsByClassName('container')[0], "opacity-0");
		document.getElementsByClassName('loader')[0].parentElement.removeChild(document.getElementsByClassName('loader')[0]);
	} catch(e){};

	
	if (typeof(Storage) !== "undefined") {
		app.storage.load();
		refreshView();
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
		history.pushState(null, null, "#" + app.currentView.selectedShort);
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
	//console.timeEnd('refreshView-pre');
	
	//console.time('refreshView-1');
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
	var compat = true;
	
	timestamp = Date.now();
	url = 'data.php?ver='+timestamp;
	
	if (customURL != undefined){
		utils.log("app", "Will load custom timetable version: " + customURL);
		url = customURL;
	}

	data = "wait";


	ui.loader.setStatus("Rozpoczynam pobieranie danych w trybie kompatybilności wstecznej");
	
	timestamp = Date.now();
	var fetchDataCompatXHR = new XMLHttpRequest();
	fetchDataCompatXHR.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			jdata = JSON.parse(fetchDataCompatXHR.responseText);
			data = jdata;
			teachermap = data.teachermap;
			teacherMapping = data.teachermap;

			timeSteps = data.timesteps['default'];
				
			utils.log("app", "Downloaded data.json using XHR");
			init2();
		}
	};
	fetchDataCompatXHR.open("GET", url, true);
	fetchDataCompatXHR.send();
	return true;
}


document.body.onload = init();



var notifications_enabled = false;

function dbg_clearCache(){
	return;
}

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

 /* if ((window.chrome) && (navigator.userAgent.indexOf("Windows NT 6") !== -1)){
	document.getElementsByClassName("print_icon")[0].className = "print_icon_compatible";
	document.getElementsByClassName("print_icon_compatible")[0].innerHTML = "&#xe800;";
	document.getElementsByClassName("settings_icon")[0].className = "settings_icon_compatible";
	document.getElementsByClassName("settings_icon_compatible")[0].innerHTML = "&#xe801;";
	}*/

if (detectIE()){
	console.log("Uzywasz IE, wspolczuje...");	
	/*document.getElementsByClassName("print_icon")[0].className = "print_icon_compatible";
	document.getElementsByClassName("print_icon_compatible")[0].innerHTML = "&#xe800;";
	document.getElementsByClassName("settings_icon")[0].className = "settings_icon_compatible";
	document.getElementsByClassName("settings_icon_compatible")[0].innerHTML = "&#xe801;";*/
}


