var settings = {
	createModal: function(){
		this.unsavedPrefs = {};
		
		preferencesDiv = app.ui.modal.createTabbed(
			{	
				title: "Ustawienia",
				tabbed: true
			}
		);

		var sections = [
			{
				name: '<i class="icon-history" style="min-width: 20px"></i> Ogólne',
				id: "modal_settings_s_main",
				items: [
					{
						devOnly: true,
						type: "checkbox",
						dataSource: app.serviceWorkersSuck.notifications.state,
						dataTarget: "__internal",
						onClick: function(){app.serviceWorkersSuck.notifications.toggle(this.checked)},
						desc: "Odbieraj powiadomienia"
					},
					{
						devOnly: false,
						type: "checkbox",
						dataSource: overrides_disabled,
						dataTarget: "overrides_disabled",
						onClick: function(){overrides_disabled = this.checked; refreshView();},
						desc: "Tymczasowo ukryj zastępstwa"
					}
				]
			},
			{
				name: '<i class="icon-pencil-ruler" style="min-width: 20px"></i> Wygląd',
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
					},
					{
						devOnly: false,
						type: "checkbox",
						dataTarget: "ui.breakLineInItem",
						onClick: function(){
							app.ui.setLineBreak(this.checked); 
							try{document.querySelector("#special_preview_cell").reload()}catch(e){}
						},
						desc: "Zawijaj wiersze po nazwie przedmiotu"
					},
					{
						devOnly: false,
						type: "checkbox",
						dataTarget: "ui.jumpButtonsFloatRight",
						onClick: function(){
							app.ui.setJumpButtonsFloatRight(this.checked); 
							try{document.querySelector("#special_preview_cell").reload()}catch(e){}
						},
						desc: "Wyrównuj sale i nauczycieli do prawej strony"
					},
					{
						devOnly: false,
						type: "special_preview_cell",
						dataSource: false,
						onClick: function(x){return;}
					},
				]
			},
			{
				name: '<i class="icon-database" style="min-width: 20px"></i> Źródło danych',
				id: "modal_settings_s_dataSource",
				test_only: true,
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
				name: '<i class="icon-home" style="min-width: 20px"></i> Strona startowa',
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
						onclick: function(){
							if (app.currentView.selectedType == ""){
								return alert("Nic nie jest wybrane"); //TODO: User friendly message
							}
							preferences.set("app.homeType", app.currentView.selectedType, true);
							preferences.set("app.homeValue", app.currentView.selectedValue, true);
							alert("OK!");
						},
						desc: "Ustaw obecnie wyświetlany plan jako domyślny"
					},
				]
			},
			{
				name: '<i class="icon-flask" style="min-width: 20px"></i> Funkcje testowe',
				id: "modal_settings_s_tests",
				items: [
					{
						devOnly: false,
						type: "checkbox",
						dataSource: app.testMode,
						dataTarget: "app.testMode",
						desc: "Włącz funkcje testowe."
					},
					{
						devOnly: false,
						type: "input_text",
						onEnter: function(text){
							document.getElementById('search').value = text;
							quicksearch.search({keyCode: 13});
						},
						dataSource: app.testMode,
						dataTarget: "app.testMode",
						placeholder: "Wpisz kod",
						desc: "QuickSearch"
					},
				]
			}
			
		];

		for (var i = 0; i < sections.length; i++){
			var section = sections[i];

			if (section.test_only && !app.testMode) {
				continue;
			}

			var sectionContainer = document.createElement("div");
			sectionContainer.id = section.id;
			sectionContainer.appendChild(app.ui.modal.createSectionHeader(
				section.name.split("</i>")[1]
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
				preferencesDiv.close();
			},
			primary: true
		}));

		row.appendChild(app.ui.modal.createButton({
			innerHTML: "Anuluj",
			onClick: preferencesDiv.close
		}));

		preferencesDiv.appendChild(row);
		
		preferencesDiv.show();

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
			row.input = input;
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
		}else if(itemData.type == "special_preview_cell"){
			special_preview_cell = app.utils.createEWC("span", ["desc"]);
			special_preview_cell.id = "special_preview_cell";

			special_preview_cell.reload = function(){
				gen_items = app.ui.createItem({n: "XY", k: "4G", g: "1/2", s: "123", p: "Przedmiot"}).outerHTML;
				gen_items += app.ui.createItem({n: "ZY", k: "4G", g: "2/2", s: "321", p: "Przedmiot"}).outerHTML;
				
				// FIXME: Uh, don't look here for now
				special_preview_cell.innerHTML = `
					<table class="maintable shadow" style="min-width: 320px;">
						<tbody>
							<tr class="header">
								<th class="col_0 currentTimeFull">Nr</th>
								<th class="col_1">Poniedziałek</th>
							</tr>
							<tr class="">
								<td class="col_0 currentTimeFull">
									<b class="col-lesson-number">1</b>
									<span class="col-lesson-timespan">12:34 - 13:37</span>
								</td>
								<td class="col_1">
									${gen_items}
								</td>
							</tr>
						</tbody>
					</table>
				`;
			};

			special_preview_cell.reload();
			row.appendChild(special_preview_cell);
		}else if(itemData.type == "button"){
			btn = document.createElement("button");
			btn.className = "content_btn";
			btn.innerHTML = itemData.desc;
			btn.onclick = itemData.onclick;
			row.appendChild(btn);
		}else if (itemData.type == "input_text"){
			label = document.createElement('label');
			label.className = ""

			input = document.createElement('input');
			input.type = "text";

			title = document.createElement("span");
			title.className = "desc";
			title.innerHTML = itemData.desc;

			if (itemData.placeholder){
				input.placeholder = itemData.placeholder;
			}

			if (itemData.onEnter){
				input.onkeyup = function(event){
					if (event.which == 13 || event.keyCode == 13){
						itemData.onEnter(input.value);
					}
				}
			}

			label.appendChild(input);
			row.input = input;
			row.appendChild(label);
			row.appendChild(title);
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