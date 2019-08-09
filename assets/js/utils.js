var utils = {
	fetchJson(url, callback, failCallback){
		var compat = false;
		try {
			var a = "Found fetch" + fetch.toString().substr(0,0);
		} catch (error) {
			compat = true;
		}
			
		if (compat){
			var fetchDataCompatXHR = new XMLHttpRequest();
			fetchDataCompatXHR.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					jdata = JSON.parse(fetchDataCompatXHR.responseText);
					callback(jdata);
				} else if (this.readyState == 4 && this.status != 200){
					failCallback(this);
				}
			};
			fetchDataCompatXHR.open("GET", url, true);
			fetchDataCompatXHR.send();
			return true;
		};
		
		fetch(url).then(function(response) {
			return response.json();
		}).then(function(jdata) {
			callback(jdata);
		})["catch"](function(error){
			failCallback(error);
		});

		return true;
	},
	
	log: function(caller, text){
		caller = caller.rpad(" ",10);
		text = caller + "\t" + text;
		// console.log(text, 'color: #EEE; text-shadow: 1px 1px 1px #333; font-weight: 900;', 'color: #EEE; text-shadow: 1px 1px 1px #333;');
		console.log(text);
	},
	warn: function(caller, text){
		caller = caller.rpad(" ",10);
		text = caller + "\t" + text;
		// console.log(text, 'color: #dca920; text-shadow: 1px 1px 1px #333; font-weight: 900;', 'color: #dca920; text-shadow: 1px 1px 1px #333;');
		console.log(text);
	},
	error: function(caller, text){
		caller = caller.rpad(" ",10);
		text = caller + "\t" + text;
		// console.log(text, 'color: #dd4433; text-shadow: 1px 1px 1px #333; font-weight: 900;', 'color: #dd4433; text-shadow: 1px 1px 1px #333;');
		console.log(text);
	},
	consoleStartup: function(){
		var art = "" + 
		"                                                   " + " \n" +
		"  ███████╗██╗   ██╗██████╗ ███████╗██████╗         " + " \n" +
		"  ██╔════╝██║   ██║██╔══██╗██╔════╝██╔══██╗        " + " \n" +
		"  ███████╗██║   ██║██████╔╝█████╗  ██████╔╝        " + " \n" +
		"  ╚════██║██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗        " + " \n" +
		"  ███████║╚██████╔╝██║     ███████╗██║  ██║        " + " \n" +
		"  ╚══════╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝        " + " \n" +
		"                                                   " + " \n" +
		"   ██████╗██╗     ███████╗██╗   ██╗███████╗██████╗ " + " \n" +
		"  ██╔════╝██║     ██╔════╝██║   ██║██╔════╝██╔══██╗" + " \n" +
		"  ██║     ██║     █████╗  ██║   ██║█████╗  ██████╔╝" + " \n" +
		"  ██║     ██║     ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██╔══██╗" + " \n" +
		"  ╚██████╗███████╗███████╗ ╚████╔╝ ███████╗██║  ██║" + " \n" +
		"   ╚═════╝╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝" + " \n" +
		"                                                   " + " \n" +
		"  ██████╗ ██╗      █████╗ ███╗   ██╗               " + " \n" +
		"  ██╔══██╗██║     ██╔══██╗████╗  ██║               " + " \n" +
		"  ██████╔╝██║     ███████║██╔██╗ ██║               " + " \n" +
		"  ██╔═══╝ ██║     ██╔══██║██║╚██╗██║               " + " \n" +
		"  ██║     ███████╗██║  ██║██║ ╚████║               " + " \n" +
		"  ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝               " + " \n" +
		"                                                    ";
		var s = "%c" + art;
		console.log(s, 'background: #111; color: #AAA;font-family: monospace !important;');
	},
	table: function(content){
		console.table(content);
	},
	androidDemo: function(){
		
		instruction = "<div class='android-close-btn' onclick='location.reload()'><i class='icon-cancel'></i> Wróć do planu</div>";

		instruction += "<div id='android_instruction' class='android-instruction'>";
		
		instruction += "<div class='android-desc'>Jak zainstalować Super Clever Plan na Androidzie</div>";

		instruction += "<div class='android-step-div'>";
		instruction += "<div class='android-step-no'>1</div>";
		instruction += "<div class='android-step-desc'>"; 
		instruction += "<div class='android-step'>Otwórz Super Clever Plan w przeglądarce (najlepiej Chrome)</div>";
		instruction += "<img class='android-img' src='assets/img/android_step_1.png'>";
		instruction += "</div>";
		instruction += "</div>";

		instruction += "<div class='android-step-div'>";
		instruction += "<div class='android-step-no'>2</div>";
		instruction += "<div class='android-step-desc'>"; 
		instruction += "<div class='android-step'>Otwórz menu</div>";
		instruction += "<img class='android-img' src='assets/img/android_step_2.png'>";
		instruction += "</div>";
		instruction += "</div>";

		instruction += "<div class='android-step-div'>";
		instruction += "<div class='android-step-no'>3</div>";
		instruction += "<div class='android-step-desc'>"; 
		instruction += "<div class='android-step'>Wybierz 'dodaj do ekranu głównego'</div>";
		instruction += "<img class='android-img' src='assets/img/android_step_3.png'>";
		instruction += "</div>";
		instruction += "</div>";

		instruction += "<div class='android-step-div'>";
		instruction += "<div class='android-step-no'>4</div>";
		instruction += "<div class='android-step-desc'>"; 
		instruction += "<div class='android-step'>Kliknij 'dodaj'</div>";
		instruction += "<img class='android-img' src='assets/img/android_step_4.png'>";
		instruction += "</div>";
		instruction += "</div>";

		instruction += "</div>";

		document.body.innerHTML = instruction;

		setTimeout(function(){
			dom.addClass(document.getElementById("android_instruction"), "anim");
		}, 1)
	},
	getFreeRooms: function(day, hour){
		this.log("getFreeRooms", "Start: wolne sale");
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
		this.log("getFreeRooms", "Znaleziono " + available_rooms.length + " sal.");
		return available_rooms;
	},

	getFreeRoomsUI: function(day, hour){
		/*
		var available_rooms = this.getFreeRooms(day, hour);
		var htmlInfo = `<i>Szukano dla ${day} dnia tygodnia, ${hour} godziny lekcyjnej</i><br>`;
		htmlInfo += `Znaleziono ${available_rooms.length} wolnych sal.<br>`;
		if (available_rooms.length == 0){
			htmlInfo += `Przykro mi :(`;
		}else{
			htmlInfo += `Kliknij aby podejrzeć zajętość sali <br><br>`;
			for (r in available_rooms){
				var room = available_rooms[r];
				htmlInfo += `<span style="background: rgba(0,0,0,0.3); border: 1px solid #ddd; border-radius: 5px; padding: 4px; margin: 3px; text-align: center; cursor: pointer;" onclick="jumpTo(1, '${room}');">${room} </span>`;
			}
		}
		app.modal.alert(htmlInfo, "blue");
		*/
		return false; //Unavailable for now due to fucking IE
	},

	createEWC: function(elementType, classList = [], innerHTML = ""){
		var element = document.createElement(elementType);
		if (classList.length){
			classList.forEach(className => {
				element.classList.add(className);
			});
		}
		if (innerHTML.length){ element.innerHTML = innerHTML; }
		if (elementType == "button") element.type = "button";
		return element;
	},

    appendChildren: function (element, childList) {
        childList.forEach(c => {
            element.appendChild(c);
        })
        return element;
    }
};


String.prototype.rpad = function(padString, length) {
	var str = this;
    while (str.length < length){
        str = str + padString;
        //str = padString + str;
	}
    return str;
}

if ( (!('innerText' in document.createElement('a'))) && ('getSelection' in window) ) {
	utils.log("Starszych przeglądarek nie było?");
    HTMLElement.prototype.__defineGetter__("innerText", function() {
        var selection = window.getSelection(),
            ranges    = [],
            str;

        // Save existing selections.
        for (var i = 0; i < selection.rangeCount; i++) {
            ranges[i] = selection.getRangeAt(i);
        }

        // Deselect everything.
        selection.removeAllRanges();

        // Select `el` and all child nodes.
        // 'this' is the element .innerText got called on
        selection.selectAllChildren(this);

        // Get the string representation of the selected nodes.
        str = selection.toString();

        // Deselect everything. Again.
        selection.removeAllRanges();

        // Restore all formerly existing selections.
        for (var i = 0; i < ranges.length; i++) {
            selection.addRange(ranges[i]);
        }

        // Oh look, this is what we wanted.
        // String representation of the element, close to as rendered.
        return str;
    });
    
    HTMLElement.prototype.__defineSetter__("innerText", function(str) {
        this.innerHTML = str.replace(/\n/g, "<br />");
    });
}

Element.prototype.appendChildren = function(childList){
	app.utils.appendChildren(this, childList);
}

app.utils = utils;