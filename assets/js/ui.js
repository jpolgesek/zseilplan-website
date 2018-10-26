var ui = {
	breakLineInItem: false,
	darkMode: false,
	itemDisplayType: 0,
	isOverride: false,
	isToastInProgress: false,
	jumpButtonsFloatRight: true,

	toast: {
		timerID: undefined,
		inProgress: false,
		show: function(text, time){
			if (ui.toast.inProgress) return false;
			ui.toast.inProgress = true;
			if (ui.toast.timerID != undefined) clearTimeout(ui.toast.timerID);
			if (time == undefined) time = 2400;
			app.element.notification.text.innerHTML = text;
			app.element.notification.bar.style.display = "inherit";
			dom.addClass(app.element.navbar.container, "notification");
			// app.element.notification.bar.onclick = ui.toast.hide;
			setTimeout(ui.toast.hide, time);
			return true;
		},
		hide: function(){
			dom.removeClass(app.element.navbar.container, "notification");
			// app.element.notification.bar.onclick = null;
			ui.toast.timerID = setTimeout(function(){
				app.element.notification.bar.style.display = "none"; 
				ui.toast.inProgress = false;
			}, 800);
			return true;
		}
	},

	loader: {
		/**
		 * Shows status text in loader
		 * @param {string} 	text 			Text to be shown in loader
		 * @returns {boolean} 				True on success, false on failure
		 */
		setStatus: function(text){
			try{
				app.element.loader.text.innerHTML = text;
				return true;
			}catch(e){
				return false;
			};	
		}
	},

	showBuild: function(){
		try {
			if (typeof(ZSEILPLAN_BUILD) == "undefined"){
				document.getElementById("footer-text").innerHTML = "Super Clever Plan internal build";
			} else {
				document.getElementById("footer-text").innerHTML = "Super Clever Plan build " + ZSEILPLAN_BUILD;
			}
		} catch (e) {}
		return;
	},

	initComments: function(){
		/* Show data comment */
		try {
			document.getElementById("button_comment").innerHTML = data.comment;
			document.getElementById("button_comment").innerHTML += " (" + data.hash.substr(0,8) + ")";
		} catch (error) {
			document.getElementById("button_comment").innerHTML = "Nie udało się pobrać wersji planu.";
		}
		
		/* TODO: fix me */
		/* Show timetable update date */
		if (data._updateDate_max == data._updateDate_min) {
			ui.updateStatus("Plan z dnia "+data._updateDate_max); //do not show on desktop
			navbar_info.innerHTML = "Plan z dnia "+data._updateDate_max;
		} else {
			ui.updateStatus("Plan z dni "+data._updateDate_max+" - "+data._updateDate_min); //do not show on desktop
			navbar_info.innerHTML = "Plan z dni "+data._updateDate_max+" - "+data._updateDate_min;
		}
		
		/* TODO: fix me */
		try {
			if (Object.keys(data.overrideData).length > 0){
				ui.updateStatus("<br>Zastępstwa na "+Object.keys(data.overrideData).map(function(s){return s.substr(0,5)}).sort().join());
			}
			ui.updateStatus("<br><a href='javascript:void(0)' onclick='updateData()'>Odśwież</a> | <a href='#' onclick='app.changelog.modal()'>Changelog</a>");
		} catch (e) {}

	},

	initSelects: function(){		
		try {data_googleindex_info.innerHTML = "W indeksie jest: ";} catch (e){}

		/* Add units to select_units and quicksearch */
		this.setStatus("Przygotowywanie interfejsu: klasy");
		
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


		this.setStatus("Przygotowywanie interfejsu: nauczyciele");
		
		while (select_teachers.firstChild) {
			select_teachers.removeChild(select_teachers.firstChild);
		}

		select_teachers.options[0] = new Option("Nauczyciel", "default");
		for (key in data.teachermap){
			select_teachers.options[select_teachers.options.length] = new Option(data.teachermap[key]+' ('+key+')', key);
		}

		try {data_googleindex_info.innerHTML += "plany "+ Object.keys(data.teachermap).length +" nauczycieli";} catch (e){}
		
		/* Add classrooms to select_rooms and quicksearch */
		this.setStatus("Przygotowywanie interfejsu: sale");
		
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

		return true;
	},

	/**
	 * Shows network status (red div on top of timetable)
	 * @param {boolean} 	value 			Is network available (true) or not (false)
	 */
	setNetworkStatus: function(value){
		if (value){
			app.element.networkStatus.style.display = "none";
			app.element.networkStatus.innerHTML = "";
			app.element.networkStatus.className = "";
		}else{
			dom.addClass(app.element.networkStatus,"bad");
			app.element.networkStatus.style.display = "block";
			app.element.networkStatus.innerHTML = "Nie masz połączenia z internetem, plan może być nieaktualny.";
		}
	},

	/**
	 * Shows status text
	 * @param {string} 	text 			Text to be shown
	 * @returns {boolean} 				True on success, false on failure
	 */
	setStatus: function(text){
		try{
			app.element.status.innerHTML = text;
			return true;
		}catch(e){
			return false;
		};	
	},


	/**
	 * Updates status text
	 * @param {string} 	text 			Text to be shown
	 * @returns {boolean} 				True on success, false on failure
	 */
	updateStatus: function(text){
		try{
			app.element.status.innerHTML += text;
			return true;
		}catch(e){
			return false;
		};	
	},


	/**
	 * Shows (Z) in header
	 * @param {number} 	n 				Column where ZMark should be shown
	 */
	createZMark: function(n){
		if (document.getElementsByClassName("header")[0].children[n].children.length == 0){
			zMark = document.createElement('span');
			zMark.className = "zMark";
			zMark.innerHTML = "Z";
			zMark.title = "Załadowano zastępstwa na ten dzień";
			document.getElementsByClassName("header")[0].children[n].appendChild(zMark);
		}
	},

	/**
	 * Creates a single item (lesson)
	 * @param {object} 	itemData		Data for new item (TODO: write structure somewhere)
	 */
	createItem: function(itemData){
		span = [document.createElement('span'), document.createElement('span'), document.createElement('span'), document.createElement('span')];
		
		if (itemData.p.length >= 30){
			itemData.p = itemData.p.split(" ")[0];
		}

		span[0].className = 'pName';
		span[0].innerHTML = itemData.p;
		span[1].className = 'clickable';
		span[2].className = 'clickable';

		if (app.testMode == true) {
			if (app.prefs["ui.normalize_subject"] === true){
				if (itemData.p.indexOf("JM") != -1){
					//to pewnie modul
					mod_name = itemData.p.split("JM")[0];
					if ((mod_name[0] == mod_name[1]) && (mod_name[0] == "I")){
						mod_name = mod_name.substr(1);
					}
				}else{
					mod_name = itemData.p;
				}
				try {
					newName = mod_name;
					newName = data.normalizationData[newName];
					if (newName != undefined){
						itemData.p = newName;
						span[0].innerHTML = newName;
					} 
				} catch (error) {
					console.log("Normalization not found for '"+mod_name+"'")
				}
			}
			
			grp = itemData.g;
			if ((grp != undefined) && (grp != -1)) {
				if (grp.indexOf("-") != -1) {
					grp = grp.split("-")[1];
				}
			}
			
			if ((typeof grp != 'undefined') && (grp != "-1")){
				if (app.prefs["ui.show_group_info"]){
					span[3].innerHTML = "G" + grp;
					span[3].className = 'clickable';
				}
		
				if (app.prefs["ui.show_only_selected_group"]) {
					if (app.prefs["ui.selected_groups"].indexOf(grp) == -1){
						return document.createElement("span");
					}
				}
			}

		}

		if (this.itemDisplayType == 0){
			span[1].innerHTML = itemData.k;
			span[1].onclick = function(){jumpTo(2, itemData.k)};
			span[2].innerHTML = itemData.s;
			span[2].onclick = function(){jumpTo(1, itemData.s)};
		}else if (this.itemDisplayType == 1){
			span[1].innerHTML = itemData.k;
			span[1].onclick = function(){jumpTo(2, itemData.k)};
			span[2].innerHTML = itemData.n;
			try {
				span[2].title = data.teachermap[itemData.n];
			} catch (error) {
				span[2].title = "Brak informacji";
			}
			span[2].onclick = function(){jumpTo(0, itemData.n)};
		}else if (this.itemDisplayType == 2){
			span[1].innerHTML = itemData.n;
			try {
				span[1].title = data.teachermap[itemData.n];
			} catch (error) {
				span[1].title = "Brak informacji";
			}
			span[1].onclick = function(){jumpTo(0, itemData.n)};
			span[2].innerHTML = itemData.s;
			span[2].onclick = function(){jumpTo(1, itemData.s)};
		}
		
		
		jumpButtonsDiv = document.createElement('div');
		if (this.jumpButtonsFloatRight){
			jumpButtonsDiv.className = "jumpButtons float-right";
		}else{
			jumpButtonsDiv.className = "jumpButtons";
		}
		
		element = document.createElement('div');

		if (this.isOverride){
			element.className = 'item override';
		}else{
			element.className = 'item';
		}
		
		if (itemData.diff != undefined){
			if (itemData.diff == "removed"){
				element.className += ' diff removed';
			} else if (itemData.diff == "added"){
				element.className += ' diff added';
			}
		}
		

		if (itemData.diff != undefined){
			if (itemData.diff == "removed"){
				span[1].style.background = 'rgba(0,0,0,0.3)';
				span[2].style.background = 'rgba(0,0,0,0.3)';
			} else if (itemData.diff == "added"){
				span[1].style.background = 'rgba(0,0,0,0.3)';
				span[2].style.background = 'rgba(0,0,0,0.3)';
			} else if (itemData.diff == "modified"){
				if (itemData.diffModifiedP != undefined){
					span[0].className += " diff modified";
					span[0].title = itemData.diffModifiedP;
				}
				if (itemData.diffModified1 != undefined){
					span[1].className += " diff modified";
					span[1].title = itemData.diffModified1;
				}
				if (itemData.diffModified2 != undefined){
					span[2].className += " diff modified";
					span[2].title = itemData.diffModified2;
				}
			}
		}

		element.appendChild(span[0]);
		element.appendChild(this.itemLineBreak());

		//Todo - nice function:
		span[0].innerHTML = span[0].innerHTML.replace("Wychowanie fizyczne", "WF");
		span[0].innerHTML = span[0].innerHTML.replace("Język ", "J.");

		if (itemData.n == "Uczniowie przychodzą p&#243;źniej"){
			span[0].innerHTML = "Uczniowie przychodzą później";
			if(itemData.g != undefined){
				// span[0].innerHTML += " ([info2]Grupa "+itemData.g+")";
				span[0].innerHTML += "-"+itemData.g+"";
			}
		}else if(itemData.n == "-1"){
			span[0].innerHTML = "Uczniowie zwolnieni";
			if(itemData.g != undefined){
				// span[0].innerHTML += " (Grupa "+itemData.g+")";
				span[0].innerHTML += "-"+itemData.g+"";
			}

		}else{
			if((itemData.g != undefined) && (itemData.g != "-1")){
				if (span[0].innerText.indexOf(itemData.g) == -1){
					// span[0].innerHTML += " (Grupa "+itemData.g+")";
					if (app.testMode != true) span[0].innerHTML += "-"+itemData.g+"";
				}
			}
			
			if (app.testMode == true) {
				if (span[3].innerHTML.length > 0){
					jumpButtonsDiv.appendChild(span[3]);
				}
			}

			jumpButtonsDiv.appendChild(span[1]);
			jumpButtonsDiv.appendChild(span[2]);
			element.appendChild(jumpButtonsDiv);	
		}

		if (itemData.diff != undefined){
			itemData.diff = true;
		} else {
			itemData.diff = false;
		}

		element.zseilplanitem = {
			"p": itemData.p,
			"n": itemData.n,
			"s": itemData.s,
			"g": itemData.g,
			"k": itemData.k,
			"isDiff": itemData.diff
		}
		
		return element;
	},


	/**
	 * Creates a toast and shows text
	 * @deprecated Use ui.toast.show()
	 * @param {string} 	text		String which should be shown
	 */
	createToast: function(text){
		if (ui.isToastInProgress) return;

		ui.isToastInProgress = true;
		app.element.notification.text.innerHTML = text;
		app.element.notification.bar.style.display = "inherit";
		dom.addClass(app.element.navbar.container, "notification");
		setTimeout(function(){dom.removeClass(app.element.navbar.container, "notification")}, 3000);
		setTimeout(function(){app.element.notification.bar.style.display = "none"; ui.isToastInProgress = false;}, 4000);
		/*
		document.getElementById("toast_desc").innerHTML = text;
		var x = document.getElementById("toast")
		x.className = "show";
		setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
		*/
	},

	/**
	 * Turns dark mode on or off
	 * @param {boolean} state		True for dark mode, false for light
	 */
	setDarkMode: function(state){
		this.darkMode = state;
		this.updateMode();
		try { ga('send', 'event', 'ui', 'setdarkmode='+state); } catch (e) {}
	},

	/**
	 * Enables or disables line break between [subject name] and [classroom + teacher] blocks
	 * @param {boolean} state		True for line breaks enabled, false for not
	 */
	setLineBreak: function(state){
		this.breakLineInItem = state;
		refreshView();
		try { ga('send', 'event', 'ui', 'setlinebreak='+state); } catch (e) {}
	},

	/**
	 * Enables or disables floating [classroom + teacher] blocks to the right side
	 * @param {boolean} state		True for right float enabled, false for not
	 */
	setJumpButtonsFloatRight: function(state){
		this.jumpButtonsFloatRight = state;
		refreshView();
		try { ga('send', 'event', 'ui', 'setjumpbuttonsfloatright='+state); } catch (e) {}
	},

	/**
	 * [TODO: deprecate me] 
	 * Activates light/dark theme
	 */
	updateMode: function(){
		if (this.darkMode){
			document.body.className = "dark";
		}else{
			document.body.className = "";
		}
	},	

	/**
	 * Returns line breaker (with css appropriate to current setting)
	 * @returns HTMLElement <div>
	 */
	itemLineBreak: function(){
		lineBreak = document.createElement('div');
		if (this.breakLineInItem){
			lineBreak.className = 'item_linebreak';
		}else{
			lineBreak.className = 'item_linebreak_disabled';
		}
		lineBreak.innerHTML = "&nbsp;";
		return lineBreak;
	},

	/**
	 * 1. Prepares current document to be printed:
	 * 1.1. Disables overrides
	 * 1.2. Sets view to all days
	 * 1.3. Changes navbar message to: Plan lekcji dla [nauczyciela/sali/klasy] [xyz] z dnia [xyz]
	 * 1.4. Hides navbar buttons
	 * 2. Opens print dialog
	 * 3. Undo changes made to layout
	 */
	print: function(){
		if (app.themeLoaded){
			alert("Drukowanie z włączonym motywem nie jest wspierane. Tymczasowo wyłączam motyw.")
			localStorage.setItem("disable_116_birthday_once", true);
			document.location.reload();
			return;
		}

		old_overrides_disabled = overrides_disabled;
		overrides_disabled = true;
		oldActiveColumn = columns.activeColumn;
		columns.setActive(-1);
		refreshView();
		
		o_copy = document.getElementsByClassName("copyright")[0].innerHTML;
		o_status = document.getElementById("status").innerHTML;

		/*document.getElementsByClassName("copyright")[0].innerHTML = "<i>(dev.polgesek.pl/zseilplan)</i><br>"+o_copy+"<br>";*/
		// document.getElementsByClassName("copyright")[0].innerHTML = " <span class='copyright_small'>"+document.getElementsByClassName("copyright")[0].innerHTML+"</span>";
		document.getElementsByClassName("copyright")[0].innerHTML = "Plan lekcji dla&nbsp;<b>";
		if (this.itemDisplayType == 0){
			document.getElementsByClassName("copyright")[0].innerHTML += "nauczyciela ";
			try {
				document.getElementsByClassName("copyright")[0].innerHTML += data.teachermap[select_teachers.value.toLowerCase()][0];
			} catch (error) {
				document.getElementsByClassName("copyright")[0].innerHTML += select_teachers.value;
			}
		}else if (this.itemDisplayType == 1){
			document.getElementsByClassName("copyright")[0].innerHTML += "<b>sali " + select_rooms.value + "</b>";
		}else if (this.itemDisplayType == 2){
			document.getElementsByClassName("copyright")[0].innerHTML += "<b> klasy " + select_units.value + "</b>";
		}
		document.getElementsByClassName("copyright")[0].innerHTML += " z dnia <b>"+data._updateDate_min+"</b>";

		dom.addClass(document.getElementsByClassName("navbar-buttons")[0],"hidden");

		print();
		
		dom.removeClass(document.getElementsByClassName("navbar-buttons")[0],"hidden");
		document.getElementsByClassName("copyright")[0].innerHTML = o_copy;
		document.getElementById("status").innerHTML = o_status;
		overrides_disabled = old_overrides_disabled;
		
		if (oldActiveColumn != 9000) columns.setActive(oldActiveColumn);

		app.ae('print', 'print', '1');
	},

	/**
	 * Resets selects which weren't passed as without
	 * @param {string} without			Which select should *not* be reset [unit/rooms/teachers]
	 * @returns HTMLElement <div>
	 */
	resetSelects: function(without){
		if (detectIE() && document.super_fucking_old_ie) return;
		toClear = ["units", "rooms", "teachers"];
		toClear.splice(toClear.indexOf(without),1);
		for (x in toClear){
			document.getElementById(toClear[x]).value = "default";
		}
	},

	/**
	 * Show or hide preferences modal (isn't this deprecated?)
	 * @param {boolean} display			True - display modal, false - hide
	 */
	showPreferences: function(display){
		myStorage.generatePreferencesUI();
		if (display){
			document.getElementById("preferences").style.display = "block";
			document.getElementsByClassName("container")[0].className = "container blur";
		}else{
			document.getElementById("preferences").style.display = "none";
			document.getElementsByClassName("container")[0].className = "container";
		}
	},


	showXPinfo: function(){
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
		app.element.status.parentNode.insertBefore(XPinfo, app.element.status.nextSibling);
		return true;
	},

	/**
	 * Blur main container
	 * @param {boolean} value			True - blur, false - do not
	 */
	containerBlur: function(value){
		if (value){
			dom.addClass(document.getElementById("container"), "blur");
		}else{
			dom.removeClass(document.getElementById("container"), "blur");
		}
	},

	/**
	 * Clears main table (compatibile with old IE)
	 */
	clearTable: function(){
		if (detectIE() && document.super_fucking_old_ie){
			while (table.hasChildNodes()) {
				table.removeChild(table.lastChild);
			}
		}else{
			table.innerHTML = "";
		}
	}
}

/*

itemDisplayType:
	0 - nauczyciel (klasa + sala),
	1 - sala (klasa + nauczyciel),
	2 - klasa (nauczyciel + sala)

*/