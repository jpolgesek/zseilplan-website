var quicksearch = {
	add: function(name, value){
		document.getElementById('suggestions').appendChild(new Option(name, value));
	},
	reset: function(){
		document.getElementById('suggestions').innerHTML = "";
	},
	show: function(){
		document.getElementsByClassName("container")[0].className = "container blur";
		document.getElementById("quicksearch").style.display = "flex";
		document.getElementById("search").value = "";
		document.getElementById("search").focus();
		try { gtag('event', 'show', {'event_category': 'quicksearch.show', 'value': '1'}); } catch (e) {}
	},
	hide: function(){
		document.getElementById("quicksearch").style.display = "none";
		document.getElementById("preferences").style.display = "none";
		document.getElementById("search").value = "";
		document.getElementsByClassName("container")[0].className = "container";
	},
	eventListener: function(e){
		if (e.ctrlKey && e.keyCode == 32)	quicksearch.show(); //Ctrl+Space
		if (e.keyCode == 27) 				quicksearch.hide(); //Escape
	},
	parse: function(code){
		try { gtag('event', 'show', {'event_category': 'quicksearch.parsecode', 'value': code}); } catch (e) {}
		code = code.toLowerCase();
		switch(code){
			case "tests:1":
				localStorage.setItem("showTests", true);
				alert("Włączono funkcje testowe");
				break;
			
			case "tests:0":
				localStorage.removeItem("showTests");
				alert("Wyłączono funkcje testowe");
				break;
			
			case "autocfo:1":
				localStorage.setItem("autocfo", true);
				alert("Włączono auto cfo");
				break;
			
			case "autocfo:0":
				localStorage.removeItem("autocfo");
				alert("Wyłączono auto cfo");
				break;
		}
			
		location.reload();
	},
	search: function(e){
		if (e.keyCode == 13) {
			term = document.getElementById('search').value.toUpperCase();
			try { gtag('event', 'show', {'event_category': 'quicksearch.search', 'event_label': term}); } catch (e) {}
			if 		(term[0] == "N") jumpTo(0, term.substr(1,2))
			else if (term[0] == "K") jumpTo(2, term.substr(1))
			else if (term[0] == "S") jumpTo(1, term.substr(1))
			else if (term[0] == "!") quicksearch.parse(term.substr(1))
			quicksearch.hide();
		}
	},
	init: function(){
		document.addEventListener('keyup', this.eventListener, false);
		document.getElementById('search').addEventListener('keyup', this.search, false);
		return true;
	}
}