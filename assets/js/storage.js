/* Storage
if (typeof(Storage) !== "undefined") {
    document.getElementById("storageControl").className = "";
}
 */

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
	
		document.getElementById("units").value = localStorage.getItem("select_units");
		document.getElementById("teachers").value = localStorage.getItem("select_teachers");
		document.getElementById("rooms").value = localStorage.getItem("select_rooms");
	
		
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
		// prefsTitle.innerText = "Ustawienia";
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
				title.innerText = element[3];
	
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
		prefsBtnSave.innerText = "Zapisz zmiany";
		prefsBtnSave.onclick = function(){myStorage.save();ui.showPreferences(0);};
		prefsBtnSave.className = "btn-primary";
		row.appendChild(prefsBtnSave);

		prefsBtnCancel = document.createElement('button');
		prefsBtnCancel.innerText = "Anuluj";
		prefsBtnCancel.onclick = function(){ui.showPreferences(0)};
		row.appendChild(prefsBtnCancel);

		prefsBtnCancel = document.createElement('button');
		prefsBtnCancel.innerText = "QS";
		prefsBtnCancel.onclick = function(){ui.showPreferences(0); quicksearch.show();};
		row.appendChild(prefsBtnCancel);

		preferencesDiv.appendChild(row);
		/*
		prefsBtnClear = document.createElement('button');
		prefsBtnClear.innerText = "Usuń ustawienia domyślne";
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