var settings = {
	createModal: function(){

		preferencesDiv = app.modal.createTabbed(
			/*"preferences", 
			"Settings - title",
			"Settings - desc", 
			function(){ui.showPreferences(0)},*/
			{	
				title: "Ustawienia",
				closeAction: function(){alert("TODO")},
				tabbed: true
			}
		);

		var sections = [
			{
				name: "Ogólne",
				id: "modal_settings_s_main",
				items: [
					{
						devOnly: false,
						type: "checkbox",
						dataSource: ui.breakLineInItem,
						onClick: function(x){ui.setLineBreak(x)},
						desc: "Zawijaj wiersze po nazwie przedmiotu",
						check: ui.setLineBreak
					},
					{
						devOnly: false,
						type: "checkbox",
						dataSource: ui.jumpButtonsFloatRight,
						onClick: function(x){ui.setJumpButtonsFloatRight(x)},
						desc: "Wyrównuj sale i nauczycieli do prawej strony",
						check: ui.setJumpButtonsFloatRight
					},
					{
						devOnly: false,
						type: "checkbox",
						dataSource: ui.darkMode,
						onClick: function(x){ui.setDarkMode(this.checked)},
						desc: "Tryb nocny (deprecated)",
						check: ui.setDarkMode
					},
					{
						devOnly: true,
						type: "checkbox",
						dataSource: notifications_enabled,
						onClick: function(x){toggleNotifications(x)},
						desc: "Odbieraj powiadomienia",
						check: toggleNotifications
					},
					{
						devOnly: false,
						type: "checkbox",
						dataSource: overrides_disabled,
						onClick: function(x){return;},
						desc: "Tymczasowo ukryj zastępstwa",
						check: toggleOverrides
					},
					{
						devOnly: false,
						type: "timetable",
						dataSource: undefined,
						onClick: undefined,
						desc: undefined,
						check: undefined
					}
				]
			},
			{
				name: "Wygląd",
				id: "modal_settings_s_look",
				items: [
					{
						devOnly: false,
						type: "select",
						dataSource: [
							{name: "Domyślny",  value: "0"},
							{name: "Ciemny", value: "1"},
							{name: "Świąteczny", value: "2"},
							{name: "Świąteczny ciemny", value: "3"},
							{name: "Windows 95", value: "3"},
						],
						onClick: function(x){ui.setDarkMode(this.checked)},
						desc: "Motyw aplikacji",
						check: false
					}
				]
			},
			{
				name: "Źródło danych",
				id: "modal_settings_s_dataSource",
				items: [
					{
						devOnly: false,
						type: "select",
						dataSource: [
							{name: "WWW (zseil.edu.pl)",  value: "www"},
							{name: "Vulcan",  value: "vulcan"},
						],
						onClick: function(x){ui.setDarkMode(this.checked)},
						desc: "Źródło zastępstw",
						check: false
					},
					{
						devOnly: false,
						type: "select",
						dataSource: [
							{name: "WWW (zseil.edu.pl)",  value: "www"},
							{name: "Vulcan",  value: "vulcan"},
						],
						onClick: function(x){ui.setDarkMode(this.checked)},
						desc: "Źródło planu",
						check: false
					}
				]
			},
			{
				name: "Wersja danych",
				id: "modal_settings_s_diff",
				items: [
					{
						devOnly: false,
						type: "select",
						dataSource: [
							{name: "WWW (zseil.edu.pl)",  value: "www"},
							{name: "Vulcan",  value: "vulcan"},
						],
						onClick: function(x){return;},
						desc: "Tu możesz wybrać wersję danych planu, oraz porównać ją z obecną",
						check: ui.setDarkMode
					},
				]
			},
			{
				name: "Strona startowa",
				id: "modal_settings_s_defaults",
				items: [
					{
						devOnly: false,
						type: "special_default",
						dataSource: false,
						onClick: function(x){return;},
						desc: "Tu przyda się ta dziwna kontrolka którą kiedyś pisałem",
						check: ui.setDarkMode
					},
				]
			},
			{
				name: "Funkcje testowe",
				id: "modal_settings_s_tests",
				items: [
					{
						devOnly: false,
						type: "checkbox",
						dataSource: ui.darkMode,
						onClick: function(x){return;},
						desc: "Włącz test xyz.",
						check: ui.setDarkMode
					},
					{
						devOnly: false,
						type: "checkbox",
						dataSource: ui.darkMode,
						onClick: function(x){return;},
						desc: "Włącz test xyz.",
						check: ui.setDarkMode
					},
					{
						devOnly: false,
						type: "checkbox",
						dataSource: ui.darkMode,
						onClick: function(x){return;},
						desc: "Włącz test xyz.",
						check: ui.setDarkMode
					},
				]
			}
			
		];

		for (var i = 0; i < sections.length; i++){
			var section = sections[i];
			var sectionContainer = document.createElement("div");
			sectionContainer.id = section.id;
			sectionContainer.appendChild(app.modal.createSectionHeader(
				section.name
			));

			for (var j = 0; j < section.items.length; j++){
				sectionContainer.appendChild(this.createItem(
					section.items[j]
				));
			}

			if (i != 0){
				sectionContainer.style.display = "none"; 
			}

			preferencesDiv.sectionContent.appendChild(sectionContainer);
			preferencesDiv.sectionList.appendChild(modal.createTab(
				section.name,
				section.id,
				(i == 0)
			));
		}
		/*if (!app.testMode){
			prefsList.splice(3,1);
		}*/

		/*
		
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
				
				// This is very bad. 
				input.setAttribute("onclick",""+element[4]+"(this.checked)");
				
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
		

		*/

		row = document.createElement('div');
		row.className = "row padding-15";

		row.appendChild(app.modal.createButton({
			innerHTML: "Zapisz zmiany",
			onClick: function(){
				myStorage.save();
				ui.showPreferences(0);
			},
			primary: true
		}));

		row.appendChild(app.modal.createButton({
			innerHTML: "Anuluj",
			onClick: function(){
				ui.showPreferences(0);
			}
		}));

		row.appendChild(app.modal.createButton({
			innerHTML: "QS",
			onClick: function(){
				ui.showPreferences(0); 
				quicksearch.show();
			}
		}));

		preferencesDiv.appendChild(row);
		
		document.body.appendChild(preferencesDiv);
		setTimeout(function(){
			dom.addClass(preferencesDiv, "modal-anim");
		}, 1)

		app.ae('settings', 'open', '1');
	},

	createItem: function(itemData){
		var workItem = document.createElement("div");
		workItem.className = "modalSingleItem";
		var row = app.modal.createRow();

		if (itemData.type == "checkbox"){
			label = document.createElement('label');
			label.className = "switch"

			input = document.createElement('input');
			input.type = "checkbox";
			input.checked = itemData.dataSource;

			input.onclick = itemData.onClick;
			
			span = document.createElement('span');
			span.className = "slider round";

			title = document.createElement("span");
			title.className = "desc";
			title.innerHTML = itemData.desc;

			label.appendChild(input);
			label.appendChild(span);
			row.appendChild(label);
			row.appendChild(title);
		}else if (itemData.type == "select"){
			label = document.createElement('label');
			label.className = ""

			input = document.createElement('select');
			input.type = "";

			for (var i = 0; i < itemData.dataSource.length; i++){
				input.options[input.options.length] = new Option(itemData.dataSource[i].name, itemData.dataSource[i].value);
			}

			title = document.createElement("span");
			title.className = "desc";
			title.innerHTML = itemData.desc;

			label.appendChild(input);
			row.appendChild(label);
			row.appendChild(title);
		}else if(itemData.type == "special_default"){
			// biginfo = document.createElement("span");
			// biginfo.className = "preferences_default_big";

			title = document.createElement("span");
			title.className = "desc";

			if (preferences.get("app.homeValue") == false){
				title.innerHTML = "Przy uruchamianiu nie ładuję automatycznie żadnego planu.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";
				// biginfo.innerHTML = "??";
				// biginfo.className = "preferences_default_big preferences_default_inactive";
			}else{
				biginfo = {};
				biginfo.innerHTML = preferences.get("app.homeValue");
				switch (preferences.get("app.homeType")){
					case "unit":
						title.innerHTML = "Przy uruchamianiu ładuję automatycznie plan klasy <b>"+biginfo.innerHTML+"</b>.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";
					break;

					case "teacher":
						title.innerHTML = "Przy uruchamianiu ładuję automatycznie plan nauczyciela <b>"+biginfo.innerHTML+"</b>.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";
					break;

					case "room":
						title.innerHTML = "Przy uruchamianiu ładuję automatycznie plan sali <b>"+biginfo.innerHTML+"</b>.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";
					break;
				}
			}
			
			// row.appendChild(biginfo);
			row.appendChild(title);
		}

		return row;
	}
};