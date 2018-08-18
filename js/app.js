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


/* Global variables */
var data = "wait";
var teachermap = "wait"; 
var teacherMapping = "wait"; 
var timeSteps = "wait";
var overrideData = "wait";
var overrides_disabled = false;

var compat = false;
var isIE = detectIE();

function sortAsc (a, b) {
	return a.localeCompare(b);
}

function init(){
	console.log("init");
	try{loaderstatus.innerHTML="Ładuje preferencje";}catch(e){};	
	status_span.innerText = "Ładowanie preferencji...";
	/* If HTML5 storage is available, try to load user saved settings */
	if (typeof(Storage) !== "undefined") {
		myStorage.load();
	}
	status_span.innerText = "Ładowanie danych planu...";
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
	console.log("init 2");

	if (!navigator.onLine){
		document.getElementsByClassName("navbar-info")[0].innerHTML = "<b>TRYB OFFLINE</b>";
		document.getElementsByClassName("navbar")[0].style.backgroundColor = "#ff0000";
	}

	try{loaderstatus.innerHTML="Wczytuję dane";}catch(e){};	
	
	/* Show data comment */
	try {
		document.getElementById("button_comment").innerText = data.comment;
	} catch (error) {
		document.getElementById("button_comment").innerText = "Nie udało się pobrać wersji planu.";
	}
	

	/* Add units to select_units and quicksearch */
	status_span.innerText = "Przygotowywanie interfejsu: klasy";
	for (unit in data.units) {
		select_units.options[select_units.options.length] = new Option(data.units[unit], data.units[unit]);
		//quicksearch.add("Klasa "+data.units[unit], "K"+data.units[unit]);
	};


	status_span.innerText = "Przygotowywanie interfejsu: nauczyciele";


	for (key in data.teachermap){
		select_teachers.options[select_teachers.options.length] = new Option(data.teachermap[key]+' ('+key+')', key);
	}

	
	/* Add classrooms to select_rooms and quicksearch */
	status_span.innerText = "Przygotowywanie interfejsu: sale";
	for (i in data.classrooms) {
		select_rooms.options[select_rooms.options.length] = new Option(data.classrooms[i], data.classrooms[i]);
		//quicksearch.add("Sala "+data.classrooms[i], "S"+data.classrooms[i]);
	}

	
	/* Attach change events to select menus */
	select_units.onchange = refreshView	;
	select_units.oninput = refreshView;
	select_teachers.onchange = refreshView;
	select_teachers.oninput = refreshView;
	select_rooms.onchange = refreshView;
	select_rooms.oninput = refreshView;

	/* Show timetable update date */
	if (data._updateDate_max == data._updateDate_min){
		status_span.innerText = "Plan z dnia "+data._updateDate_max;
	}else{
		status_span.innerText = "Plan z dni "+data._updateDate_max+" - "+data._updateDate_min;
	}

	overrideData = data.overrideData;
	
	/* TODO: fix me */
	status_span.innerHTML += "<br>Zastępstwa na "+Object.keys(overrideData).map(function(s){return s.substr(0,5)}).join();
	status_span.innerHTML += "<br><a href='javascript:void(0)' onclick='updateData()'>Odśwież</a> | <a href='changelog.html'>Changelog</a>";


	if (screen.width >= 1000){
		columns.setActive(-1);
	}

	myTime.checkTime();
	setInterval(myTime.checkTime,60*1000);

	quicksearch.init();
	try{loaderstatus.innerHTML="Ładuję interfejs";}catch(e){};	
	document.getElementsByClassName('loader')[0].classList.add('opacity-0');
	document.getElementsByClassName('container')[0].classList.remove('opacity-0');
	document.getElementsByClassName('loader')[0].parentElement.removeChild(document.getElementsByClassName('loader')[0]);


	/* If HTML5 storage is available, try to load user saved settings */
	if (typeof(Storage) !== "undefined") {
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
		XPinfo.innerHTML += "<li>strona szkoły jest jeszcze brzydsza</li>"
		XPinfo.innerHTML += "</ul><br>"
		XPinfo.innerHTML += "Więc w trosce o zdrowie psychiczne twoje oraz autora tej aplikacji polecam zaprzestać użytkowania <strong>17 LETNIEGO</strong> systemu operacyjnego."
		XPinfo.innerHTML += "<br><br> <button class='wideBtn' type='button' onclick='document.getElementById(\"XPinfo\").style.display=\"none\"'>Obiecuję zainstalować nowy system, zamknij ten komunikat</button>"
		XPinfo.style.background = "url('err_xp.png'), rgb(142, 24, 24)";
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

}


function refreshView(){
	console.time('refreshView-pre');
	/* TODO: Do not refresh view if there is nothing selected */
	if (select_units.value == "default" && select_teachers.value == "default" && select_rooms.value == "default"){
		console.log("nic nie jest wybrane, nie odswiezam");
		return;
	}
	console.log("Refreshing view");

	if (this.id != undefined){
		ui.resetSelects(this.id);
	}

	table.innerHTML = "";
	createHeader(table);
	console.timeEnd('refreshView-pre');
	
	console.time('refreshView-1');
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
		try { gtag('event', 'show.unit', {'event_category': 'ui.unit', 'event_label': 'show.unit='+select_units.value}); } catch (e) {}
	}else if (select_teachers.value != "default"){
		try { gtag('event', 'show.teacher', {'event_category': 'ui.teacher', 'event_label': 'show.teacher='+select_teachers.value}); } catch (e) {}
	}else if (select_rooms.value != "default"){
		try { gtag('event', 'show.room', {'event_category': 'ui.room', 'event_label': 'show.room='+select_rooms.value}); } catch (e) {}
	}

	console.timeEnd('refreshView-1');
	console.time('refreshView-2');
	//style.update();
	columns.showSelected();	
	console.timeEnd('refreshView-2');
		
	console.time('refreshView-3');
	/*
	if(localStorage.getItem("autocfo") == "true"){
		checkForOverrides();
	}
	*/
	checkForOverrides();

	console.timeEnd('refreshView-3');
	myTime.checkTime();
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



function fetchData(){
	try{loaderstatus.innerHTML="fd - 1";}catch(e){};	
	try {
		console.log("Fetch znaleziony: "+fetch);
	} catch (error) {
		compat = true
	}
	try{loaderstatus.innerHTML="fd - 2";}catch(e){};	
	if (compat){
		//Compatibility mode
		try{loaderstatus.innerHTML="fd - 3";}catch(e){};
		console.log("Wlaczam tryb kompatybilnosci wstecznej - fetch.")
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
					
		
				console.log("[COMPAT] Wczytano data.json!");
				init2();
			}
		};
		fetchDataCompatXHR.open("GET", "data.json", true);
		fetchDataCompatXHR.send();
		return true;
	}
	
	try{loaderstatus.innerHTML="fd - 4";}catch(e){};
	isOK = true;
	timestamp = Date.now();
	try{loaderstatus.innerHTML="fd - 4.5";}catch(e){};
	if (!navigator.onLine) timestamp = "localstorage";
	try{loaderstatus.innerHTML="fd - 5";}catch(e){};

	fetch('data.json?ver='+timestamp).then(function(response) {
		try{loaderstatus.innerHTML="fd - 6";}catch(e){};
		return response.json();
	}).then(function(jdata) {
		console.log("Pobrano data.json!");
		data = jdata;
		teachermap = data.teachermap;
		teacherMapping = data.teachermap;
		
		if (getTextDate() in data.timesteps){
			console.log("Specjalny rozklad godzin dla dnia "+getTextDate()+" - laduje");
			timeSteps = data.timesteps[getTextDate()];
		}else{
			timeSteps = data.timesteps['default'];
		}
			

		console.log("Wczytano data.json!");
		init2();
		try{loaderstatus.innerHTML="fd - 6.5";}catch(e){};
	}).catch(function(error){isOK=false});

	try{loaderstatus.innerHTML="fd - 7";}catch(e){};
	return isOK;
}


document.body.onload = init();



var notifications_enabled = false;

/* Tak. */
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('sw.js').then(function(registration) {
			// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
			registration.pushManager.getSubscription().then(function(sub) {
				if (sub === null) {
					// Update UI to ask user to register for Push
					console.log('Not subscribed to push service!');
					////alert("niepodłączony pod powiadomienia, podłączam");
					// toggleNotifications(1);
					// document.getElementById("notificationSubscribe").innerText = "Włącz powiadomienia";
				} else {
					// We have a subscription, _update the database_???
					console.log('Subscription object: ', sub);
					subscribeUser();
					// document.getElementById("notificationSubscribe").innerText = "Powiadomienia włączone";
					// document.getElementById("notificationSubscribe").onclick = unsubscribeUser;
				}
				});
		}, function(err) {
		// registration failed :(
		console.log('ServiceWorker registration failed: ', err);
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
				ui.createToast("Wyłączyłem powiadomienia");
				// document.getElementById("notificationSubscribe").innerText = "Powiadomienia wyłączone";
				// document.getElementById("notificationSubscribe").onclick = subscribeUser;
			  }).catch(function(e) {
				ui.createToast("Wystąpił nieznany błąd :(");
				// document.getElementById("notificationSubscribe").innerText = "Nie udało sie wyłączyć powiadomień";
			  })
			})        
		  });
	}

	function urlBase64ToUint8Array(base64String) {
		const padding = '='.repeat((4 - base64String.length % 4) % 4);
		const base64 = (base64String + padding)
		  .replace(/-/g, '+')
		  .replace(/_/g, '/');
	  
		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);
	  
		for (let i = 0; i < rawData.length; ++i) {
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
			// document.getElementById("notificationSubscribe").innerText = "Powiadomienia włączone";
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
				ui.createToast("Brak uprawnień :(");
				// document.getElementById("notificationSubscribe").innerText = "Brak uprawnień :/";
			} else {
				//alert("Błąd: "+e);
				console.error('Unable to subscribe to push', e);
				ui.createToast("Wystąpił nieznany błąd :(");
				// document.getElementById("notificationSubscribe").innerText = "Błąd :/";
			}
		});
		})
	}
	}

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
	//alert(o);
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

  if ((window.chrome) && (navigator.userAgent.indexOf("Windows NT 6") !== -1)){
	document.getElementsByClassName("print_icon")[0].className = "print_icon_compatible";
	document.getElementsByClassName("print_icon_compatible")[0].innerHTML = "&#xe800;";
	document.getElementsByClassName("settings_icon")[0].className = "settings_icon_compatible";
	document.getElementsByClassName("settings_icon_compatible")[0].innerHTML = "&#xe801;";
}

if (detectIE()){
	console.log("Uzywasz IE, wspolczuje...");	
	document.getElementsByClassName("print_icon")[0].className = "print_icon_compatible";
	document.getElementsByClassName("print_icon_compatible")[0].innerHTML = "&#xe800;";
	document.getElementsByClassName("settings_icon")[0].className = "settings_icon_compatible";
	document.getElementsByClassName("settings_icon_compatible")[0].innerHTML = "&#xe801;";
}


if ( window.addEventListener ) {
	var kkeys = [], asdasd = "38,38,40,40,37,39,37,39,66,65";
	window.addEventListener("keydown", function(e){
		kkeys.push(e.keyCode);
		if (kkeys.toString().indexOf(asdasd) >= 0 ){
			scrollTo(0,0);
			document.body.innerHTML = 
			'<div style="z-index: 99999999;position: absolute;top: 0;left: 0;width: 100%;height: 100%;"><iframe src="aee/" style="width: 100%;height: 100%;border-style:none"></iframe></div>' + document.body.innerHTML;
			scrollTo(0,0);
			kkeys = [];
		}
	}, true);
}
