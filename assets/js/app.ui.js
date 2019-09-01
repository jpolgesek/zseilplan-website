app.ui = {
	breakLineInItem: false,
	darkMode: false,
	itemDisplayType: 0,
	isOverride: false,
	isToastInProgress: false,
	jumpButtonsFloatRight: true,

	elements: {
		navbar: {
			datasrc_text: document.querySelector("#nav__datasrc"),
			buttons_container: document.querySelector("#navbar-buttons"),
			buttons: {}
		},

		select: {
			unit: document.querySelector("#units"),
			teacher: document.querySelector("#teachers"),
			classroom: document.querySelector("#rooms")
		},

		info: {
			status_text: document.querySelector("#status")
			//TODO: other ones (remote_info, networkStatus)
		},

		table: document.querySelector("#maintable"),

		footer: {
			datasrc_text: 	document.querySelector("#footer__datasrc"),
			build_text: 	document.querySelector("#footer__build"),
			bugreport_btn: 	document.querySelector("#footer__bugreport"),
			copyright_text: document.querySelector("#footer__copyright")
		}
	},

	toast: {
		timerID: undefined,
		inProgress: false,
		show: function(text, time){
			if (app.ui.toast.inProgress) return false;
			app.ui.toast.inProgress = true;
			if (app.ui.toast.timerID != undefined) clearTimeout(app.ui.toast.timerID);
			if (time == undefined) time = 2400;
			app.element.notification.text.innerHTML = text;
			app.element.notification.bar.style.display = "inherit";
			dom.addClass(app.element.navbar.container, "notification");
			// app.element.notification.bar.onclick = app.ui.toast.hide;
			setTimeout(app.ui.toast.hide, time);
			return true;
		},
		hide: function(){
			dom.removeClass(app.element.navbar.container, "notification");
			// app.element.notification.bar.onclick = null;
			app.ui.toast.timerID = setTimeout(function(){
				app.element.notification.bar.style.display = "none"; 
				app.ui.toast.inProgress = false;
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
		},

		/**
		 * Shows error text in loader
		 * @param {string} 	header 			Header text to be shown in loader
		 * @param {string} 	text 			Text to be shown in loader
		 * @returns {boolean} 				True on success, false on failure
		 */
		setError: function(header, text){
			try{
				app.element.loader.animation.parentElement.removeChild(app.element.loader.animation);
				document.body.style.background = "#520505";
				app.element.loader.title.style.color = "#FFF";
				app.element.loader.text.style.color = "#FFF";
				app.element.loader.title.innerHTML = header;
				app.element.loader.text.innerHTML = text;
				return true;
			}catch(e){
				return false;
			};	
		}
	},

	table: {
		createHeader: function(table){
			var header = table.insertRow(-1); //-1 for backwards compatibility
		
			header.className = "header";
			text_arr = ["Nr", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

			for (i=0; i<6; i++){
				header.appendChild(app.utils.createEWC("th", [], text_arr[i]));
			}
			
		},

		insertNumber: function(table, y){
			var row = table.insertRow(-1); //-1 for backwards compatibility
			var cell = row.insertCell(-1); //-1 for backwards compatibility
		
			timespan = timeSteps[(y*2-2)] + " - "+ timeSteps[(y*2)-1];
		
			cell.appendChildren([
				app.utils.createEWC("b", ["col-lesson-number"], y.toString()),
				app.utils.createEWC("span", ["col-lesson-timespan"], timespan),
			]);
			
			return row;
		},

		visibleColumn: -1,
		
		setVisibleColumn: function(i){
			this.visibleColumn = i;
			this.updateVisibleColumn();
		},

		updateVisibleColumn: function(){},
	},

	showBuild: function(){
		if (window.ZSEILPLAN_BUILD){
			this.setElementText("footer.build_text", `Super Clever Plan build ${ZSEILPLAN_BUILD}`);
		} else {
			this.setElementText("footer.build_text", "Super Clever Plan internal build");
		}
	},

	initComments: function(){
		/* Show data comment */
		try {
			this.setElementText("footer.datasrc_text", `${data.comment} (${data.hash.substr(0,8)})`);
		} catch (error) {
			this.setElementText("footer.datasrc_text", "Nie udało się pobrać wersji planu.");
		}
		
		/* TODO: fix me */
		/* Show timetable update date */
		if (data._updateDate_max == data._updateDate_min) {
			//TODO: do not show on desktop
			this.updateStatus("Plan z dnia "+data._updateDate_max); 
			this.setElementText("navbar.datasrc_text", "Plan z dnia "+data._updateDate_max);
		} else {
			//TODO: do not show on desktop
			this.setElementText("navbar.datasrc_text", "Plan z dni "+data._updateDate_max+" - "+data._updateDate_min);
		}
		
		/* TODO: fix me */
		try {
			if (Object.keys(data.overrideData).length > 0){
				this.updateStatus("<br>Zastępstwa na "+Object.keys(data.overrideData).map(function(s){return s.substr(0,5)}).sort().join());
			}
			this.updateStatus("<br><a href='javascript:void(0)' onclick='document.location.reload()'>Odśwież</a>");
		} catch (e) {}

	},

	initSelects: function(){		
		data_googleindex_info_text = ""
		data_googleindex_info_text = "W indeksie jest: ";

		/* Add units to select_units and quicksearch */
		this.setStatus("Przygotowywanie interfejsu: klasy");
		
		while (select_units.firstChild) {
			select_units.removeChild(select_units.firstChild);
		}

		select_units.options[0] = new Option("Klasa", "default");
		for (unit in data.units) {
			select_units.options[select_units.options.length] = new Option(data.units[unit], data.units[unit]);
			// data_googleindex_info_text += "<a href='index.html#k"+data.units[unit]+"'>plan "+data.units[unit]+"</a>, ";
			data_googleindex_info_text += "plan "+data.units[unit]+", ";
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

		data_googleindex_info_text += "plany "+ Object.keys(data.teachermap).length +" nauczycieli";
		
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

		data_googleindex_info_text += " i "+ data.classrooms.length +" sal.";
		
		/* Attach change events to select menus */
		select_units.onchange = refreshView	;
		select_units.oninput = refreshView;
		select_teachers.onchange = refreshView;
		select_teachers.oninput = refreshView;
		select_rooms.onchange = refreshView;
		select_rooms.oninput = refreshView;
		data_googleindex_info.innerHTML = data_googleindex_info_text;

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
	setStatus: function(text, update){
		return this.setElementText("info.status_text", text, update);
	},

	/**
	 * Updates status text
	 * @param {string} 	text 			Text to be shown
	 * @returns {boolean} 				True on success, false on failure
	 * @deprecated 						Use setStatus with update = true
	 */
	updateStatus: function(text){
		return this.setStatus(text, true);
	},

	/**
	 * Changes text of any element in app.ui.elements
	 * @param {string} 	el_path 		Path to element (ex: navbar.datasrc_text)
	 * @param {string} 	text 			Text to be shown
	 * @param {boolean} update 			Update or overwrite previous text
	 * @returns {boolean} 				True on success, false on failure
	 */
	setElementText: function(el_path, text, update){
		el_path = el_path.split(".");
		if (el_path.length > 10) return false;

		el = this.elements;

		while (el_path.length){
			el = el[el_path.shift()];
		}

		try{
			if (update){
				el.innerHTML += text;
			}else{
				el.innerHTML = text;
			}
			return true;
		}catch(e){
			return false;
		};	
	},

	/**
	 * Creates navbar button
	 * @param {string} icon				HTML string to be used as an icon
	 * @param {string} text				Text that will be shown on hover
	 * @param {function} onclick		Function for onclick
	 * @param {object} options			TODO: Options {desktop_only: true, mobile_only: false}
	 */
	createNavbarButton: function(src_icon, src_text, onclick){
		var buttonsContainer = app.element.navbar.buttons.container;
		var thisButton = document.createElement("button");
		var icon = document.createElement("div");
		var text = document.createElement("div");

		dom.addClass(thisButton, "print-hide");
		dom.addClass(icon, "icon");
		dom.addClass(text, "text");

		thisButton.onclick = onclick;
		icon.innerHTML = src_icon;
		text.innerHTML = src_text;
		
		thisButton.appendChild(icon);
		thisButton.appendChild(text);
		buttonsContainer.appendChild(thisButton);
		return thisButton;
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
			if (app.isEnabled("overrides_summaryModal")){
				zMark.onclick = function(){
					overrides.summaryModal(n, "old_teacher");
				}
			}
			document.getElementsByClassName("header")[0].children[n].appendChild(zMark);
		}
	},

	/**
	 * Creates a single item (lesson)
	 * @param {object} 	itemData		Data for new item (TODO: write structure somewhere)
	 */
	createItem: function(itemData){
		if (itemData.p.length >= 30){
			itemData.p = itemData.p.split(" ")[0];
		}

		span = [
			app.utils.createEWC("span", ["pName"], itemData.p),
			app.utils.createEWC("span", ["clickable"]),
			app.utils.createEWC("span", ["clickable"]),
			document.createElement('span')
		];

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
			span[1].onclick = function(){app.jumpTo(2, itemData.k)};
			span[2].innerHTML = itemData.s;
			span[2].onclick = function(){app.jumpTo(1, itemData.s)};
		}else if (this.itemDisplayType == 1){
			span[1].innerHTML = itemData.k;
			span[1].onclick = function(){app.jumpTo(2, itemData.k)};
			span[2].innerHTML = itemData.n;
			try {
				span[2].title = data.teachermap[itemData.n];
			} catch (error) {
				span[2].title = "Brak informacji";
			}
			span[2].onclick = function(){app.jumpTo(0, itemData.n)};
		}else if (this.itemDisplayType == 2){
			span[1].innerHTML = itemData.n;
			try {
				span[1].title = data.teachermap[itemData.n];
			} catch (error) {
				span[1].title = "Brak informacji";
			}
			span[1].onclick = function(){app.jumpTo(0, itemData.n)};
			span[2].innerHTML = itemData.s;
			span[2].onclick = function(){app.jumpTo(1, itemData.s)};
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
		if (app.ui.ui.isToastInProgress) return;

		app.ui.ui.isToastInProgress = true;
		app.element.notification.text.innerHTML = text;
		app.element.notification.bar.style.display = "inherit";
		dom.addClass(app.element.navbar.container, "notification");
		setTimeout(function(){dom.removeClass(app.element.navbar.container, "notification")}, 3000);
		setTimeout(function(){app.element.notification.bar.style.display = "none"; app.ui.isToastInProgress = false;}, 4000);
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
		if (typeof window.print != "function"){
			return alert("Twoja przeglądarka nie wspiera funkcji drukowania");
		}

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
		
		o_copy = this.elements.navbar.datasrc_text.innerHTML;

		this.elements.navbar.datasrc_text.innerHTML = "Plan lekcji dla&nbsp;<b>";
		if (this.itemDisplayType == 0){
			this.elements.navbar.datasrc_text.innerHTML += "nauczyciela ";
			try {
				this.elements.navbar.datasrc_text.innerHTML += data.teachermap[select_teachers.value.toLowerCase()][0];
			} catch (error) {
				this.elements.navbar.datasrc_text.innerHTML += select_teachers.value;
			}
		}else if (this.itemDisplayType == 1){
			this.elements.navbar.datasrc_text.innerHTML += "<b>sali " + select_rooms.value + "</b>";
		}else if (this.itemDisplayType == 2){
			this.elements.navbar.datasrc_text.innerHTML += "<b> klasy " + select_units.value + "</b>";
		}
		this.elements.navbar.datasrc_text.innerHTML += " z dnia <b>"+data._updateDate_min+"</b>";

		dom.addClass(this.elements.navbar.buttons_container, "hidden");

		try {
			print();
		} catch(e) {
			alert(`Wystąpił błąd podczas drukowania.\nE: ${e.toString()}`);
		}
		
		dom.removeClass(this.elements.navbar.buttons_container,"hidden");
		this.elements.navbar.datasrc_text.innerHTML = o_copy;
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
		// TODO: Will be replaced with auto redirect to old version.
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
	},

	setPageTitle: function(text){
		if (text){
			document.getElementsByTagName("title")[0].innerHTML = `${text} | Super Clever Plan`;
		}else{
			document.getElementsByTagName("title")[0].innerHTML = `Super Clever Plan`;
		}
	}
}

/*

itemDisplayType:
	0 - nauczyciel (klasa + sala),
	1 - sala (klasa + nauczyciel),
	2 - klasa (nauczyciel + sala)

*/