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
			"app.homeType": undefined, 	
			"app.homeValue": undefined, 	
			"app.homeGroups": ["2/2"], //TODO 	

			
			/* UI Elements */
			"ui.darkMode": true,
			"ui.breakLineInItem": false,
			"ui.jumpButtonsFloatRight": true,

			"thememanager.enabled": true,
			"thememanager.theme": false,
			"thememanager.version": false,


			/* UI Modifications */

			//Which groups should *NOT* be hidden by grouphider
			//"ui.grouphider_groups": ["2/2"], 		

			//When to activate grouphider
			//Possible values: false / "only_home" / "always" (why would anyone want this?)
			"ui.activate_grouphider": false, 	

			//Display quick grouphiden enable/disable switch
			"ui.show_grouphider_switch": true,

			//Removes group information from subject name and moves it to a .clickable span
			"ui.show_group_info": false, 

			//Normalize subject using internal dictionary (TODO: external ones)
			"ui.normalize_subject": false
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
			if (app.isEnabled("prefs_transition")){
				utils.log("NewPrefs", "Starting migration");
				result = this.convert();
				this.save();
				if (result){
					utils.log("NewPrefs", "SCP2Data migration ok!");
				}
			}else{
				return;
			}
		}
		
		this.SCP2Data = localStorage.getItem("SCP2Data");
		this.SCP2Data = JSON.parse(this.SCP2Data);
		

		utils.log("NewPrefs", "Dane w formacie " + this.SCP2Data.Version);
		utils.log("NewPrefs", "Last modified " + this.SCP2Data.LastModified);
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
			this.SCP2Data.preferences["thememanager.theme"] = "0:1";
			this.SCP2Data.preferences["ui.darkMode"] = true;
		} else {
			this.SCP2Data.preferences["thememanager.theme"] = "0:0";
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

			if (target != undefined){
				target.value = this.SCP2Data.preferences["app.homeValue"];
				refreshView();
			}
		}
		
		/* Themes */
		if ((this.SCP2Data.preferences["thememanager.enabled"]) && (typeof this.SCP2Data.preferences["thememanager.theme"] == "string")) {
			try {
				var themeIndex = this.SCP2Data.preferences["thememanager.theme"].split(":")[0];
				var versionIndex = this.SCP2Data.preferences["thememanager.theme"].split(":")[1];
				app.themeManager.activate(themeIndex, versionIndex);
			} catch (e) {}
		}else{
			// Dark mode by default
			app.themeManager.activate(0, 1);
		}

		
		app.ui.breakLineInItem = this.SCP2Data.preferences["ui.breakLineInItem"];
		app.ui.jumpButtonsFloatRight = this.SCP2Data.preferences["ui.jumpButtonsFloatRight"];

		return true;
	}
}

var myStorage = {
	save: function(){
		localStorage.setItem("select_units", select_units.value);
		localStorage.setItem("select_teachers", select_teachers.value);
		localStorage.setItem("select_rooms", select_rooms.value);
		
		localStorage.setItem("columns.activeColumn", columns.activeColumn);

		localStorage.setItem("ui.darkMode", ui.darkMode);
		localStorage.setItem("ui.breakLineInItem", ui.breakLineInItem);
		localStorage.setItem("ui.jumpButtonsFloatRight", ui.jumpButtonsFloatRight);

		localStorage.setItem("saved", true);
		// ui.createToast("Zapisałem ustawienia");
		app.ui.toast.show("Zapisałem ustawienia");
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
		app.ui.toast.show("Wyczyściłem ustawienia domyślne");
	},
	load: function(){
		if (localStorage.getItem("saved") != "true"	){
			return;
		}
		
		/* Deprecated in zseilplan 1.0 */
		if (localStorage.getItem("displayColumn") != undefined){
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
			app.ui.setDarkMode(true);
		}
		
		if(localStorage.getItem("ui.breakLineInItem") == "true"){
			app.ui.breakLineInItem = true;
		}

		if(localStorage.getItem("ui.jumpButtonsFloatRight") == "true"){
			app.ui.jumpButtonsFloatRight = true;
		}
	},

	generatePreferencesUI: function(){
		alert("generatePreferencesUI - DEPRECATED!");
		return;
	}
} 	