var settings = {
	createModal: function(){
		this.unsavedPrefs = {};
		
		preferencesDiv = app.ui.modal.createTabbed(
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
						dataTarget: "app.ui.breakLineInItem",
						onClick: function(){app.ui.setLineBreak(this.checked)},
						desc: "Zawijaj wiersze po nazwie przedmiotu"
					},
					{
						devOnly: false,
						type: "checkbox",
						dataTarget: "app.ui.jumpButtonsFloatRight",
						onClick: function(){app.ui.setJumpButtonsFloatRight(this.checked)},
						desc: "Wyrównuj sale i nauczycieli do prawej strony"
					},
					{
						devOnly: true,
						type: "checkbox",
						dataTarget: "notifications_enabled",
						onClick: function(){toggleNotifications(this.checked)},
						desc: "Odbieraj powiadomienia"
					},
					{
						devOnly: false,
						type: "checkbox",
						dataTarget: "overrides_disabled",
						onClick: function(){overrides_disabled = this.checked; refreshView();},
						desc: "Tymczasowo ukryj zastępstwa"
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
						desc: "Źródło zastępstw"
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
						desc: "Źródło planu"
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
						dataTarget: "_internal.data_view.file",
						dataSource: diff.getPreviousTimetableVersions(),
						desc: "Wybierz wersję planu"
					},
					{
						devOnly: false,
						type: "select",
						dataTarget: "_internal.data_view.type",
						dataSource: [
							{"name": "Tylko wyświetl", "value": "view"},
							{"name": "Wyświetl i porównaj z obecną wersją", "value": "compare"},
						],
						desc: ""
					},
					{
						devOnly: false,
						type: "button",
						onclick: function(){
							file = settings.unsavedPrefs["_internal.data_view.file"] || diff.getPreviousTimetableVersions()[0].value;

							if (settings.unsavedPrefs["_internal.data_view.type"] == "compare"){
								diff.compareSelected(file); 
								app.isDiff = true;
								settings.closeModal();
							}else{
								app.ui.clearTable(); 
								app.isCustomDataVersion = true; 
								app.fetchData(file); 
								settings.closeModal();
							}
						},
						desc: "Wykonaj"
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
						onClick: function(x){return;}
					},
					{
						devOnly: false,
						type: "button",
						onclick: function(){alert("TODO")},
						desc: "Ustaw obecnie wyświetlany plan jako domyślny"
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
						dataSource: "app.testMode",
						dataTarget: "app.testMode",
						desc: "Włącz funkcje testowe."
					},
				]
			}
			
		];

		for (var i = 0; i < sections.length; i++){
			var section = sections[i];
			var sectionContainer = document.createElement("div");
			sectionContainer.id = section.id;
			sectionContainer.appendChild(app.ui.modal.createSectionHeader(
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
			preferencesDiv.sectionList.appendChild(app.ui.modal.createTab(
				section.name,
				section.id,
				(i == 0)
			));
		}

		/*if (!app.testMode){
			prefsList.splice(3,1);
		}*/

		row = document.createElement('div');
		row.className = "row";

		row.appendChild(app.ui.modal.createButton({
			innerHTML: "Zapisz zmiany",
			onClick: function(){
				settings.save();
				settings.closeModal();
			},
			primary: true
		}));

		row.appendChild(app.ui.modal.createButton({
			innerHTML: "Anuluj",
			onClick: settings.closeModal
		}));

		row.appendChild(app.ui.modal.createButton({
			innerHTML: "QS",
			onClick: function(){
				app.ui.showPreferences(0); 
				quicksearch.show();
			}
		}));

		preferencesDiv.appendChild(row);
		
		document.body.appendChild(preferencesDiv);
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
		var row = app.ui.modal.createRow();

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

			change_text = "Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i kliknij przycisk poniżej.";

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
		}else if(itemData.type == "button"){
			btn = document.createElement("button");
			btn.className = "content_btn";
			btn.innerHTML = itemData.desc;
			btn.onclick = itemData.onclick;
			row.appendChild(btn);
		}


		if (input && itemData.dataTarget && !itemData.onChange){
			input.onchange = function(e) {
				if (typeof this.checked != "undefined"){
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
			if (key.startsWith("_internal")) return;
			value = this.unsavedPrefs[key];
			console.log(`preferences.set('${key}', ${value})`);
			preferences.set(key, value);
		})
		preferences.save();
	}
};