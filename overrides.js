/* TODO: fix this */

function getDay(n) {
	date = new Date();
    var day = date.getDay() || 7;  
    if( day !== n ) 
        date.setHours(-24 * (day - n)); 
	return date.toLocaleString(); 
}

function IEgetDay(n) {
	date = new Date();
    var day = date.getDay() || 7;  
    if( day !== n ) 
        date.setHours(-24 * (day - n)); 
	out = "";
	if (date.getDate() < 10) out += "0";
	out += String(date.getDate());
	out += "."
	if (date.getMonth()+1 < 10) out += "0";
	out += String(date.getMonth()+1);
	out += "."
	out += String(date.getFullYear());
	return out;
}


function toggleOverrides(value){
	overrides_disabled = value;
	refreshView();
}

function checkForOverrides(){
	console.log("Overrides start");

	if (overrides_disabled == true){
		console.log("Overrides are disabled. Exiting.");
		return;
	}
	
	type = null;
	value = null

	if (select_units.value != "default"){
		type = "unit";
		value = select_units.value;
	}else if (select_teachers.value != "default"){
		type = "teacher";
		value = select_teachers.value;
	}else if (select_rooms.value != "default"){
		type = "room";
		value = select_rooms.value;
	}else{
		return false;
	}
	
	for (y=1; y<11; y++){ //11 godzin
		for (x=1; x<6; x++){ //5 dni
			tempdate2 = new Date();
			if(tempdate2.getDay() == 6 || tempdate2.getDay() == 0){
				ind = IEgetDay(x+7);
			}else{
				ind = IEgetDay(x);
			}

			if (overrideData[ind] == undefined) continue; //There are no overrides for this day, skip this loop
			if (overrideData[ind][x] == undefined) continue; //There are no overrides for this day, skip this loop
			
			ui.createZMark(x);

			override = overrideData[ind][x][y];
			if (override == undefined) continue; //There are no overrides for this hour, skip this loop

			cell = table.rows[y].cells[x];
			if (type == "unit"){
				unitParse(value, override, cell);
			}else if (type == "teacher"){
				teacherParse(value, override, cell);
			}else if (type == "room"){
				roomParse(value, override, cell);
			}
		}
	}
}


function unitParse(unit, override, cell){
	override = override[value];
	if (override == undefined) return;

	for (o=0; o<override.length; o++){

		for (i=0; i<cell.children.length; i++){
			a = cell.children[i].children;
			teacher = a[2].children[0].innerText;
			gg = -1;
			if (a[0].innerText.split("-").length > 1){
				gg = a[0].innerText.split("-")[1];
			}
			console.log("teacher="+teacher);
			if (teacher == override[o].oldTeacherShort){
				console.log("Trafiony");

				temp_data = Object();
				try {
					temp_data.n = override[o].newTeacherShort;
				} catch (error) {
					temp_data.n = override[o].newTeacher;
				}
				temp_data.k = value;
				temp_data.p = override[o].subject;
				if (gg != -1){
					temp_data.p += "-" + gg;
					temp_data.g = gg;
				}
				temp_data.s = override[o].s;

				ui.isOverride = true;
				cell.replaceChild(ui.createItem(temp_data), cell.children[i]);
				ui.isOverride = false;

			}
		}

	}
}


function teacherParse(teacher, override, cell){
	for (unit in override){
		for (o in override[unit]){
			if (override[unit][o].newTeacherShort == teacher){
				console.log("Mam zastepstwo dla nauczyciela "+teacher+" - ma lekcje z klasa "+unit+" na godzinie "+y+" w dniu "+x);
				temp_data = Object();
				temp_data.k = unit;
				temp_data.p = override[unit][o].subject;
				if (override[unit][o].guessedGroup != undefined){
					temp_data.p += " (Grupa "+override[unit][o].guessedGroup+")";
				}
				temp_data.s = override[unit][o].s;
				temp_data.n = teacher;
				ui.isOverride = true;
				cell.appendChild(ui.createItem(temp_data));
				ui.isOverride = false;
			}
			if (override[unit][o].oldTeacherShort == teacher){
				console.log("Nauczyciel "+teacher+" nie ma lekcji na godzinie "+y+" w dniu "+x+" z klasą "+unit+"  ");
				temp_data = Object();
				temp_data.k = "";
				temp_data.p = "Okienko";
				temp_data.s = "";
				temp_data.n = "";
				ui.isOverride = true;
				cell.innerHTML = "";
				cell.appendChild(ui.createItem(temp_data));
				ui.isOverride = false;
			}
		}
	}
}


function roomParse(room, override, cell){
	console.log("rp");
	for (unit in override){
		for (o in override[unit]){
			// console.log(override[unit][o]);
			if (override[unit][o].s == room && override[unit][o].newTeacherShort != -1){
				console.log("Mam zastepstwo w sali "+room+" - "+override[unit][o].newTeacherShort+" ma lekcje z klasa "+unit+" na godzinie "+y+" w dniu "+x);
				temp_data = Object();
				temp_data.k = unit;
				temp_data.p = override[unit][o].subject;
				if (override[unit][o].guessedGroup != undefined){
					temp_data.p += " (Grupa "+override[unit][o].guessedGroup+")";
				}
				temp_data.s = override[unit][o].s;
				temp_data.n = override[unit][o].newTeacherShort;
				ui.isOverride = true;
				try{	
					if (override[unit][o].oldTeacherShort == cell.children[0].children[3].innerText){
						cell.innerHTML = "";
					}
				}catch(e){}		
				cell.appendChild(ui.createItem(temp_data));
				ui.isOverride = false;
			}else if (override[unit][o].s == room && override[unit][o].newTeacherShort == -1){
				console.log("Mam zastepstwo w sali "+room+" - ktos nie ma lekcji z klasa "+unit+" na godzinie "+y+" w dniu "+x);
				temp_data = Object();
				temp_data.k = "";
				temp_data.p = "";
				temp_data.s = "";
				temp_data.n = "";
				ui.isOverride = true;
				cell.innerHTML = "";
				cell.appendChild(ui.createItem(temp_data));
				ui.isOverride = false;
			}else{
				for (i = 0; i<cell.children.length; i++){
					if (override[unit][o].oldTeacherShort == cell.children[i].children[2].children[1].innerText){
						console.log("[NOWE!!!] Mam zastepstwo w sali "+room+" - ktos nie ma lekcji z klasa "+unit+" na godzinie "+y+" w dniu "+x);
						temp_data = Object();
						temp_data.k = "";
						temp_data.p = "";
						temp_data.s = "";
						temp_data.n = "";
						ui.isOverride = true;
						cell.innerHTML = "";
						cell.appendChild(ui.createItem(temp_data));
						ui.isOverride = false;
					}
				}
			}
		}
	}
}