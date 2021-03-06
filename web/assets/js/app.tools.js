app.tools = {
	selectToolModal: function(){
		toolselectDiv = app.ui.modal.createTabbed({title: "Narzędzia", tabbed: false});
		row = app.ui.modal.createRow();

		tools_desc = `Tutaj znajdzie się jakiś ładny opis wyjaśniający czym są te narzędzia.`
		
		desc = app.utils.createEWC("p", ["desc"], tools_desc);
		btn1 = app.utils.createEWC("button", ["content_btn", "big_btn"], '<i class="icon-search-location"></i> Wyszukaj wolne sale');
		btn2 = app.utils.createEWC("button", ["content_btn", "big_btn"], '<i class="icon-history"></i> Wyświetl poprzednią wersję planu');
		btn3 = app.utils.createEWC("button", ["content_btn", "big_btn"], '<i class="icon-dice"></i> Zmiany w planie');
		btn4 = app.utils.createEWC("button", ["content_btn", "big_btn"], '<i class="icon-user-ninja"></i> Zgłoś błąd');

		btn1.onclick = function(){
			toolselectDiv.close();
			app.tools.findFreeRooms.modal();
		}

		btn2.onclick = function(){
			toolselectDiv.close();
			app.tools.timeTravel.viewModal();
		}

		btn3.onclick = function(){
			toolselectDiv.close();
			app.tools.timeTravel.diffModal();
		}

		btn4.onclick = function(){
			toolselectDiv.close();
			app.bugreport.modal();
		}
		
		btns_row = app.ui.modal.createRow([
			(app.isEnabled("app_tools_findfreerooms")) ? btn1 : document.createElement("div"), 
			(app.isEnabled("app_tools_timetravel")) ? btn2 : document.createElement("div"), 
			(app.isEnabled("app_tools_diffview")) ? btn3 : document.createElement("div"), 
			(app.isEnabled("app_tools_bugreport")) ? btn4 : document.createElement("div")
		]);
		btns_row.classList.add("flex", "wrap");

		toolselectDiv.sectionContent.appendChildren([
			app.ui.modal.createRow(desc),
			btns_row
		]);

		//FIXME: layout
		toolselectDiv.sectionContent.style.padding = "10px";

		toolselectDiv.appendChild(app.ui.modal.createRow());
		toolselectDiv.show();
	},

	findFreeRooms: {
		find: function(day, hour){
			console.log("getFreeRooms", "Start: wolne sale");
			var available_rooms = []
			var dtt = data.timetable;
			for (r in data.classrooms){
				var classroom = data.classrooms[r];
				try {
					var found = false;
					for (unit in dtt[day][hour]){
						var itemsData = dtt[day][hour][unit];
						itemsData = itemsData.filter(function(v){return v.s == classroom;});
						if (itemsData.length != 0){
							found = true;
						}
					}
					if (!found){
						available_rooms.push(classroom);
					}
				}catch (e){utils.err("utils.getFreeRooms", "Error: " + e);}
			}
			console.log("getFreeRooms", "Znaleziono " + available_rooms.length + " sal.");
			return available_rooms;
		},

		modal: function(){
			findFreeRoomsDiv = app.ui.modal.createTabbed({title: "Znajdź wolne sale", tabbed: false});
			row = app.ui.modal.createRow();

			tools_desc = `Tutaj znajdzie się jakiś ładny opis wyjaśniający jak to działa.`
			desc = app.utils.createEWC("p", ["desc"], tools_desc);

			text_result = app.utils.createEWC("p", ["desc"], "");
			
			input_day_source = [];
			text_arr = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

			for (i=0; i<5; i++){
				input_day_source.push({name: text_arr[i], value: (i+1), selected: (i == columns.getCurrentDay())});
			}
			
			input_day = settings.createItem({
				type: "select",
				dataSource: input_day_source,
				onChange: function(){},
				desc: "Dzień tygodnia"
			});

			input_hour_source = [];
			for (i=1; i<maxHours+1; i++){
				input_hour_source.push({
					name: `(${i}) ` + timeSteps[(i*2-2)] + " - "+ timeSteps[(i*2)-1], 
					value: i,
					selected: (i == app.datetime.getCurrentLessonHour())
				});
			}
			
			//TODO: Mark current hour as selected
			input_hour = settings.createItem({
				type: "select",
				dataSource: input_hour_source,
				onChange: function(){},
				desc: "Godzina lekcyjna"
			});

			button_search = app.utils.createEWC("button", ["btn-primary"], '<i class="icon-search-location"></i> Szukaj');
			button_back = app.utils.createEWC("button", [], 'Anuluj');

			button_search.onclick = function(){
				r = app.tools.findFreeRooms.find(input_day.input.value, input_hour.input.value);
				if (!r.length){
					text_result.innerHTML = "Niestety, żadna sala lekcyjna nie jest wolna.";
				}else{
					out = "";
					r.forEach(rx => {
						out += `<span style="padding: 4px; margin: 4px; display: inline-block; background: var(--input-button-hover-background); box-shadow: none;" class="clickable">${rx}</span>`;
					})
					text_result.innerHTML = `Następujące sale powinny być wolne: ${out}`;
				}
			}

			button_back.onclick = function(){
				findFreeRoomsDiv.close();
				app.tools.selectToolModal();
			}

			findFreeRoomsDiv.sectionContent.appendChildren([
				app.ui.modal.createRow(desc),
				input_day,
				input_hour,
				app.ui.modal.createRow(text_result)
			]);

			//FIXME: layout
			findFreeRoomsDiv.sectionContent.style.padding = "10px";

			findFreeRoomsDiv.appendChild(app.ui.modal.createRow([
				button_search,
				button_back	
			]));

			findFreeRoomsDiv.show();
		}
	},

	timeTravel: {
		diffModal: function(){
			findFreeRoomsDiv = app.ui.modal.createTabbed({title: "Wyświetl zmiany w planie", tabbed: false});
			row = app.ui.modal.createRow();

			tools_desc = `Tutaj znajdzie się jakiś ładny opis wyjaśniający jak to działa.`
			desc = app.utils.createEWC("p", ["desc"], tools_desc);

			select_datafile_new = app.utils.createEWC("select");

			dataSource = diff.getPreviousTimetableVersions();

			dataSource.forEach(src => {
				var opt = new Option(src.name, src.value);
				opt.selected = src.selected ? src.selected : false;
				select_datafile_new.add(opt);
			});

			text_select_datafile_new = app.utils.createEWC("span", ["desc"], "Wybierz plan do porównania");

			button_diff = app.utils.createEWC("button", ["btn-primary"], '<i class="icon-dice"></i> Porównaj');
			button_back = app.utils.createEWC("button", [], 'Anuluj');

			button_diff.onclick = function(){
				diff.compareSelected(select_datafile_new.value); 
				app.isDiff = true;
				findFreeRoomsDiv.close();
			}
			
			button_back.onclick = function(){
				findFreeRoomsDiv.close();
				app.tools.selectToolModal();
			}

			findFreeRoomsDiv.sectionContent.appendChildren([
				app.ui.modal.createRow(desc),
				app.ui.modal.createRow([select_datafile_new, text_select_datafile_new])
			]);

			//FIXME: layout
			findFreeRoomsDiv.sectionContent.style.padding = "10px";

			findFreeRoomsDiv.appendChild(app.ui.modal.createRow([
				button_diff,
				button_back	
			]));

			findFreeRoomsDiv.show();
		},
		viewModal: function(){
			findFreeRoomsDiv = app.ui.modal.createTabbed({title: "Wyświetl starszy plan", tabbed: false});
			row = app.ui.modal.createRow();

			tools_desc = `Tutaj znajdzie się jakiś ładny opis wyjaśniający jak to działa.`
			desc = app.utils.createEWC("p", ["desc"], tools_desc);

			select_datafile = app.utils.createEWC("select");
			diff.getPreviousTimetableVersions().forEach(src => {
				var opt = new Option(src.name, src.value);
				opt.selected = src.selected ? src.selected : false;
				select_datafile.add(opt);
			});

			text_select_datafile = app.utils.createEWC("span", ["desc"], "Wybierz wersję planu");
			
			button_diff = app.utils.createEWC("button", ["btn-primary"], '<i class="icon-history"></i> Wyświetl');
			button_back = app.utils.createEWC("button", [], 'Anuluj');

			button_diff.onclick = function(){
				app.ui.clearTable(); 
				app.isCustomDataVersion = true; 
				app.fetchData(select_datafile.value); 
				findFreeRoomsDiv.close();
			}
			
			button_back.onclick = function(){
				findFreeRoomsDiv.close();
				app.tools.selectToolModal();
			}

			findFreeRoomsDiv.sectionContent.appendChildren([
				app.ui.modal.createRow(desc),
				app.ui.modal.createRow([select_datafile, text_select_datafile])
			]);

			//FIXME: layout
			findFreeRoomsDiv.sectionContent.style.padding = "10px";

			findFreeRoomsDiv.appendChild(app.ui.modal.createRow([
				button_diff,
				button_back	
			]));

			findFreeRoomsDiv.show();
		}
	}
}