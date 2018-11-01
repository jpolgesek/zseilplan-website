/* TODO: fix this */

var overrides = {
	enabled: true,
	IEgetDay: function(){
		//How to rewrite this?
		//Also: how it is supposed to work

	},
	getDay: function(){
		//How to rewrite this?
		//Also: how it is supposed to work
	},
	
	loadOverrides: function(){
		if (!this.enabled){
			utils.log("overrides", "Overrides are disabled");
			return false;
		}

		utils.log("overrides", "Start loading overrides");
			
		for (hour=1; hour<maxHours; hour++) {
			for (day=1; day<(weekDays + 1); day++) {
				
				/* Decide to show overrides for this or next week */
				var day_of_the_week = new Date().getDay();
				if( day_of_the_week == 6 || day_of_the_week == 0) {
					//TODO: show info that these overrides are for the next week
					//TODO: allow for manual selection of this
					var date = IEgetDay(day+7);
				} else {
					var date = IEgetDay(day);
				}

				//There are no overrides for this day, skip this loop
				if (overrideData[date] == undefined) continue; 

				//TODO: This should never happen. Send alert if it does!
				if (overrideData[date][day] == undefined) continue; 
				
				//Show (Z) mark to indicate that overrides for this day are loaded correctly
				ui.createZMark(day);

				override = overrideData[date][day][hour];

				//There are no overrides for this hour, skip this loop
				if (override == undefined) continue; 

				//TODO: use cell.zseilplanitem
				cell = table.rows[hour].cells[day];

				/* A bit ugly, but allows reuse of app.currentView */
				if (app.currentView.selectedType == "unit") {
					unitParse(app.currentView.selectedValue, override, cell);
				} else if (app.currentView.selectedType == "teacher") {
					teacherParse(app.currentView.selectedValue, override, cell);
				} else if (app.currentView.selectedType == "room") {
					roomParse(app.currentView.selectedValue, override, cell);
				}

			}
		}

		console.log("TODO!");
		return false;
	},

	summaryModal: function(sort_by){
		var overrideSummary = [];
		//TODO: day as param
		var day = "25.10.2018";
		//TODO: auto day_of_the_week
		var day_of_the_week = 4;

		//TODO: allow selection: teacher / unit
		//var sort_by = "unit";

		for (var hour = 1; hour < 10; hour++){
			var x = data.overrideData[day][day_of_the_week][hour];
			for (unit in x){
				var y = x[unit];
				for (o in y){
					override = y[o];
					override.x = hour;
					override.y = day_of_the_week;
					override.unit = unit;

					if (sort_by == "teacher"){
						if (typeof overrideSummary[override.oldTeacherShort] == "undefined"){
							overrideSummary[override.oldTeacherShort] = [];
						}
						overrideSummary[override.oldTeacherShort].push(override);
					}else if (sort_by == "unit"){
						if (typeof overrideSummary[override.unit] == "undefined"){
							overrideSummary[override.unit] = [];
						}
						overrideSummary[override.unit].push(override);
					}else{
						console.error("Nieznane sortowanie by " + sort_by);
						return;
					}
				}
			}
		}

		overridesModal = modal.create('overridesmodal', "Podsumowanie zastępstw", "", function(){overridesModal.parentElement.removeChild(overridesModal);ui.containerBlur(false)});
		row = modal.createRow();
		row.style.margin.bottom = "-10px";
		row.style.fontSize = "1.5em";

		outHTML = "";
		
		for (t in overrideSummary){
			if (sort_by == "teacher"){
				outHTML += "<h2>" + data.teachermap[t] +" ("+t+")</h2>";
			}else if (sort_by == "unit"){
				outHTML += "<h2> Klasa " + t +"</h2>";
			}
			outHTML += "<table><tbody>";
			outHTML += "<tr>";
			outHTML += "<th>Godzina</th>";
			if (sort_by != "unit") outHTML += "<th>Klasa</th>";
			outHTML += "<th>Sala</th>";
			outHTML += "<th>Przedmiot</th>";
			if (sort_by != "teacher") outHTML += "<th>Za</th>";
			outHTML += "<th>Jest</th>";
			outHTML += "</tr>";
			for (i in  overrideSummary[t]){
				outHTML += "<tr>";
				outHTML += "<td>" + overrideSummary[t][i].x + "</td>";
				if (sort_by != "unit") outHTML += "<td>" + overrideSummary[t][i].unit + "</td>";
				outHTML += "<td>" + overrideSummary[t][i].s + "</td>";

				if (overrideSummary[t][i].subject.length > 32){
					overrideSummary[t][i].subjectShort = overrideSummary[t][i].subject.substring(0, 32) + "...";
				}else{
					overrideSummary[t][i].subjectShort = overrideSummary[t][i].subject;
				}

				outHTML += "<td>" + overrideSummary[t][i].subjectShort + "</td>";
				if (sort_by != "teacher"){
					outHTML += "<td>" + overrideSummary[t][i].oldTeacherLong + "</td>";
				}

				if (overrideSummary[t][i].newTeacherLong != "-1"){
					outHTML += "<td>" + overrideSummary[t][i].newTeacherLong + "</td>";
				}else{
					outHTML += "<td>Okienko</td>";
				}

				outHTML += "</tr>";
			}
			outHTML += "</tbody></table>";
		}
		outHTML2 = document.createElement("div");
		outHTML2.innerHTML = outHTML;
		outHTML2.style.overflow = "scroll";
		outHTML2.style.height = "100%";
		
		overridesModal.appendChild(outHTML2);

		ui.containerBlur(true);
		document.body.appendChild(overridesModal);
		setTimeout(function(){dom.addClass(overridesModal, "modal-anim");},1);

		return overrideSummary;
	}
};

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
	if (overrides_disabled){
		utils.log("override", "Overrides are disabled");
		return;
	}
	utils.log("override", "Start checkForOverrides()");
	
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
	try{
		for (o=0; o<override.length; o++){
			for (i=0; i<cell.children.length; i++){
				a = cell.children[i].children;

				//Fix for situations where previous entry in this cell was already overrided, 
				//and result of override didn't include teacher and room (-1)
				if (a.length < 3) {
					continue;
				}

				teacher = a[2].children[0].innerText;
				gg = -1;
				if (a[0].innerText.split("-").length > 1){
					gg = a[0].innerText.split("-")[1];
				}
				//console.log("teacher="+teacher);
				if (teacher == override[o].oldTeacherShort){
					utils.log("override", "Found override for unit="+unit+", teacher="+teacher);
					
					temp_data = {};
					try {
						temp_data.n = override[o].newTeacherShort;
					} catch (error) {
						temp_data.n = override[o].newTeacher;
					}
					temp_data.k = value;
					temp_data.p = override[o].subject;
					if (gg != -1){
						// temp_data.p += "-" + gg; //TODO: is this needed
						temp_data.g = gg;
					}
					temp_data.s = override[o].s;
	
					ui.isOverride = true;
					cell.replaceChild(ui.createItem(temp_data), cell.children[i]);
					ui.isOverride = false;
	
				}
			}
	
		}
	}catch (e){
		if (app.testMode) {
			console.error("UNITPARSE ERROR!!!");
			console.error(e);
			console.error("UNITPARSE ERROR!!!");
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
	//console.log("rp");
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