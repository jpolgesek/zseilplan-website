var quicksearch = {
	add: function(name, value){
		document.getElementById('suggestions').appendChild(new Option(name, value));
	},
	reset: function(){
		document.getElementById('suggestions').innerHTML = "";
	},
	show: function(){
		app.ui.containerBlur(true);
		document.getElementById("quicksearch").style.display = "flex";
		document.getElementById("search").value = "";
		document.getElementById("search").focus();
		app.ae('quicksearch', 'show', "show");
	},
	hide: function(){
		app.ui.containerBlur(false);
		document.getElementById("quicksearch").style.display = "none";
		document.getElementById("search").value = "";
		// document.getElementById("preferences").style.display = "none";
	},
	eventListener: function(e){
		if (e.ctrlKey && e.keyCode == 32)	quicksearch.show(); //Ctrl+Space
		if (e.keyCode == 27) 				quicksearch.hide(); //Escape
	},
	parse: function(code){
		app.ae('quicksearch', 'code', 'code='+term);
		raw_code = code;
		code = code.toLowerCase().split(":");
		switch(code[0]){
			case "test":
				if (code[1] == "1"){
					alert("Włączam funkcje testowe");
					location.reload();
				}else{
					alert("Wyłączam funkcje testowe");
					location.reload();
				}
				break;
			case "sp":
				if (code.length > 3){
					app.prefs[code[1]] = [];
					for (var i = 2; i < code.length; i++){
						app.prefs[code[1]].push(code[i]);
					}
				}else{
					app.prefs[code[1]] = code[2];
				}
				break;
				
			case "95":
				// themeloader.prepareHTML();
				break;
				
			case "@":
				eval(raw_code.split(":")[1]);
				break;
		}
	},
	search: function(e){
		if (e.keyCode == 13) {
			var raw_term = document.getElementById('search').value;
			term = raw_term.toUpperCase();
			app.ae('quicksearch', 'search', 'search='+term);
			if 		(term[0] == "N") app.jumpTo(0, term.substr(1,2))
			else if (term[0] == "K") app.jumpTo(2, term.substr(1))
			else if (term[0] == "S") app.jumpTo(1, term.substr(1))
			else if (term[0] == "!") quicksearch.parse(raw_term.substr(1))
			quicksearch.hide();
		}
	},
	init: function(){
		document.addEventListener('keyup', this.eventListener, false);
		document.getElementById('search').addEventListener('keyup', this.search, false);
		return true;
	}
}