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
		close_btn = app.utils.createEWC("div", ["android-close-btn"], `<i class='icon-times'></i> Wróć do planu`);
		steps_src = [
			{
				no: 1,
				desc: "Otwórz Super Clever Plan w przeglądarce (najlepiej Chrome)",
				img_src: "android_step_1.png"
			},
			{
				no: 2,
				desc: "Otwórz menu",
				img_src: "android_step_2.png"
			},
			{
				no: 3,
				desc: "Wybierz 'dodaj do ekranu głównego'",
				img_src: "android_step_3.png"
			},
			{
				no: 4,
				desc: "Kliknij 'dodaj'",
				img_src: "android_step_4.png"
			},
		]

		instructions = app.utils.createEWC("div", ["android-instruction", "anim"]);
		instructions.appendChild(app.utils.createEWC("div", ["android-desc"], "Jak zainstalować Super Clever Plan na Androidzie"));


		steps_src.forEach(step => {
			step_container = app.utils.createEWC("div", ["android-step-div"]);
			step_no = app.utils.createEWC("div", ["android-step-no"]);
			step_desc_container = app.utils.createEWC("div", ["android-step-desc"]);
			step_desc = app.utils.createEWC("div", ["android-step"]);
			step_img = app.utils.createEWC("img", ["android-img"]);

			step_no.innerHTML = step.no;
			step_desc.innerHTML = step.desc;
			step_img.src = `assets/img/${step.img_src}`;

			step_desc_container.appendChildren([
				step_desc,
				step_img
			]);

			step_container.appendChildren([
				step_no,
				step_desc_container,
			]);

			instructions.appendChild(step_container);
		})


		android_instructions_div = app.utils.createEWC("div", ["html-fullscreen"]);
		android_instructions_div.appendChild(close_btn);
		android_instructions_div.appendChild(instructions);
		document.body.appendChild(android_instructions_div);
		
		close_btn.onclick = function() {
			android_instructions_div.parentElement.removeChild(android_instructions_div);
		}

		setTimeout(function(){
			dom.addClass(document.getElementById("android_instruction"), "anim");
		}, 1)
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
				htmlInfo += `<span style="background: rgba(0,0,0,0.3); border: 1px solid #ddd; border-radius: 5px; padding: 4px; margin: 3px; text-align: center; cursor: pointer;" onclick="app.jumpTo(1, '${room}');">${room} </span>`;
			}
		}
		app.ui.modal.alert(htmlInfo, "blue");
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