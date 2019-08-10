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
	}
}