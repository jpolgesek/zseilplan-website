app.tools = {
	selectToolModal: function(){
		toolselectDiv = app.ui.modal.createTabbed({title: "Narzędzia", tabbed: false});
		row = app.ui.modal.createRow();

		tools_desc = `Tutaj znajdzie się jakiś ładny opis wyjaśniający czym są te narzędzia.`
		
		desc = app.utils.createEWC("p", ["desc"], tools_desc);
		btn1 = app.utils.createEWC("button", ["content_btn"], '<i class="fas fa-search-location"></i> Wyszukaj wolne sale');
		btn2 = app.utils.createEWC("button", ["content_btn"], '<i class="fas fa-history"></i> Wyświetl poprzednią wersję planu');
		btn3 = app.utils.createEWC("button", ["content_btn"], '<i class="fas fa-dice"></i> Zmiany w planie');

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

		toolselectDiv.sectionContent.appendChildren([
			app.ui.modal.createRow(desc),
			app.ui.modal.createRow(btn1),
			app.ui.modal.createRow(btn2),
			app.ui.modal.createRow(btn3)
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

			input_day = app.utils.createEWC("input");
			input_hour = app.utils.createEWC("input");
			input_day.placeholder = "Dzień tygodnia";
			input_hour.placeholder = "Godzina lekcyjna";
			input_day.type = input_hour.type = "number";

			button_search = app.utils.createEWC("button", ["content_btn"], '<i class="fas fa-search-location"></i> Szukaj');

			button_search.onclick = function(){
				r = app.tools.findFreeRooms.find(input_day.value, input_hour.value);
				if (!r.length){
					text_result.innerHTML = "Niestety, żadna sala lekcyjna nie jest wolna.";
				}else{
					text_result.innerHTML = `Następujące sale powinny być wolne: ${r.join(", ")}`;
				}
			}

			findFreeRoomsDiv.sectionContent.appendChildren([
				app.ui.modal.createRow(desc),
				app.ui.modal.createRow(input_day),
				app.ui.modal.createRow(input_hour),
				app.ui.modal.createRow(text_result),
				app.ui.modal.createRow(button_search)
			]);

			//FIXME: layout
			findFreeRoomsDiv.sectionContent.style.padding = "10px";

			findFreeRoomsDiv.appendChild(app.ui.modal.createRow());
			findFreeRoomsDiv.show();
		}
	},

	timeTravel: {
		diffModal: function(){
			findFreeRoomsDiv = app.ui.modal.createTabbed({title: "Wyświetl zmiany w planie", tabbed: false});
			row = app.ui.modal.createRow();

			tools_desc = `Tutaj znajdzie się jakiś ładny opis wyjaśniający jak to działa.`
			desc = app.utils.createEWC("p", ["desc"], tools_desc);

			select_datafile_old = app.utils.createEWC("select");
			select_datafile_new = app.utils.createEWC("select");

			dataSource = diff.getPreviousTimetableVersions();

			dataSource.forEach(src => {
				var opt = new Option(src.name, src.value);
				opt.selected = src.selected ? src.selected : false;
				select_datafile_old.add(opt);
			});

			dataSource.forEach(src => {
				var opt = new Option(src.name, src.value);
				opt.selected = src.selected ? src.selected : false;
				select_datafile_new.add(opt);
			});

			text_select_datafile_old = app.utils.createEWC("span", ["desc"], "Wybierz plan bazowy");
			text_select_datafile_new = app.utils.createEWC("span", ["desc"], "Wybierz plan do porównania");

			button_diff = app.utils.createEWC("button", ["content_btn"], '<i class="fas fa-dice"></i> Porównaj');
			button_diff.onclick = function(){
				diff.compareSelected(select_datafile_new.value); 
				app.isDiff = true;
				findFreeRoomsDiv.close();
			}

			findFreeRoomsDiv.sectionContent.appendChildren([
				app.ui.modal.createRow(desc),
				app.ui.modal.createRow([select_datafile_old, text_select_datafile_old]),
				app.ui.modal.createRow([select_datafile_new, text_select_datafile_new]),
				app.ui.modal.createRow(button_diff)
			]);

			//FIXME: layout
			findFreeRoomsDiv.sectionContent.style.padding = "10px";

			findFreeRoomsDiv.appendChild(app.ui.modal.createRow());
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
			
			button_diff = app.utils.createEWC("button", ["content_btn"], '<i class="fas fa-history"></i> Wyświetl poprzednią wersję planu');
			button_diff.onclick = function(){
				app.ui.clearTable(); 
				app.isCustomDataVersion = true; 
				app.fetchData(select_datafile.value); 
				findFreeRoomsDiv.close();
			}

			findFreeRoomsDiv.sectionContent.appendChildren([
				app.ui.modal.createRow(desc),
				app.ui.modal.createRow([select_datafile, text_select_datafile]),
				app.ui.modal.createRow(button_diff)
			]);

			//FIXME: layout
			findFreeRoomsDiv.sectionContent.style.padding = "10px";

			findFreeRoomsDiv.appendChild(app.ui.modal.createRow());
			findFreeRoomsDiv.show();
		}
	}
}