var utils = {
	log: function(caller, text){
		caller = "[" + caller + "]";
		caller = caller.rpad(" ",10);
		console.log(caller + "\t" + text);
	},
	warn: function(caller, text){
		caller = "[" + caller + "]";
		caller = caller.rpad(" ",10);
		console.warn(caller + "\t" + text);
	},
	error: function(caller, text){
		caller = "[" + caller + "]";
		caller = caller.rpad(" ",10);
		console.error(caller + "\t" + text);
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
	}
};


String.prototype.rpad = function(padString, length) {
	var str = this;
    while (str.length < length){
        // str = str + padString;
        str = padString + str;
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