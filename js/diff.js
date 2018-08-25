var diff = {
	/* json object will be loaded here */
	data: undefined,

	diffInfoElement: document.getElementById("diff-info"),

	
	/* function to fetch json object */
	/* filename - filename of fetched file */
	loadData: function(filename){
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

		ui.jumpButtonsFloatRight = true;
		old_overrides_disabled = overrides_disabled;
		overrides_disabled = true;
		oldActiveColumn = columns.activeColumn;
		columns.setActive(-1);
		refreshView();

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

		//For each day
		for (day=1; day<6; day++){
			//For every hour
			for (hour=1; hour<maxHours; hour++){
				itemsContainer = table.rows[hour].cells[day];
				items = itemsContainer.children;
				il = items.length;
				if (il == 0){
					if (this.selectedType == "teacher"){
						oldItem = this.data.teachers[select_teachers.value][day][hour];
						if (oldItem != undefined){
							console.log("Tu coś było");
							temp = ui.createItem(oldItem);
							dom.addClass(temp, "diff");
							dom.addClass(temp, "removed");
							temp.getElementsByClassName("jumpButtons")[0].children[1].style.background = 'rgba(0,0,0,0.3)';
							temp.getElementsByClassName("jumpButtons")[0].children[0].style.background = 'rgba(0,0,0,0.3)';
							itemsContainer.append(temp);
						}
					}
				}
				console.log("IL: "+il);
				for (i = 0; i < il; i++){
					currentItemElement = items[i];
					currentItem = currentItemElement.zseilplanitem;
					
					currentItemElement.Element0 = currentItemElement.getElementsByClassName("pName")[0];
					currentItemElement.Element1 = currentItemElement.getElementsByClassName("jumpButtons")[0].children[0];
					currentItemElement.Element2 = currentItemElement.getElementsByClassName("jumpButtons")[0].children[1];
					if (this.selectedType == "teacher"){
						oldItem = this.data.teachers[select_teachers.value][day][hour];
						
						if (oldItem == undefined){
							console.log("Tego tu nie było");
							//currentItemElement.style.background = "green";
							dom.addClass(currentItemElement, "diff");
							dom.addClass(currentItemElement, "added");
							// currentItemElement.getElementsByClassName("pName")[0].style.background = 'green';
							currentItemElement.getElementsByClassName("jumpButtons")[0].children[1].style.background = 'rgba(0,0,0,0.3)';
							currentItemElement.getElementsByClassName("jumpButtons")[0].children[0].style.background = 'rgba(0,0,0,0.3)';
						}else{
							oldItem.Element0 = currentItemElement.getElementsByClassName("pName")[0];
							oldItem.Element1 = currentItemElement.getElementsByClassName("jumpButtons")[0].children[0];
							oldItem.Element2 = currentItemElement.getElementsByClassName("jumpButtons")[0].children[1];

							temp = ui.createItem(oldItem);
							isChanged = false;
							// console.log(oldItem);
							if (oldItem.p != currentItem.p){
								// console.log("zmienił się przedmiot z " + oldItem.p + " na " + currentItem.p);
								dom.addClass(oldItem.Element0, "diff");
								dom.addClass(oldItem.Element0, "modified");
								currentItemElement.getElementsByClassName("pName")[0].title = "Był " + oldItem.p + "; Jest " + currentItem.p;
								// temp.getElementsByClassName("pName")[0].style.background = 'red';
								isChanged = true;
							}
							if (oldItem.s != currentItem.s){
								// console.log("zmieniła się sala z " + oldItem.s + " na " + currentItem.s);
								dom.addClass(oldItem.Element2, "diff");
								dom.addClass(oldItem.Element2, "modified");
								currentItemElement.getElementsByClassName("jumpButtons")[0].children[1].title = "Była " + oldItem.s + "; Jest " + currentItem.s;
								isChanged = true;
							}
							if (oldItem.k != currentItem.k){
								// console.log("zmieniła się klasa z " + oldItem.k + " na " + currentItem.k);
								dom.addClass(oldItem.Element1, "diff");
								dom.addClass(oldItem.Element1, "modified");
								currentItemElement.getElementsByClassName("jumpButtons")[0].children[0].title = "Była " + oldItem.k + "; Jest " + currentItem.k;
								isChanged = true;
							}
							/*
							if (isChanged){
								console.log(itemsContainer);
								// temp.style.background = "red";
								itemsContainer.insertBefore(temp, currentItemElement);
							}
							*/
						}
					}
				}
			}
		}
	}
};