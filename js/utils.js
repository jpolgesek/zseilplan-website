var utils = {
	log: function(caller, text){
		console.log("["+caller+"] " + text);
	},
	warn: function(caller, text){
		console.warn("["+caller+"] " + text);
	},
	error: function(caller, text){
		console.error("["+caller+"] " + text);
	},
	androidDemo: function(){
		
		instruction = "<div class='android-close-btn' onclick='location.reload()'><i class='icon-cancel'></i> Wróć do planu</div>";
		
		instruction += "<div id='android_instruction' class='android-instruction'>";
		
		instruction += "<div class='android-desc'>Jak zainstalować Super Clever Plan na Androidzie</div>";

		// instruction += "<ol>";

		instruction += "<div class='android-step-div'>";
		instruction += "<div class='android-step-no'>1</div>";
		instruction += "<div class='android-step-desc'>"; 
		instruction += "<div class='android-step'>Otwórz Super Clever Plan w przeglądarce (najlepiej Chrome)</div>";
		instruction += "<img class='android-img' src='assets/img/android_step_1.png'>";
		instruction += "</div>";
		instruction += "</div>";

		instruction += "<div class='android-step-div'>";
		instruction += "<div class='android-step-no'>2</div>";
		instruction += "<div class='android-step-desc'>"; 
		instruction += "<div class='android-step'>Otwórz menu</div>";
		instruction += "<img class='android-img' src='assets/img/android_step_2.png'>";
		instruction += "</div>";
		instruction += "</div>";

		instruction += "<div class='android-step-div'>";
		instruction += "<div class='android-step-no'>3</div>";
		instruction += "<div class='android-step-desc'>"; 
		instruction += "<div class='android-step'>Wybierz 'dodaj do ekranu głównego'</div>";
		instruction += "<img class='android-img' src='assets/img/android_step_3.png'>";
		instruction += "</div>";
		instruction += "</div>";

		instruction += "<div class='android-step-div'>";
		instruction += "<div class='android-step-no'>4</div>";
		instruction += "<div class='android-step-desc'>"; 
		instruction += "<div class='android-step'>Kliknij 'dodaj'</div>";
		instruction += "<img class='android-img' src='assets/img/android_step_4.png'>";
		instruction += "</div>";
		instruction += "</div>";

		// instruction += "</ol>";
		instruction += "</div>";

		document.body.innerHTML = instruction;

		setTimeout(function(){
			dom.addClass(document.getElementById("android_instruction"), "anim");
		}, 1)
		

		// androidDemoDiv = modal.create('test', "Aplikacja na Androida", instruction, function(){});
		
		/*
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
		
		// prefsTitle = document.createElement('h1');
		// prefsTitle.innerText = "Ustawienia";
		// androidDemoDiv.appendChild(prefsTitle);
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
				
				input.setAttribute("onclick",""+element[4]+"(this.checked)");
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

				title.innerHTML = "TODO: fix wrapping";
				
				row.appendChild(biginfo);
				row.appendChild(title);
			}

			androidDemoDiv.appendChild(row);
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

		androidDemoDiv.appendChild(row);
		*/
		// document.body.appendChild(androidDemoDiv);
	}
};