var ui = {
	breakLineInItem: false,
	darkMode: false,
	itemDisplayType: 0,
	isOverride: false,
	jumpButtonsFloatRight: false,

	createZMark: function(n){
		if (document.getElementsByClassName("header")[0].children[n].children.length == 0){
			zMark = document.createElement('span');
			zMark.className = "zMark";
			zMark.innerHTML = "Z";
			zMark.title = "Załadowano zastępstwa na ten dzień";
			document.getElementsByClassName("header")[0].children[n].appendChild(zMark);
		}
	},

	createItem: function(itemData){
		span = [document.createElement('span'), document.createElement('span'), document.createElement('span')];
		
		if (itemData.p.length >= 30){
			itemData.p = itemData.p.split(" ")[0];
		}

		span[0].className = 'pName';
		span[0].innerHTML = itemData.p;
		span[1].className = 'clickable';
		span[2].className = 'clickable';


		if (this.itemDisplayType == 0){
			span[1].innerHTML = itemData.k;
			span[1].onclick = function(){jumpTo(2, itemData.k)};
			span[2].innerHTML = itemData.s;
			span[2].onclick = function(){jumpTo(1, itemData.s)};
		}else if (this.itemDisplayType == 1){
			span[1].innerHTML = itemData.k;
			span[1].onclick = function(){jumpTo(2, itemData.k)};
			span[2].innerHTML = itemData.n;
			try {
				span[2].title = data.teachermap[itemData.n];
			} catch (error) {
				span[2].title = "Brak informacji";
			}
			span[2].onclick = function(){jumpTo(0, itemData.n)};
		}else if (this.itemDisplayType == 2){
			span[1].innerHTML = itemData.n;
			try {
				span[1].title = data.teachermap[itemData.n];
			} catch (error) {
				span[1].title = "Brak informacji";
			}
			span[1].onclick = function(){jumpTo(0, itemData.n)};
			span[2].innerHTML = itemData.s;
			span[2].onclick = function(){jumpTo(1, itemData.s)};
		}
		
		
		jumpButtonsDiv = document.createElement('div');
		if (this.jumpButtonsFloatRight){
			jumpButtonsDiv.className = "jumpButtons float-right";
		}else{
			jumpButtonsDiv.className = "jumpButtons";
		}
		
		element = document.createElement('div');

		if (this.isOverride){
			element.className = 'item override';
		}else{
			element.className = 'item';
		}
		
		if (itemData.diff != undefined){
			if (itemData.diff == "removed"){
				element.className += ' diff removed';
			} else if (itemData.diff == "added"){
				element.className += ' diff added';
			}
		}
		

		if (itemData.diff != undefined){
			if (itemData.diff == "removed"){
				span[1].style.background = 'rgba(0,0,0,0.3)';
				span[2].style.background = 'rgba(0,0,0,0.3)';
			} else if (itemData.diff == "added"){
				span[1].style.background = 'rgba(0,0,0,0.3)';
				span[2].style.background = 'rgba(0,0,0,0.3)';
			} else if (itemData.diff == "modified"){
				if (itemData.diffModifiedP != undefined){
					span[0].className += " diff modified";
					span[0].title = itemData.diffModifiedP;
				}
				if (itemData.diffModified1 != undefined){
					span[1].className += " diff modified";
					span[1].title = itemData.diffModified1;
				}
				if (itemData.diffModified2 != undefined){
					span[2].className += " diff modified";
					span[2].title = itemData.diffModified2;
				}
			}
		}

		element.appendChild(span[0]);
		element.appendChild(this.itemLineBreak());
		
		if (itemData.n == "Uczniowie przychodzą p&#243;źniej"){
			span[0].innerHTML = "Uczniowie przychodzą później";
			if(itemData.g != undefined){
				span[0].innerHTML += " ([info2]Grupa "+itemData.g+")";
			}
		}else if(itemData.n == "-1"){
			span[0].innerHTML = "Uczniowie zwolnieni";
			if(itemData.g != undefined){
				span[0].innerHTML += " (Grupa "+itemData.g+")";
			}

		}else{
			if(itemData.g != undefined){
				span[0].innerHTML += " (Grupa "+itemData.g+")";
			}
			jumpButtonsDiv.appendChild(span[1]);
			jumpButtonsDiv.appendChild(span[2]);
			element.appendChild(jumpButtonsDiv);	
		}

		element.zseilplanitem = {
			"p": itemData.p,
			"n": itemData.n,
			"s": itemData.s,
			"g": itemData.g,
			"k": itemData.k
		}
		
		return element;
	},

	createToast: function(text){
		document.getElementById("toast_desc").innerText = text;
		var x = document.getElementById("toast")
		x.className = "show";
		setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
	},

	setDarkMode: function(state){
		this.darkMode = state;
		this.updateMode();
		try { ga('send', 'event', 'ui', 'setdarkmode='+state); } catch (e) {}
	},

	setLineBreak: function(state){
		this.breakLineInItem = state;
		refreshView();
		try { ga('send', 'event', 'ui', 'setlinebreak='+state); } catch (e) {}
	},

	setJumpButtonsFloatRight: function(state){
		this.jumpButtonsFloatRight = state;
		refreshView();
		try { ga('send', 'event', 'ui', 'setjumpbuttonsfloatright='+state); } catch (e) {}
	},

	updateMode: function(){
		if (this.darkMode){
			document.body.className = "dark";
		}else{
			document.body.className = "";
		}
	},	

	itemLineBreak: function(){
		lineBreak = document.createElement('div');
		if (this.breakLineInItem){
			lineBreak.className = 'item_linebreak';
		}else{
			lineBreak.className = 'item_linebreak_disabled';
		}
		lineBreak.innerHTML = "&nbsp;";
		return lineBreak;
	},

	print: function(){
		old_overrides_disabled = overrides_disabled;
		overrides_disabled = true;
		oldActiveColumn = columns.activeColumn;
		columns.setActive(-1);
		refreshView();
		
		o_copy = document.getElementsByClassName("copyright")[0].innerHTML;
		o_status = document.getElementById("status").innerHTML;

		/*document.getElementsByClassName("copyright")[0].innerHTML = "<i>(dev.polgesek.pl/zseilplan)</i><br>"+o_copy+"<br>";*/
		// document.getElementsByClassName("copyright")[0].innerHTML = " <span class='copyright_small'>"+document.getElementsByClassName("copyright")[0].innerHTML+"</span>";
		document.getElementsByClassName("copyright")[0].innerHTML = "Plan lekcji dla&nbsp;<b>";
		if (this.itemDisplayType == 0){
			document.getElementsByClassName("copyright")[0].innerHTML += "nauczyciela ";
			try {
				document.getElementsByClassName("copyright")[0].innerHTML += data.teachermap[select_teachers.value.toLowerCase()][0];
			} catch (error) {
				document.getElementsByClassName("copyright")[0].innerHTML += select_teachers.value;
			}
		}else if (this.itemDisplayType == 1){
			document.getElementsByClassName("copyright")[0].innerHTML += "<b>sali " + select_rooms.value + "</b>";
		}else if (this.itemDisplayType == 2){
			document.getElementsByClassName("copyright")[0].innerHTML += "<b> klasy " + select_units.value + "</b>";
		}
		document.getElementsByClassName("copyright")[0].innerHTML += " z dnia <b>"+data._updateDate_min+"</b>";

		dom.addClass(document.getElementsByClassName("navbar-buttons")[0],"hidden");

		print();
		
		dom.removeClass(document.getElementsByClassName("navbar-buttons")[0],"hidden");
		document.getElementsByClassName("copyright")[0].innerHTML = o_copy;
		document.getElementById("status").innerHTML = o_status;
		overrides_disabled = old_overrides_disabled;
		
		if (oldActiveColumn != 9000) columns.setActive(oldActiveColumn);

		try { gtag('event', 'ui.print', {'event_category': 'ui.print', 'event_label': 'Printed'}); } catch (e) {}
	},

	resetSelects: function(without){
		if (detectIE() && document.super_fucking_old_ie) return;
		toClear = ["units", "rooms", "teachers"];
		toClear.splice(toClear.indexOf(without),1);
		for (x in toClear){
			document.getElementById(toClear[x]).value = "default";
		}
	},

	showPreferences: function(display){
		myStorage.generatePreferencesUI();
		if (display){
			document.getElementById("preferences").style.display = "block";
			document.getElementsByClassName("container")[0].className = "container blur";
		}else{
			document.getElementById("preferences").style.display = "none";
			document.getElementsByClassName("container")[0].className = "container";
		}
	}
}

/*

itemDisplayType:
	0 - nauczyciel (klasa + sala),
	1 - sala (klasa + nauczyciel),
	2 - klasa (nauczyciel + sala)

*/