var diff = {
	/* json object will be loaded here */
	data: undefined,
	index: undefined,

	select_timetable_old: document.getElementById("select_timetable_old"),
	select_timetable_new: document.getElementById("select_timetable_new"),

	diffInfoElement: document.getElementById("diff-info"),

	loadIndex: function(){
		fetch("data/index.json").then(function(resp) {
			return resp.json();
		}).then(function(jsondata) {
			diff.index = jsondata;
			diff.updateIndexUI();
		}).catch(function(error){
			utils.error('diff', 'Nie udało się pobrać pliku z danymi. ' + error);
		});
	},

	updateIndexUI: function(){

		for(i = 0; i < diff.index.timetable_archives.length; i++){
			item = diff.index.timetable_archives[i];
			console.log(item);
			select_timetable_old.options[select_timetable_old.length] = new Option(item.date + " ("+ item.hash +")", item.filename);
			select_timetable_new.options[select_timetable_new.length] = new Option(item.date + " ("+ item.hash +")", item.filename);
		}
	},
	
	/* function to fetch json object */
	/* filename - filename of fetched file */
	loadData: function(filename){
		filename = "data/"+filename;
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
	},

	compareSelected: function(){
		//TODO: Load "new" timetable
		diff.loadData(select_timetable_old.value);
	},

	generateDiff: function(){
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
		columns.setActive(-1); //todo: check if mobile
		refreshView();

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

		this.diffInfoElement.innerHTML += "Stary plan z dnia: " + this.data._updateDate_max + " <br>";
		this.diffInfoElement.innerHTML += "Nowy plan z dnia: " + data._updateDate_max + " (aktualny) <br>";


		for (day=1; day<6; day++){
			for (hour=1; hour<maxHours; hour++){
				itemsContainer = table.rows[hour].cells[day];
				items = itemsContainer.children;
				il = items.length;

				if (il == 0){
					/* Lekcja została usunięta */
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
						//todo: tortury
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
					}
				}
			}
		}
	}
};