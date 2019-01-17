var diff = {
	/* json object will be loaded here */
	data: undefined,
	index: undefined,

	select_timetable_old: document.getElementById("select_timetable_old"),
	select_timetable_new: document.getElementById("select_timetable_new"),

	diffInfoElement: document.getElementById("diff-info"),

	loadIndex: function(){
		try {
			utils.log("diff", "Found fetch" + fetch.toString().substr(0,0));
		} catch (error) {
			utils.warn("diff", "Fetch not found, disabling diff");
			return;
		}
		
		fetch("data/index.json").then(function(resp) {
			return resp.json();
		}).then(function(jsondata) {
			diff.index = jsondata;
			// diff.updateIndexUI();
		}).catch(function(error){
			utils.error('diff', 'Nie udało się pobrać pliku z danymi. ' + error);
		});
	},

	createModal: function(){
		diffDiv = modal.create('preferences', "Diff modal", "Tutaj możesz porównać aktualny plan z dowolnym starym", function(){ui.showPreferences(0)});

		prefsList = [
			//Source, Change, Name
			["select", ui.breakLineInItem, function(x){ui.setLineBreak(x)}, "Zawijaj wiersze po nazwie przedmiotu", "ui.setLineBreak"],
			["checkbox", ui.darkMode, function(x){ui.setDarkMode(x)}, "Tryb nocny", "ui.setDarkMode"],
			//["checkbox", true, function(x){return false;}, "Ładuj zastępstwa"],
			["checkbox", notifications_enabled, function(x){toggleNotifications(x);}, "Odbieraj powiadomienia", "toggleNotifications"],
			["checkbox", overrides_disabled, function(x){return;}, "Tymczasowo ukryj zastępstwa", "toggleOverrides"],
			["timetable", undefined, undefined, undefined, undefined]
		];
		
		
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
				span = document.createElement('span');
				span.className = "slider round";
	
				title = document.createElement("span");
				title.className = "desc";
				title.innerHTML = element[3];
	
				label.appendChild(input);
				label.appendChild(span);
				row.appendChild(label);
				row.appendChild(title);
			}

			diffDiv.appendChild(row);
		}
		
		row = document.createElement('div');
		row.className = "row";

		prefsBtnSave = document.createElement('button');
		prefsBtnSave.innerHTML = "Zapisz zmiany";
		prefsBtnSave.onclick = function(){myStorage.save();ui.showPreferences(0);};
		prefsBtnSave.className = "btn-primary";
		row.appendChild(prefsBtnSave);

		prefsBtnCancel = document.createElement('button');
		prefsBtnCancel.innerHTML = "Anuluj";
		prefsBtnCancel.onclick = function(){ui.showPreferences(0)};
		row.appendChild(prefsBtnCancel);

		diffDiv.appendChild(row);
		
		document.body.appendChild(diffDiv);
	},

	updateIndexUI: function(){
		for(i = 0; i < diff.index.timetable_archives.length; i++){
			item = diff.index.timetable_archives[i];
			select_timetable_old.options[select_timetable_old.length] = new Option(item.date + " ("+ item.hash +")", item.filename);
			select_timetable_new.options[select_timetable_new.length] = new Option(item.date + " ("+ item.hash +")", item.filename);
		}
		utils.table(diff.index.timetable_archives);
	},
	
	/* function to fetch json object */
	/* filename - filename of fetched file */
	loadData: function(filename){
		// filename = "data/"+filename;
		fetch(filename).then(function(resp) {
			return resp.json();
		}).then(function(jsondata) {
			diff.loadDataCallback(jsondata);
		}).catch(function(error){
			utils.error('diff', 'Nie udało się pobrać pliku z danymi. ' + error);
		});
	},

	loadDataCallback: function(jsondata){
		this.data = jsondata;
		utils.log('diff', 'Pomyślnie załadowano do porównania plan z dnia ' + diff.data._updateDate_min);
		this.generateDiff();
		if (!app.isMobile){
			columns.setActive(-1);
			refreshView();
		}
	},

	compareSelected: function(filename){
		diff.loadData(filename);
	},

	generateDiff: function(){
		utils.log('diff', "Starting");
		if (this.data == undefined){
			utils.warn('diff', 'Próbujesz porównać plan, ale nic nie wczytałeś.');
			return false;
		}

		if (table.rows.length < 2){
			utils.warn('diff', 'Próbujesz porównać plan, ale nic aktualnie nie jest wyświetlone.');
			return false;
		}

		/* Prepare table UI */
		ui.jumpButtonsFloatRight = true;
		old_overrides_disabled = overrides_disabled;
		overrides_disabled = true;
		oldActiveColumn = columns.activeColumn;

		/* Show info about current diff */
		this.diffInfoElement.innerHTML = "";

		if (select_units.value != "default"){
			this.selectedType = "unit";
			this.diffInfoElement.innerHTML += "Porównujesz plan klasy "+select_units.value + "<br>";
		}else if (select_teachers.value != "default"){
			this.selectedType = "teacher";
			this.diffInfoElement.innerHTML += "Porównujesz plan "+teacherMapping[select_teachers.value] + "<br>";
		}else if (select_rooms.value != "default"){
			this.selectedType = "room";
			this.diffInfoElement.innerHTML += "Porównujesz plan sali "+select_rooms.value + "<br>";
		}

		this.diffInfoElement.innerHTML += "Stary plan z dnia: " + this.data.comment.split("Wyeksportowano ")[1] + " <br>";
		this.diffInfoElement.innerHTML += "Nowy plan z dnia: " + data.comment.split("Wyeksportowano ")[1] + " (aktualny) <br>";


		for (day=1; day<6; day++){
			for (hour=1; hour<maxHours; hour++){
				try {
					itemsContainer = table.rows[hour].cells[day];
					cell = itemsContainer;

					items = itemsContainer.children;
					il = items.length;

					/* Lekcja została usunięta */
					if (il == 0){
						if (this.selectedType == "teacher"){
							oldItem = this.data.teachers[select_teachers.value][day][hour];
							if (oldItem != undefined){
								oldItem.diff = "removed";
								itemsContainer.append(ui.createItem(oldItem));
							}
						} else if (this.selectedType == "room"){
							for (unit in this.data.timetable[day][hour]){
								oldItem = this.data.timetable[day][hour][unit].filter(function(v){return v.s == select_rooms.value;});
								if (oldItem.length > 0){
									oldItem = oldItem[0];
									oldItem.k = unit;
									oldItem.diff = "removed";
									itemsContainer.appendChild(ui.createItem(oldItem));
								}
							}
						} else if (this.selectedType == "unit"){
							try {
								classesArr = this.data.timetable[day][hour][select_units.value];
								if (classesArr != undefined){
									for (cls in classesArr){
										classesArr[cls].diff = "removed";
										itemsContainer.appendChild(ui.createItem(classesArr[cls]));
									}
								}
							} catch (e) {}
						}
					}

					for (i = 0; i < il; i++){
						currentItemElement = items[i];
						currentItem = currentItemElement.zseilplanitem;

						if (this.selectedType == "teacher"){
							oldItem = this.data.teachers[select_teachers.value][day][hour];

							if (oldItem == undefined){
								currentItem.diff = "added";
								currentItemElement.parentNode.replaceChild(cell.appendChild(ui.createItem(currentItem)), currentItemElement);
							} else {
								if (oldItem.p != currentItem.p){
									currentItem.diffModifiedP = "Był " + oldItem.p + "; Jest " + currentItem.p;
									currentItem.diff = "modified";
								}
								if (oldItem.s != currentItem.s){
									currentItem.diffModified2 = "Była " + oldItem.s + "; Jest " + currentItem.s;
									currentItem.diff = "modified";
								}
								if (oldItem.k != currentItem.k){
									currentItem.diffModified1 = "Była " + oldItem.k + "; Jest " + currentItem.k;
									currentItem.diff = "modified";
								}
								currentItemElement.parentNode.replaceChild(cell.appendChild(ui.createItem(currentItem)), currentItemElement);
							}
						} else if (this.selectedType == "room"){
							wasEmpty = true;

							for (unit in this.data.timetable[day][hour]){
								oldItem = this.data.timetable[day][hour][unit].filter(function(v){return v.s == select_rooms.value;});
								if (oldItem[0] == undefined) continue;

								wasEmpty = false;
								oldItem = oldItem[0];
								oldItem.k = unit;

								if (oldItem.k != currentItem.k){
									currentItem.diffModified1 = "Był " + oldItem.k + "; Jest " + currentItem.k;
									currentItem.diff = "modified";
								}
								if (oldItem.p != currentItem.p){
									currentItem.diffModifiedP = "Był " + oldItem.p + "; Jest " + currentItem.p;
									currentItem.diff = "modified";
								}
								if (oldItem.n != currentItem.n){
									currentItem.diffModified2 = "Był " + oldItem.n + "; Jest " + currentItem.n;
									currentItem.diff = "modified";
								}

								currentItemElement.parentNode.replaceChild(cell.appendChild(ui.createItem(currentItem)), currentItemElement);
							}

							if (wasEmpty){
								currentItem.diff = "added";
								currentItemElement.parentNode.replaceChild(cell.appendChild(ui.createItem(currentItem)), currentItemElement);
							}
						} else if (this.selectedType == "unit"){
							//todo: tortury

							classesArr = this.data.timetable[day][hour][select_units.value];
							if (classesArr != undefined){
								originalCLA = classesArr.length;
								foundSimilar = false;
								notFound = [];

								newClassesArr = [];

								//remove duplicates
								for (cls in classesArr){
									duplicate = false;

									oldItem = classesArr[cls];
									for(q = 0; q < il; q++ ){
										i_currentItemElement = items[q];
										i_currentItem = i_currentItemElement.zseilplanitem;
										if ((oldItem.p == i_currentItem.p) && (oldItem.n == i_currentItem.n) && (oldItem.s == i_currentItem.s)){
											duplicate = true;
										}
									}

									if (!duplicate){
										newClassesArr.push(oldItem);
									}
								}
								classesArr = newClassesArr;
								
								//cls - NOT CLASS, it's specific lesson in day x hour matrix
								for (cls in classesArr){
									oldItem = classesArr[cls];
									//console.log(oldItem);
									//console.log(oldItem.p + " <-> " + currentItem.p);
									//console.log(oldItem.n + " <-> " + currentItem.n);
									//console.log(oldItem.s + " <-> " + currentItem.s);
									if ((oldItem.p == currentItem.p) && (oldItem.n == currentItem.n) && (oldItem.s != currentItem.s)){
										currentItem.diffModified2 = "Był " + oldItem.s + "; Jest " + currentItem.s;
										currentItem.diff = "modified";
										foundSimilar = true;
									}else if ((oldItem.s == currentItem.s) && (oldItem.n == currentItem.n) && (oldItem.p != currentItem.p)){
										currentItem.diffModifiedP = "Był " + oldItem.p + "; Jest " + currentItem.p;
										currentItem.diff = "modified";
										foundSimilar = true;
									}else if ((oldItem.s == currentItem.s) && (oldItem.n == currentItem.n) && (oldItem.p == currentItem.p)){
										foundSimilar = true;
									}

									if (currentItem.diff == "modified"){
										currentItemElement.parentNode.replaceChild(cell.appendChild(ui.createItem(currentItem)), currentItemElement);
									}else{
										classesArr[cls].originalCLA = originalCLA;
										notFound.push(classesArr[cls]);
										foundSimilar = false;
									}
								}
								
								if (notFound.length > 0){
									//Fixed - it was reusing `i` variable from parent loop
									for (nf_i = 0; nf_i < notFound.length; nf_i++){
										if (il == 1){
											//tu była tylko jedna lekcja
											currentItem.diffModifiedP = "Był " + oldItem.p + "; Jest " + currentItem.p;
											currentItem.diffModified1 = "Był " + oldItem.n + "; Jest " + currentItem.n;
											currentItem.diffModified2 = "Był " + oldItem.s + "; Jest " + currentItem.s;
											try {
												/* TODO: create pref item to control whether to display this as two separate entries or one */
												currentItem.diff = "added";	
												currentItemElement.parentNode.replaceChild(cell.appendChild(ui.createItem(currentItem)), currentItemElement);
												oldItem.diff = "removed";
												itemsContainer.appendChild(ui.createItem(oldItem));
											} catch (e) {console.error(e);}
										}else{
											for(q = 0; q < il; q++ ){
												i_currentItemElement = items[q];
												i_currentItem = i_currentItemElement.zseilplanitem;
												//TODO: fix me plz xD
												if (i_currentItem.isDiff){
												}else if ((oldItem.p == i_currentItem.p) && (oldItem.n == i_currentItem.n) && (oldItem.s != i_currentItem.s)){
												}else if ((oldItem.s == i_currentItem.s) && (oldItem.n == i_currentItem.n) && (oldItem.p != i_currentItem.p)){
												}else if ((oldItem.s == i_currentItem.s) && (oldItem.n == i_currentItem.n) && (oldItem.p == i_currentItem.p)){
												}else{
													notFound[nf_i].diff = "removed";
													itemsContainer.appendChild(ui.createItem(notFound[nf_i]));
												}
											}

										}
									}
								}
							} else {
								currentItem.diff = "added";
								currentItemElement.parentNode.replaceChild(cell.appendChild(ui.createItem(currentItem)), currentItemElement);
							}
						}
					}
				} catch (e) {}
			}
		}
	}
};