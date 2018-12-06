/* Storage
if (typeof(Storage) !== "undefined") {
    document.getElementById("storageControl").className = "";
}
 */

var preferences = {
	SCP2Data: {
		"Version": "1.0",
		"LastModified": "01.01.1970 00:01",
		preferences: {
			//Default unit/room/teacher
			"app.homeType": "unit", 	
			"app.homeValue": "4G", 	
			"app.homeGroups": ["2/2"], //TODO 	

			
			/* UI Elements */
			"ui.darkMode": true,
			"ui.breakLineInItem": false,
			"ui.jumpButtonsFloatRight": true,

			"thememanager.enabled": false,
			"thememanager.theme": false,
			"thememanager.version": false,


			/* UI Modifications */

			//Which groups should *NOT* be hidden by grouphider
			"ui.grouphider_groups": ["2/2"], 		

			//When to activate grouphider
			//Possible values: false / "only_home" / "always" (why would anyone want this?)
			"ui.activate_grouphider": "only_home", 	

			//Display quick grouphiden enable/disable switch
			"ui.show_grouphider_switch": true,

			//Removes group information from subject name and moves it to a .clickable span
			"ui.show_group_info": true, 

			//Normalize subject using internal dictionary (TODO: external ones)
			"ui.normalize_subject": true
		}
	},
	storageMethod: undefined, 
	load: function(){
		if (typeof(Storage) == "undefined") {
			this.storageMethod = "disabled";
			utils.log("NewPrefs", "LocalStorage is not available");
		}else{
			this.storageMethod = "localstorage";
		}


		if (this.storageMethod != "localstorage") {
			return;
		}

		if (localStorage.getItem("SCP2Data") == null) {
			utils.log("NewPrefs", "There is no data to load (no SCP2Data)");
			if (app.isEnabled("prefs_autoconvert")){
				this.convert();
				this.save();
			}else{
				return;
			}
		}
		
		this.SCP2Data = localStorage.getItem("SCP2Data");
		this.SCP2Data = JSON.parse(this.SCP2Data);
		

		utils.log("NewPrefs", "Dane w formacie " + this.SCP2Data.Version);
		utils.log("NewPrefs", "Last modified " + this.SCP2Data.LastModified);
		
		/*
		for (key in this.SCP2Data.preferences){
			utils.log("NewPrefs", "Loading " + key +" to app.prefs");
			app.prefs[key] = this.SCP2Data.preferences[key];
		}
		*/

		// app.prefs = this.SCP2Data.preferences;
		
		return true;

	},

	get: function(prefName){
		if (!app.isEnabled("prefs_enable")){
			var val = localStorage.getItem(prefName);
			if (val == "true"){
				return true;
			}else if (val == "false"){
				return false;
			}else{
				return val;
			}
		}

		if (typeof this.SCP2Data.preferences[prefName] == "undefined"){
			return false;
		}else{
			return this.SCP2Data.preferences[prefName];
		}
	},

	set: function(prefName, value, autosave){
		if (!app.isEnabled("prefs_enable")){
			return localStorage.setItem(prefName, value);
		}

		this.SCP2Data.preferences[prefName] = value;
		if (typeof autosave != "undefined" && autosave){
			this.save();
		}
	},

	save: function(){
		this.SCP2Data.LastModified = new Date().toLocaleDateString("pl-PL");
		// this.SCP2Data.preferences = app.prefs;
		
		localStorage.setItem("SCP2Data", JSON.stringify(this.SCP2Data));

		return true;
	},

	clear: function(){
		return localStorage.removeItem("SCP2Data");
	},
	
	//TODO: import: function(){},
	//TODO: export: function(){},

	convert: function(){
		if (localStorage.getItem("saved") != "true") {
			return false; //there are no saved settings
		}
		
		if (typeof localStorage.getItem("select_units") != "undefined" && localStorage.getItem("select_units") != "default") {
			this.SCP2Data.preferences["app.homeType"] = "unit";
			this.SCP2Data.preferences["app.homeValue"] = localStorage.getItem("select_units");
		} else if (typeof localStorage.getItem("select_teachers") != "undefined" && localStorage.getItem("select_teachers") != "default") {
			this.SCP2Data.preferences["app.homeType"] = "teacher";
			this.SCP2Data.preferences["app.homeValue"] = localStorage.getItem("select_teachers");
		} else if (typeof localStorage.getItem("select_rooms") != "undefined" && localStorage.getItem("select_rooms") != "default") {
			this.SCP2Data.preferences["app.homeType"] = "room";
			this.SCP2Data.preferences["app.homeValue"] = localStorage.getItem("select_rooms");
		}
		
		if (localStorage.getItem("ui.darkMode") == "true") {
			this.SCP2Data.preferences["ui.darkMode"] = true;
		} else {
			this.SCP2Data.preferences["ui.darkMode"] = false;
		}
		
		if (localStorage.getItem("ui.breakLineInItem") == "true") {
			this.SCP2Data.preferences["ui.breakLineInItem"] = true;
		} else {
			this.SCP2Data.preferences["ui.breakLineInItem"] = false;
		}

		if (localStorage.getItem("ui.jumpButtonsFloatRight") == "true") {
			this.SCP2Data.preferences["ui.jumpButtonsFloatRight"] = true;
		} else {
			this.SCP2Data.preferences["ui.jumpButtonsFloatRight"] = false;
		}
		
		return true;
	},
	
	parse: function(){
		var skip = false;
		
		if (app.isEnabled("new_hashparser")){
			skip = (app.getUrlRouter() != false);
		}else{
			if (typeof document.location.hash.startsWith != "undefined" && !detectIE()){
				try{
					skip = document.location.hash.startsWith("#n") || document.location.hash.startsWith("#s") || document.location.hash.startsWith("#k");
				}catch(e){}
			}
		}

		if (!skip){
			document.getElementById("units").value = "default";
			document.getElementById("teachers").value = "default";
			document.getElementById("rooms").value = "default";
		
			if (this.SCP2Data.preferences["app.homeType"] == "unit"){
				var target = document.getElementById("units");
			}else if (this.SCP2Data.preferences["app.homeType"] == "teacher"){
				var target = document.getElementById("teachers");
			}else if (this.SCP2Data.preferences["app.homeType"] == "room"){
				var target = document.getElementById("rooms");
			}

			target.value = this.SCP2Data.preferences["app.homeValue"];
			refreshView();
		}
		
		if (this.SCP2Data.preferences["ui.darkMode"]) {
			ui.setDarkMode(true);
		}
		
		ui.breakLineInItem = this.SCP2Data.preferences["ui.breakLineInItem"];
		ui.jumpButtonsFloatRight = this.SCP2Data.preferences["ui.jumpButtonsFloatRight"];

		return true;
	}
}

var myStorage = {
	save: function(){
		/*
			select_units = document.getElementById("units").value;
			select_teachers = document.getElementById("teachers").value;
			select_rooms = document.getElementById("rooms").value;
		*/

		localStorage.setItem("select_units", select_units.value);
		localStorage.setItem("select_teachers", select_teachers.value);
		localStorage.setItem("select_rooms", select_rooms.value);
		
		localStorage.setItem("columns.activeColumn", columns.activeColumn);

		localStorage.setItem("ui.darkMode", ui.darkMode);
		localStorage.setItem("ui.breakLineInItem", ui.breakLineInItem);
		localStorage.setItem("ui.jumpButtonsFloatRight", ui.jumpButtonsFloatRight);

		localStorage.setItem("saved", true);
		// ui.createToast("Zapisałem ustawienia");
		ui.toast.show("Zapisałem ustawienia");
		app.ae('preferences', 'save', '1');
	},
	clear: function(){
		localStorage.removeItem("saved");
		localStorage.removeItem("select_units");
		localStorage.removeItem("select_teachers");
		localStorage.removeItem("select_rooms");
		localStorage.removeItem("columns.activeColumn");
		localStorage.removeItem("ui.darkMode");
		localStorage.removeItem("ui.breakLineInItem");
		localStorage.removeItem("ui.jumpButtonsFloatRight");
		// ui.createToast("Wyczyściłem ustawienia domyślne");
		ui.toast.show("Wyczyściłem ustawienia domyślne");
	},
	load: function(){
		if (localStorage.getItem("saved") != "true"	){
			return;
		}
		
		/* Deprecated in zseilplan 1.0 */
		if (localStorage.getItem("displayColumn") != undefined){
			// localStorage.setItem("activeColumn", localStorage.getItem("displayColumn")); /* Deprecated in zseilplan 2.0 */
			localStorage.removeItem("displayColumn");
			localStorage.removeItem("activeColumn");
			localStorage.removeItem("columns.activeColumn");
		}
		
		var skip = false;

		if (app.testMode == "asdasdasd"){
			skip = (app.getUrlRouter() != false);
		}else{
			if (typeof document.location.hash.startsWith != "undefined" && !detectIE()){
				try{
					skip = document.location.hash.startsWith("#n") || document.location.hash.startsWith("#s") || document.location.hash.startsWith("#k");
				}catch(e){}
			}
		}


		if (!skip){
			document.getElementById("units").value = localStorage.getItem("select_units");
			document.getElementById("teachers").value = localStorage.getItem("select_teachers");
			document.getElementById("rooms").value = localStorage.getItem("select_rooms");
		}
	
		
		if(localStorage.getItem("ui.darkMode") == "true"){
			ui.setDarkMode(true);
		}
		
		if(localStorage.getItem("ui.breakLineInItem") == "true"){
			ui.breakLineInItem = true;
		}

		if(localStorage.getItem("ui.jumpButtonsFloatRight") == "true"){
			ui.jumpButtonsFloatRight = true;
		}

		/* Deprecated in zseilplan 2.0 */
		/*
		try {
			columns.setActive(localStorage.getItem("columns.activeColumn"));
		} catch (error) {
			console.log("Domyslny layout, ale bez selektora. E:"+error)
		}*/

		


		//refreshView();
		//TODO: updateStyle();
	},

	/* Czemu w storage są funkcje UI? */
	generatePreferencesUI: function(){
		// preferencesDiv = document.getElementById("preferences");
		// preferencesDiv.innerHTML = "";
		preferencesDiv = modal.create('preferences', "Ustawienia", "Tutaj możesz dostosować Super Clever Plan do swoich preferencji", function(){ui.showPreferences(0)});
		prefsList = [
			//Source, Change, Name
			["checkbox", ui.breakLineInItem, function(x){ui.setLineBreak(x)}, "Zawijaj wiersze po nazwie przedmiotu", "ui.setLineBreak"],
			["checkbox", ui.jumpButtonsFloatRight, function(x){ui.setJumpButtonsFloatRight(x)}, "Wyrównuj sale i nauczycieli do prawej strony", "ui.setJumpButtonsFloatRight"],
			["checkbox", ui.darkMode, function(x){ui.setDarkMode(x)}, "Tryb nocny", "ui.setDarkMode"],
			//["checkbox", true, function(x){return false;}, "Ładuj zastępstwa"],
			["checkbox", notifications_enabled, function(x){toggleNotifications(x);}, "Odbieraj powiadomienia", "toggleNotifications"],
			["checkbox", overrides_disabled, function(x){return;}, "Tymczasowo ukryj zastępstwa", "toggleOverrides"],
			["timetable", undefined, undefined, undefined, undefined]
		];

		if (!app.testMode){
			prefsList.splice(3,1);
		}
		
		// prefsTitle = document.createElement('h1');
		// prefsTitle.innerHTML = "Ustawienia";
		// preferencesDiv.appendChild(prefsTitle);
		for(var p_i=0; p_i<prefsList.length ; p_i++){
			element = prefsList[p_i];
			row = document.createElement('div');
			row.className = "row";

			if(element[0] == "checkbox"){
				label = document.createElement('label');
				label.className = "switch"
	
				input = document.createElement('input');
				input.type = "checkbox";
				input.checked = element[1];
				
				/* This is very bad. */
				input.setAttribute("onclick",""+element[4]+"(this.checked)");
				/*
				if (isIE){
					input.setAttribute("onclick",""+element[4]+"(this.checked)");
				}else{
					input.onchange = function(){prefsList[(p_i+1)-1][2](this.checked)};
				}
				*/
				span = document.createElement('span');
				span.className = "slider round";
	
				title = document.createElement("span");
				title.className = "desc";
				title.innerHTML = element[3];
	
				label.appendChild(input);
				label.appendChild(span);
				row.appendChild(label);
				row.appendChild(title);
			}else if(element[0] == "timetable"){
				biginfo = document.createElement("span");
				biginfo.className = "preferences_default_big";

				title = document.createElement("span");
				title.className = "desc";

				if ((localStorage.getItem("select_units") != "default") && (localStorage.getItem("select_units") != null)){
					title.innerHTML = "Przy uruchamianiu ładuję automatycznie plan klasy <b>"+localStorage.getItem("select_units")+"</b>.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";
					biginfo.innerHTML = localStorage.getItem("select_units");
				}else if ((localStorage.getItem("select_teachers") != "default") && (localStorage.getItem("select_teachers") != null)){
					title.innerHTML = "Przy uruchamianiu ładuję automatycznie plan nauczyciela <b>"+localStorage.getItem("select_teachers")+"</b>.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";
					biginfo.innerHTML = localStorage.getItem("select_teachers");
				}else if ((localStorage.getItem("select_rooms") != "default") && (localStorage.getItem("select_rooms") != null)){
					title.innerHTML = "Przy uruchamianiu ładuję automatycznie plan sali <b>"+localStorage.getItem("select_rooms")+"</b>.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";
					biginfo.innerHTML = localStorage.getItem("select_rooms");
				}else{
					title.innerHTML = "Przy uruchamianiu nie ładuję automatycznie żadnego planu.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";
					biginfo.innerHTML = "??";
					biginfo.className = "preferences_default_big preferences_default_inactive";
				}

				//title.innerHTML = "TODO: fix wrapping";
				
				row.appendChild(biginfo);
				row.appendChild(title);
			}

			preferencesDiv.appendChild(row);
		}
		
		row = document.createElement('div');
		row.className = "row";

		prefsBtnSave = document.createElement('button');
		prefsBtnSave.innerHTML = "Zapisz zmiany";
		prefsBtnSave.onclick = function(){myStorage.save();ui.showPreferences(0);};
		prefsBtnSave.className = "btn-primary";
		row.appendChild(prefsBtnSave);

		prefsBtnCancel = document.createElement('button');
		prefsBtnCancel.innerHTML = "Anuluj";
		prefsBtnCancel.onclick = function(){ui.showPreferences(0)};
		row.appendChild(prefsBtnCancel);

		prefsBtnCancel = document.createElement('button');
		prefsBtnCancel.innerHTML = "QS";
		prefsBtnCancel.onclick = function(){ui.showPreferences(0); quicksearch.show();};
		row.appendChild(prefsBtnCancel);

		preferencesDiv.appendChild(row);
		/*
		prefsBtnClear = document.createElement('button');
		prefsBtnClear.innerHTML = "Usuń ustawienia domyślne";
		prefsBtnClear.onclick = function(){myStorage.CLEAR();ui.showPreferences(0)};
		preferencesDiv.appendChild(prefsBtnClear);
		*/
		document.body.appendChild(preferencesDiv);
		setTimeout(function(){
			dom.addClass(preferencesDiv, "modal-anim");
		}, 1)
		app.ae('preferences', 'open', '1');
	}
} 	