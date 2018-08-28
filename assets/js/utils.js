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
        str = str + padString;
	}
    return str;
}