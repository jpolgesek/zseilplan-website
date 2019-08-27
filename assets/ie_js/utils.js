var utils = {
	fetchJson: function(url, callback, failCallback){
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
		return false;
	},

	getFreeRoomsUI: function(day, hour){
		return false;
	},

	createEWC: function(elementType, classList, innerHTML){
		var element = document.createElement(elementType);
		if (classList && classList.length){
			for (var _i = 0; _i < classList.length; _i++){
				dom.addClass(element, classList[_i]);
			}
		}
		if (innerHTML && innerHTML.length){ element.innerHTML = innerHTML; }
		if (elementType == "button") element.type = "button";
		return element;
	},

    appendChildren: function (element, childList) {
		for (var _i = 0; _i < childList.length; _i++){
			element.appendChild(childList[_i]);
		};
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