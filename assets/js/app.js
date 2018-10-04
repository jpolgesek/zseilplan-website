/*    SUPER CLEVER PLAN    */
/* (C) 2018 Jakub Półgęsek */

/* Config */
maxHours = 11;
weekDays = 5;


/* Global ui */
var table = document.getElementById("maintable");
var select_units = document.getElementById("units");
var select_teachers = document.getElementById("teachers");
var select_rooms = document.getElementById("rooms");
var status_span = document.getElementById("status");
var networkstatus = document.getElementById("networkStatus");
var loaderstatus = document.getElementById("loader-status");
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
				history: document.getElementById("navbar-btn-history"),
				android: document.getElementById("navbar-btn-android"),
				settings: document.getElementById("navbar-btn-settings"),
				print: document.getElementById("navbar-btn-print")
			}
		},
		notification: {
			bar: document.getElementById("notification-bar"),
			text: document.getElementById("notification-text")
		}
	},
	prefs: {
		"ui.selected_groups": ["1", "2"],
		"ui.show_only_selected_group": false
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
		try {
			if ((typeof(ZSEILPLAN_BUILD) == "undefined") || (localStorage.getItem("tests_enabled") == "true") || (ZSEILPLAN_BUILD.indexOf("DEV") != -1)){
				utils.warn("internal","[X] TESTS ARE ENABLED, MAKE SURE YOU KNOW WHAT ARE YOU DOING! [X]");
				app.testMode = true;
				app.element.navbar.buttons.history.style.display = null;
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
	},
	showDataSourceModal: function(){
		datasourcepickerDiv = modal.create('datasourcepicker', "Wybór planu", "Tutaj możesz wybrać wersję danych Super Clever Planu", function(){datasourcepickerDiv.parentElement.removeChild(datasourcepickerDiv);ui.containerBlur(false)});

		row = modal.createRow();
		row.style.margin.bottom = "-10px";
		row.style.fontSize = "1.5em";
		section_title = document.createElement('span');
		section_title.innerHTML = "Data planu";
		row.appendChild(section_title);
		datasourcepickerDiv.appendChild(row);

		row = modal.createRow();

		input = document.createElement('select');
		input.type = "";
		input.checked = true;
		for (i in diff.index.timetable_archives){
			item = diff.index.timetable_archives[i];
			if (item.export_datetime == undefined){
				item.export_datetime = item.date;
			}
			input.options[input.options.length] = new Option(item.export_datetime +  ' ('+item.hash+')', 'data/' + item.filename);
		}
		
		title = document.createElement("span");
		title.className = "desc";
		title.innerHTML = "Wyświetl dowolny plan z przeszłości";

		row.appendChild(input);
		row.appendChild(title);
		datasourcepickerDiv.appendChild(row);
		
		row = modal.createRow();

		prefsBtnSave = document.createElement('button');
		prefsBtnSave.innerHTML = "Wyświetl";
		prefsBtnSave.onclick = function(){ui.clearTable(); app.isCustomDataVersion=true; fetchData(input.value); datasourcepickerDiv.parentElement.removeChild(datasourcepickerDiv);ui.containerBlur(false);};
		prefsBtnSave.className = "btn-primary";
		prefsBtnSave.title = "Wyświetl wybrany plan";
		row.appendChild(prefsBtnSave);

		prefsBtnSave = document.createElement('button');
		prefsBtnSave.innerHTML = "Porównaj";
		prefsBtnSave.onclick = function(){diff.compareSelected(input.value); app.isDiff=true; datasourcepickerDiv.parentElement.removeChild(datasourcepickerDiv);ui.containerBlur(false);};
		prefsBtnSave.title = "Porównaj aktualny plan z wybranym";
		row.appendChild(prefsBtnSave);

		prefsBtnCancel = document.createElement('button');
		prefsBtnCancel.innerHTML = "Anuluj";
		prefsBtnCancel.onclick = function(){datasourcepickerDiv.parentElement.removeChild(datasourcepickerDiv);ui.containerBlur(false)};
		row.appendChild(prefsBtnCancel);
		datasourcepickerDiv.appendChild(row);

		ui.containerBlur(true);
		document.body.appendChild(datasourcepickerDiv);
		setTimeout(function(){
			dom.addClass(datasourcepickerDiv, "modal-anim");
		}, 1)
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

	changelogModal: function(){
		changelogHTML = "";
		changelogHTML += "<b>02.09.2018 - Super Clever Plan 2.0</b>";
		changelogHTML += "<ul>";
		changelogHTML += "<li>Zupełnie nowy parser planu</li>";
		// changelogHTML += "<li>Możliwość wyświetlania planu z przeszłości</li>";
		// changelogHTML += "<li>Możliwość wyświetlania zmian w planie</li>";
		changelogHTML += "<li>Przełączanie między dniami na mobile za pomocą gestów</li>";
		changelogHTML += "<li>Poprawiony silnik wydruków</li>";
		changelogHTML += "<li>Możliwość pracy w trybie offline</li>";
		changelogHTML += "<li>Dodana instrukcja instalacji na androidzie</li>";
		changelogHTML += "<li>Kompatybilność ze starszymi przeglądarkami (Aż do IE 9)</li>";
		changelogHTML += "<li>Zmieniony interfejs</li>";
		changelogHTML += "</ul>";
		changelogDiv = modal.create('changelog', "Changelog", changelogHTML, function(){changelogDiv.parentElement.removeChild(changelogDiv);ui.containerBlur(false)});

		ui.containerBlur(true);
		document.body.appendChild(changelogDiv);
		setTimeout(function(){dom.addClass(changelogDiv, "modal-anim");},1);
	},

	bugreportModal: function(){
		bugreportDiv = modal.create('bugreport', "Zgłoś błąd", "", function(){bugreportDiv.parentElement.removeChild(bugreportDiv);ui.containerBlur(false)});
		
		row = modal.createRow();
		row.style.margin.bottom = "-10px";
		row.style.fontSize = "1.5em";
		section_title = document.createElement('span');
		section_title.innerHTML = "Opisz co się stało";
		row.appendChild(section_title);
		bugreportDiv.appendChild(row);
		
		row = modal.createRow();
		input = document.createElement('textarea');
		input.type = "";
		input.style.width = "100%";
		input.style.height = "200px";

		row.appendChild(input);
		bugreportDiv.appendChild(row);

		row = modal.createRow();
		row.style.margin.bottom = "-10px";
		row.style.fontSize = "1.5em";
		section_title = document.createElement('span');
		section_title.innerHTML = "Adres email";
		row.appendChild(section_title);
		bugreportDiv.appendChild(row);
		
		row = modal.createRow();
		input = document.createElement('input');
		input.type = "text";

		row.appendChild(input);

		bugreportDiv.appendChild(row);
		
		row = modal.createRow();
		prefsBtnSave = document.createElement('button');
		prefsBtnSave.innerHTML = "Wyślij";
		prefsBtnSave.onclick = function(){
			bd = app.preparebugdump();
			alert(app.ip);
			//bd = JSON.stringify(bd);
			//console.log(bd);
		};
		prefsBtnSave.className = "btn-primary";
		row.appendChild(prefsBtnSave);

		prefsBtnCancel = document.createElement('button');
		prefsBtnCancel.innerHTML = "Anuluj";
		prefsBtnCancel.onclick = function(){bugreportDiv.parentElement.removeChild(bugreportDiv);ui.containerBlur(false)};
		row.appendChild(prefsBtnCancel);
		bugreportDiv.appendChild(row);

		ui.containerBlur(true);
		document.body.appendChild(bugreportDiv);
		setTimeout(function(){dom.addClass(bugreportDiv, "modal-anim");},1);
	},

	preparebugdump: function(){
		output = {};
		output.window = {};
		output.document = {};
		output.screen = {};
		output.navigator = {};
		output.location = {};
		output.localstorage = {};
		output.ip = app.ip;
		output.window.innerWidth = window.innerWidth;
		output.window.outerWidth = window.outerWidth;
		output.window.innerHeight = window.innerHeight;
		output.window.outerHeight = window.outerHeight;
		output.window.devicePixelRatio = window.devicePixelRatio;
		output.document.width = document.width;
		output.screen.width = screen.width;
		output.navigator.userAgent = navigator.userAgent;
		output.document.body = document.body.innerHTML;
		output.location.href = location.href;
		output.navigator.cookieEnabled = navigator.cookieEnabled;
		try {
			for (var i = 0; i < localStorage.length; i++){
				output.localstorage[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
			}
		}catch (e) {}

		return output;
	}
}



function sortAsc (a, b) {
	return a.localeCompare(b);
}

function init(){
	//try {utils.consoleStartup();} catch (e) {}
	utils.log("app", "Initializing");

	try{loaderstatus.innerHTML="Ładuje preferencje";}catch(e){};	
	status_span.innerHTML = "Ładowanie preferencji...";

	/* If HTML5 storage is available, try to load user saved settings */
	if (typeof(Storage) !== "undefined") {
		myStorage.load();
	}

	status_span.innerHTML = "Ładowanie danych planu...";
	try{loaderstatus.innerHTML="Pobieram dane";}catch(e){};	
	fetchData();
}


/*DEBUG!!!!!
//This is bad.
var dbg_console_store = [];
var dbg_oldf = console.log;
console.log = function(){
   dbg_console_store.push(arguments);
   dbg_oldf.apply(console, arguments);
}

function debug(){
	//alert("Dane: "+JSON.stringify(dbg_console_store));
}
*/

function init2(){
	utils.log("app", "Loading app");

	try{app.init();}catch(e){}
	
	if (!navigator.onLine){
		utils.warn("app", "App is offline, be careful!");
		// document.getElementsByClassName("navbar-info")[0].innerHTML = "<b>TRYB OFFLINE</b>";
		// document.getElementsByClassName("navbar")[0].style.backgroundColor = "#ff0000";
		dom.addClass(document.getElementById("networkStatus"),"bad");
		document.getElementById("networkStatus").style.display = "block";
		document.getElementById("networkStatus").innerHTML = "Nie masz połączenia z internetem, plan może być nieaktualny.";
	}

	try{loaderstatus.innerHTML="Wczytuję dane";}catch(e){};	
	
	/* Show data comment */
	try {
		document.getElementById("button_comment").innerHTML = data.comment;
		document.getElementById("button_comment").innerHTML += " (" + data.hash.substr(0,8) + ")";
	} catch (error) {
		document.getElementById("button_comment").innerHTML = "Nie udało się pobrać wersji planu.";
	}
	
	try {data_googleindex_info.innerHTML = "W indeksie jest: ";} catch (e){}

	/* Add units to select_units and quicksearch */
	status_span.innerHTML = "Przygotowywanie interfejsu: klasy";
	
	while (select_units.firstChild) {
		select_units.removeChild(select_units.firstChild);
	}

	select_units.options[0] = new Option("Klasa", "default");
	for (unit in data.units) {
		select_units.options[select_units.options.length] = new Option(data.units[unit], data.units[unit]);
		// try {data_googleindex_info.innerHTML += "<a href='index.html#k"+data.units[unit]+"'>plan "+data.units[unit]+"</a>, ";} catch (e){}
		try {data_googleindex_info.innerHTML += "plan "+data.units[unit]+", ";} catch (e){}
		//quicksearch.add("Klasa "+data.units[unit], "K"+data.units[unit]);
	};


	status_span.innerHTML = "Przygotowywanie interfejsu: nauczyciele";
	
	while (select_teachers.firstChild) {
		select_teachers.removeChild(select_teachers.firstChild);
	}

	select_teachers.options[0] = new Option("Nauczyciel", "default");
	for (key in data.teachermap){
		select_teachers.options[select_teachers.options.length] = new Option(data.teachermap[key]+' ('+key+')', key);
	}

	try {data_googleindex_info.innerHTML += "plany "+ Object.keys(data.teachermap).length +" nauczycieli";} catch (e){}
	
	/* Add classrooms to select_rooms and quicksearch */
	status_span.innerHTML = "Przygotowywanie interfejsu: sale";
	
	while (select_rooms.firstChild) {
		select_rooms.removeChild(select_rooms.firstChild);
	}

	select_rooms.options[0] = new Option("Sala", "default");
	for (i in data.classrooms) {
		select_rooms.options[select_rooms.options.length] = new Option(data.classrooms[i], data.classrooms[i]);
		//quicksearch.add("Sala "+data.classrooms[i], "S"+data.classrooms[i]);
	}

	try {data_googleindex_info.innerHTML += " i "+ data.classrooms.length +" sal.";} catch (e){}
	
	/* Attach change events to select menus */
	select_units.onchange = refreshView	;
	select_units.oninput = refreshView;
	select_teachers.onchange = refreshView;
	select_teachers.oninput = refreshView;
	select_rooms.onchange = refreshView;
	select_rooms.oninput = refreshView;

	status_span.innerHTML = "";

	if (app.testMode){
		status_span.innerHTML += "<b>Tryb testowy, uważaj!</b><br>";
	}

	/* TODO: fix me */
	/* Show timetable update date */
	if (data._updateDate_max == data._updateDate_min){
		status_span.innerHTML += "Plan z dnia "+data._updateDate_max; //do not show on desktop
		navbar_info.innerHTML = "Plan z dnia "+data._updateDate_max;
	}else{
		status_span.innerHTML += "Plan z dni "+data._updateDate_max+" - "+data._updateDate_min; //do not show on desktop
		navbar_info.innerHTML = "Plan z dni "+data._updateDate_max+" - "+data._updateDate_min;
	}

	
	overrideData = data.overrideData;
	
	/* TODO: fix me */
	try {
		if (Object.keys(overrideData).length > 0){
			status_span.innerHTML += "<br>Zastępstwa na "+Object.keys(overrideData).map(function(s){return s.substr(0,5)}).sort().join();
		}
		status_span.innerHTML += "<br><a href='javascript:void(0)' onclick='updateData()'>Odśwież</a> | <a href='#' onclick='app.changelogModal()'>Changelog</a>";
	} catch (e) {}


	if (screen.width >= 768){
		utils.log("app", "Screen width >= 768, displaying whole week.");
		app.isMobile = false;
		columns.setActive(-1);
	}else if ((d.getDay() == 6) || (d.getDay() == 0)){
		columns.setActive(1);
	}

	myTime.checkTime();
	setInterval(myTime.checkTime,60*1000);

	quicksearch.init();
	try{
		loaderstatus.innerHTML="Ładuję interfejs";
		dom.addClass(document.getElementsByClassName('loader')[0], "opacity-0");
		dom.removeClass(document.getElementsByClassName('container')[0], "opacity-0");
		document.getElementsByClassName('loader')[0].parentElement.removeChild(document.getElementsByClassName('loader')[0]);
	}catch(e){};

	if (typeof(Storage) !== "undefined") {
		/* If HTML5 storage is available, try to load user saved settings */
		myStorage.load();
		refreshView();
	}
	
	if(navigator.userAgent.indexOf('Windows NT 5.1') != -1){
		if((navigator.userAgent.indexOf('Chrome/49') != -1) || (navigator.userAgent.indexOf('Firefox/52') != -1)){
			//przegladarka jest dosc swieza, odwolujemy akcje
			return;
		}
		XPinfo = document.createElement("div");
		XPinfo.id = "XPinfo";
		XPinfo.innerHTML = "Ups, wygląda na to że twórca tej aplikacji nie przewidział wchodzenia na nią z systemu, od którego premiery:"
		XPinfo.innerHTML += "<ul>"
		XPinfo.innerHTML += "<li>Ziemia siedemnaście razy okrążyła słońce</li>"
		XPinfo.innerHTML += "<li>Nastąpił atak terrorystyczny na WTC</li>"
		XPinfo.innerHTML += "<li>Dokonała się internetowa rewolucja streamingowa</li>"
		XPinfo.innerHTML += "<li>Wyszły 4 nowe główne systemy operacyjne od Microsoftu</li>"
		XPinfo.innerHTML += "<li>AMD wróciło do gry</li>"
		XPinfo.innerHTML += "<li>Microsoft zaczął robić konsole</li>"
		XPinfo.innerHTML += "<li>AMD wypadło z gry</li>"
		XPinfo.innerHTML += "<li>Dokonała się rewolucja Smart urządzeń</li>"
		XPinfo.innerHTML += "<li>AMD wróciło do gry</li>"
		XPinfo.innerHTML += "<li>Strona szkoły jest jeszcze brzydsza</li>"
		XPinfo.innerHTML += "</ul><br>"
		XPinfo.innerHTML += "Więc w trosce o zdrowie psychiczne twoje oraz autora tej aplikacji polecam zaprzestać użytkowania <strong>17 LETNIEGO</strong> systemu operacyjnego."
		XPinfo.innerHTML += "<br><br> <button class='wideBtn' type='button' onclick='document.getElementById(\"XPinfo\").style.display=\"none\"'>Obiecuję zainstalować nowy system, zamknij ten komunikat</button>"
		XPinfo.style.background = "url('assets/img/err_xp.png'), rgb(142, 24, 24)";
		XPinfo.style.backgroundRepeat = " no-repeat";
		XPinfo.style.backgroundPosition = "91% center";
		XPinfo.style.textAlign = "left";
		XPinfo.style.color = "#FAFAFA";
		XPinfo.style.padding = "1.2%";
		XPinfo.style.paddingRight = "40%";
		XPinfo.fontSize = "1.2em";
		status_span.parentNode.insertBefore(XPinfo, status_span.nextSibling);
	}

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
	
	try {
		if (typeof(ZSEILPLAN_BUILD) == "undefined"){
			document.getElementById("footer-text").innerHTML = "Super Clever Build internal build";
		} else {
			document.getElementById("footer-text").innerHTML = "Super Clever Plan build " + ZSEILPLAN_BUILD;
		}
	} catch (e) {}
	

	window.addEventListener('offline', function(e) { 
		dom.addClass(document.getElementById("networkStatus"),"bad");
		document.getElementById("networkStatus").style.display = "block";
		document.getElementById("networkStatus").innerHTML = "Nie masz połączenia z internetem, plan może być nieaktualny.";
	});
	window.addEventListener('online', function(e) { 
		document.getElementById("networkStatus").style.display = "none";
		document.getElementById("networkStatus").innerHTML = "";
		document.getElementById("networkStatus").className = "";
	});

	try {getIPs(function(a){app.ip = a;});}catch(e){};
	diff.loadIndex();
}


function refreshView(){
	//console.time('refreshView-pre');

	if (select_units.value != "default") {
		app.currentView.selectedType = "unit";
		app.currentView.selectedValue = select_units.value;
	} else if (select_teachers.value != "default") {
		app.currentView.selectedType = "teacher";
		app.currentView.selectedValue = select_teachers.value;
	} else if (select_rooms.value != "default") {
		app.currentView.selectedType = "room";
		app.currentView.selectedValue = select_rooms.value;
	} else {
		utils.log("app", "Nothing is selected, not refreshing view");
		return;
	}

	utils.log("app", "Refreshing view");
	// console.log("Refreshing view");

	if (this.id != undefined){
		ui.resetSelects(this.id);
	}

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
					itemData = data.teachers[select_teachers.value][day][hour];
					cell.appendChild(ui.createItem(itemData));
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
						/*
						
						for (xyz in data.timetable[day][hour][unit]){
							itemData = data.timetable[day][hour][unit][xyz].filter(function(v){return v.s == select_rooms.value;});
							if (itemData.length > 0){
								itemData = itemData[0];
								itemData.k = unit;
								cell.appendChild(ui.createItem(itemData));
							}
						}
						
						*/
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

	//console.timeEnd('refreshView-1');
	//console.time('refreshView-2');
	//style.update();
	columns.showSelected();	
	//console.timeEnd('refreshView-2');
		
	//console.time('refreshView-3');
	/*
	if(localStorage.getItem("autocfo") == "true"){
		checkForOverrides();
	}
	*/
	checkForOverrides();

	//console.timeEnd('refreshView-3');
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
		compat = true
	}
	
	
	
	timestamp = Date.now();

	/* %old-ie-remove-start% */
	if (!navigator.onLine) {
		try{loaderstatus.innerHTML="Jesteś offline, próbuję pobrać plan z lokalnego cache";}catch(e){};
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
		try{loaderstatus.innerHTML="Rozpoczynam pobieranie danych w trybie kompatybilności wstecznej";}catch(e){};
		
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
		fetch('data.php?ver=localstorage').then(function(response) {return response.json();}).catch();
	} catch (e) {}
	*/

	fetch(url).then(function(response) {
		return response.json();
	}).then(function(jdata) {
		data = jdata;
		teachermap = data.teachermap;
		teacherMapping = data.teachermap;
		
		if (getTextDate() in data.timesteps){
			console.log("Specjalny rozklad godzin dla dnia "+getTextDate()+" - laduje");
			timeSteps = data.timesteps[getTextDate()];
		}else{
			timeSteps = data.timesteps['default'];
		}
			

		utils.log("app", "Downloaded data.json using fetch");
		init2();
	}).catch(function(error){isOK=false});
	/* %old-ie-remove-end% */

	if (!isOK){
		try{loaderstatus.innerHTML="<b>Nie udało się pobrać planu lekcji</b><br>Sprawdź czy masz połączenie z internetem.";}catch(e){};
		utils.error("app", "Failed to download data.json");
	}else{
		try{loaderstatus.innerHTML="Pobrano plan lekcji";}catch(e){};
	}
	return isOK;
}


document.body.onload = init();



var notifications_enabled = false;

/* %old-ie-remove-start% */
/* Tak. */
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('sw.js').then(function(registration) {
			// Registration was successful			
			utils.log("app", "ServiceWorker registration successful with scope: " + registration.scope);
			try {fetch('index.html?launcher=true').then(function(response) {console.log("------")}).catch();} catch (e) {}
			// console.log('ServiceWorker registration successful with scope: ', registration.scope);
			registration.pushManager.getSubscription().then(function(sub) {
				if (sub === null) {
					// Update UI to ask user to register for Push
					utils.log("app", "Not subscribed to push service");
					// console.log('Not subscribed to push service!');
					////alert("niepodłączony pod powiadomienia, podłączam");
					// toggleNotifications(1);
					// document.getElementById("notificationSubscribe").innerHTML = "Włącz powiadomienia";
				} else {
					// We have a subscription, _update the database_???
					// console.log('Subscription object: ', sub);
					utils.log("app", "Subscription object: " + sub);
					subscribeUser();
					// document.getElementById("notificationSubscribe").innerHTML = "Powiadomienia włączone";
					// document.getElementById("notificationSubscribe").onclick = unsubscribeUser;
				}
				});
		}, function(err) {
		// registration failed :(
		// console.log('ServiceWorker registration failed: ', err);
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
				// ui.createToast("Wyłączyłem powiadomienia");
				ui.toast.show("Wyłączyłem powiadomienia");
				// document.getElementById("notificationSubscribe").innerHTML = "Powiadomienia wyłączone";
				// document.getElementById("notificationSubscribe").onclick = subscribeUser;
			  }).catch(function(e) {
				// ui.createToast("Wystąpił nieznany błąd :(");
				ui.toast.show("Wystąpił nieznany błąd :(");
				// document.getElementById("notificationSubscribe").innerHTML = "Nie udało sie wyłączyć powiadomień";
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
		//alert("start su - 1");
		navigator.serviceWorker.ready.then(function(reg) {
			//alert("start su - 2");
		reg.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array('BONWBKVMibu_3nM_nAlQoiLCPm1BFTcag06eSaCnbgPx_QHtwv1mYIuR81nyzqldPeN4LeIiVNqi3WRtCH0CKRE')
		}).then(function(sub) {
			//alert("start su - 3");
			console.log('Endpoint URL: ', sub.endpoint);
			//alert('Endpoint URL: '+ sub.endpoint);
			// document.getElementById("notificationSubscribe").innerHTML = "Powiadomienia włączone";
			// document.getElementById("notificationSubscribe").onclick = unsubscribeUser;

			//alert("start su - 4");
			notifications_enabled = true;
			fetch("registerNotification.php?new", {
				method: 'POST', // or 'PUT'
				body: JSON.stringify(sub), 
				headers: new Headers({
				  'Content-Type': 'application/json'
				})
			  }).then(function(){
				  console.log("Wyslano");
					//alert("zarejestrowano")
			  })
			  .catch(function(error){console.error('Error:', error)})
			  .then(function(response){console.log('Success:', response)});
			
		}).catch(function(e) {
			if (Notification.permission === 'denied') {
				//alert("Nie dostałem uprawnień");
				console.warn('Permission for notifications was denied');
				// ui.createToast("Brak uprawnień :(");
				ui.toast.show("Brak uprawnień :(");
				// document.getElementById("notificationSubscribe").innerHTML = "Brak uprawnień :/";
			} else {
				//alert("Błąd: "+e);
				console.error('Unable to subscribe to push', e);
				// ui.createToast("Wystąpił nieznany błąd :(");
				ui.toast.show("Wystąpił nieznany błąd :(");
				// document.getElementById("notificationSubscribe").innerHTML = "Błąd :/";
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


if ( window.addEventListener ) {
	var kkeys = [], asdasd = "38,38,40,40,37,39,37,39,66,65";
	window.addEventListener("keydown", function(e){
		kkeys.push(e.keyCode);
		if (kkeys.toString().indexOf(asdasd) >= 0 ){
			scrollTo(0,0);
			document.body.innerHTML = '<div style="z-index: 99999999;position: absolute;top: 0;left: 0;width: 100%;height: 100%;"><iframe src="aee/" style="width: 100%;height: 100%;border-style:none"></iframe></div>' + document.body.innerHTML;
			scrollTo(0,0);
			kkeys = [];
		}
	}, true);
}
