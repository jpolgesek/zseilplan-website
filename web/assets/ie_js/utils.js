var GLOBAL_DEBUG_ALERT = false;
var GLOBAL_DEBUG_ELEMENT = true;

var utils = {
	fetchJson: function(url, callback, failCallback){
		var compat = false;
		try {
			var a = "Found fetch" + fetch.toString().substr(0,0);
		} catch (error) {
			compat = true;
		}
			
		if (compat){
			if (window.XMLHttpRequest){
				var fetchDataCompatXHR = new XMLHttpRequest();
			}else{
				var fetchDataCompatXHR = new ActiveXObject("Microsoft.XMLHTTP");
			}
			fetchDataCompatXHR.onreadystatechange = function() {
				if (fetchDataCompatXHR.readyState == 4 && fetchDataCompatXHR.status == 200) {
					if (window.JSON){
						jdata = JSON.parse(fetchDataCompatXHR.responseText);
					}else{
						// So sorry for this...
						// Thank you IE...
						// alert("Fallback json parsing")
						jdata = eval("window.jdata = " + fetchDataCompatXHR.responseText + ";");
						try {
							document.getElementById("remote_info").innerHTML = "<b>Gratulacje! Używasz wybitnie starej przeglądarki (tak minimum 10-letniej obstawiam).</b>";
						} catch (e) {}
					}
					callback(jdata);
				} else if (fetchDataCompatXHR.readyState == 4 && fetchDataCompatXHR.status != 200){
					failCallback(fetchDataCompatXHR);
				}
			};
			fetchDataCompatXHR.open("GET", url, true);
			fetchDataCompatXHR.send(null);
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
		if (GLOBAL_DEBUG_ALERT) {return alert("[LOG] " + caller + ": " + text);}
		if (GLOBAL_DEBUG_ELEMENT) {document.getElementById("debuglog").innerHTML += "[LOG] " + caller + ": " + text + "<BR>"; return;}
		caller = caller.rpad(" ",10);
		text = caller + "\t" + text;
		// console.log(text, 'color: #EEE; text-shadow: 1px 1px 1px #333; font-weight: 900;', 'color: #EEE; text-shadow: 1px 1px 1px #333;');
		console.log(text);
	},
	warn: function(caller, text){
		if (GLOBAL_DEBUG_ALERT) {return alert("[WARN] " + caller + ": " + text);}
		if (GLOBAL_DEBUG_ELEMENT) {document.getElementById("debuglog").innerHTML += "[WARN] " + caller + ": " + text + "<BR>"; return;}
		caller = caller.rpad(" ",10);
		text = caller + "\t" + text;
		// console.log(text, 'color: #dca920; text-shadow: 1px 1px 1px #333; font-weight: 900;', 'color: #dca920; text-shadow: 1px 1px 1px #333;');
		console.log(text);
	},
	error: function(caller, text){
		if (GLOBAL_DEBUG_ALERT) {return alert("[ERROR] " + caller + ": " + text);}
		if (GLOBAL_DEBUG_ELEMENT) {document.getElementById("debuglog").innerHTML += "[ERROR] " + caller + ": " + text + "<BR>"; return;}
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
		if (typeof element == "undefined"){
			return false;
		}
		for (var _i = 0; _i < childList.length; _i++){
			if (childList[_i]){
				element.appendChild(childList[_i]);
			}
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

if ( (typeof document.createElement('a').innerText == 'undefined') && (typeof window.getSelection == 'undefined') ) {
    // utils.log("Starszych przeglądarek nie było?");
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

try {
	Element.prototype.appendChildren = function(childList){
		app.utils.appendChildren(this, childList);
	}
} catch (e) {}

app.utils = utils;