var settings = {
	createModal: function(){
		this.unsavedPrefs = {};
		
		preferencesDiv = app.modal.createTabbed(
			{	
				title: "Ustawienia",
				closeAction: settings.closeModal,
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
						dataTarget: "ui.breakLineInItem",
						onClick: function(){ui.setLineBreak(this.checked)},
						desc: "Zawijaj wiersze po nazwie przedmiotu",
						check: ui.setLineBreak
					},
					{
						devOnly: false,
						type: "checkbox",
						dataTarget: "ui.jumpButtonsFloatRight",
						onClick: function(){ui.setJumpButtonsFloatRight(this.checked)},
						desc: "Wyrównuj sale i nauczycieli do prawej strony",
						check: ui.setJumpButtonsFloatRight
					},
					{
						devOnly: true,
						type: "checkbox",
						dataTarget: "notifications_enabled",
						onClick: function(){toggleNotifications(this.checked)},
						desc: "Odbieraj powiadomienia",
						check: toggleNotifications
					},
					{
						devOnly: false,
						type: "checkbox",
						dataTarget: "overrides_disabled",
						onClick: function(){overrides_disabled = this.checked; refreshView();},
						desc: "Tymczasowo ukryj zastępstwa",
						check: toggleOverrides
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
						dataSource: app.themeManager.getThemesList(),
						dataTarget: "thememanager.theme",
						onChange: function(){
							settings.unsavedPrefs["thememanager.theme"] = this.value; 
							var themeIndex = this.value.split(":")[0];
							var versionIndex = this.value.split(":")[1];
							app.themeManager.activate(themeIndex, versionIndex);
						},
						onClick: undefined,
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
						onChange: function(){
							settings.unsavedPrefs["modal_settings_s_dataSource_overrides"] = this.value; 
						},
						onClick: undefined,
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
						onChange: function(){
							settings.unsavedPrefs["modal_settings_s_dataSource_timetable"] = this.value; 
						},
						onClick: undefined,
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
						onClick: function(x){
							settings.unsavedPrefs["modal_settings_s_tests_TEST_NAME"] = this.checked; 
						},
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

		row = document.createElement('div');
		row.className = "row padding-15";

		row.appendChild(app.modal.createButton({
			innerHTML: "Zapisz zmiany",
			onClick: function(){
				settings.save();
				settings.closeModal();
			},
			primary: true
		}));

		row.appendChild(app.modal.createButton({
			innerHTML: "Anuluj",
			onClick: settings.closeModal
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
		dom.addClass(document.getElementById("container"), "blur")

		app.ae('settings2', 'open', '1');

		document.onkeydown = function(evt) {
			evt = evt || window.event;
			if (evt.keyCode == 27) {
				settings.closeModal();
			}
		};

	},

	closeModal: function(){
		dom.removeClass(document.getElementById("container"), "blur")
		document.body.removeChild(preferencesDiv);
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

			if (itemData.dataTarget){
				input.checked = preferences.get(itemData.dataTarget);
			}

			if (itemData.dataSource){
				input.checked = itemData.dataSource;
			}

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
				input.options[input.options.length - 1].selected = itemData.dataSource[i].selected ? itemData.dataSource[i].selected : false;
			}

			title = document.createElement("span");
			title.className = "desc";
			title.innerHTML = itemData.desc;
			
			if (itemData.onChange){
				input.onchange = itemData.onChange;
			}

			label.appendChild(input);
			row.appendChild(label);
			row.appendChild(title);
		}else if(itemData.type == "special_default"){
			title = document.createElement("span");
			title.className = "desc";

			change_text = "Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i kliknij przycisk poniżej. <br> <button onclick='alert(\"todo\")'>Ustaw obecnie wyświetlany plan jako domyślny</button>";

			if (preferences.get("app.homeValue") == false){
				title.innerHTML = "Przy uruchamianiu nie ładuję automatycznie żadnego planu.<br>" + change_text;
			}else{
				biginfo = {};
				biginfo.innerHTML = preferences.get("app.homeValue");
				switch (preferences.get("app.homeType")){
					case "unit":
						title.innerHTML = "Przy uruchamianiu ładuję automatycznie plan klasy <b>"+biginfo.innerHTML+"</b>.<br>" + change_text;
					break;

					case "teacher":
						title.innerHTML = "Przy uruchamianiu ładuję automatycznie plan nauczyciela <b>"+biginfo.innerHTML+"</b>.<br>" + change_text;
					break;

					case "room":
						title.innerHTML = "Przy uruchamianiu ładuję automatycznie plan sali <b>"+biginfo.innerHTML+"</b>.<br>" + change_text;
					break;
				}
			}
			
			row.appendChild(title);
		}


		if (input && itemData.dataTarget && !itemData.onChange){
			input.onchange = function(e) {
				if (typeof this.checked != undefined){
					settings.unsavedPrefs[itemData.dataTarget] = this.checked;
				}else{
					settings.unsavedPrefs[itemData.dataTarget] = this.value;
				}
			}
		}

		return row;
	},

	save: function(){
		Object.keys(this.unsavedPrefs).forEach((key) => {
			value = this.unsavedPrefs[key];
			console.log(`preferences.set('${key}', ${value})`);
			preferences.set(key, value);
		})
		preferences.save();
	}
};