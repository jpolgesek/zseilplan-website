//TODO: release me on 25.10.2018

var themeloader = {
	importCSS: function(){
		document.head.insertAdjacentHTML( 'beforeend', '<link rel=stylesheet href=assets/themes/windows95.css>' );
	},

	prepareHTML: function(){
		if (localStorage.getItem("disable_116_birthday") == "true"){
			return;
		}

		if (localStorage.getItem("disable_116_birthday_once") == "true"){
			localStorage.removeItem("disable_116_birthday_once");
			return;
		}

		app.themeLoaded = true;
		ui.setDarkMode(false); //sorry :/
		this.importCSS();
		this.prepareWindow(undefined, undefined, "Navbar", document.querySelector("#navbar-container"));
		this.prepareWindow("calendar-5.png", undefined, "Plan lekcji", table);
		this.prepareWindow("msg_information-2.png", "left-bar", "Informacje", document.querySelector("#status"));
		this.prepareWindow("template_empty-3.png", "right-bar", "Wybór planu", document.querySelectorAll(".bar")[0]);
		// this.prepareWindow("template_empty-3.png", undefined, "Porównanie planów", document.querySelector("#diff-help"));

		document.querySelector("#footer-text").innerHTML = "<i>Microsoft® Windows® XP Professional 5.1 Build 2600</i>";
		
		document.querySelector("#remote_info").style.display = null;
		document.querySelector("#remote_info").innerHTML = "<b>Tryb retro sponsorowany przez 18 urodziny Windowsa XP. Świętujmy je razem z salą 116.</b>";
		document.querySelector("#remote_info").innerHTML += "<br>Nie chcesz tego widzieć? <a href='#' onclick='localStorage.setItem(\"disable_116_birthday_once\", true); document.location.reload();'>Wyłącz teraz tryb retro</a> lub <a href='#' onclick='localStorage.setItem(\"disable_116_birthday\", true); document.location.reload();'>wyłącz go na zawsze</a>";
		this.prepareWindow("msg_information-2.png", undefined, "Informacja", document.querySelector("#remote_info"));

		document.querySelectorAll(".navbar")[0].style.backgroundImage = "url(assets/img/icon_square_retro.png)";

		app.element.navbar.buttons.history.querySelectorAll(".icon")[0].style.backgroundImage = "url(assets/themes/95/template_empty-5.png)";
		app.element.navbar.buttons.android.querySelectorAll(".icon")[0].style.backgroundImage = "url(assets/themes/95/monitor_windows.png)";
		app.element.navbar.buttons.settings.querySelectorAll(".icon")[0].style.backgroundImage = "url(assets/themes/95/directory_control_panel_cool-4.png)";
		app.element.navbar.buttons.print.querySelectorAll(".icon")[0].style.backgroundImage = "url(assets/themes/95/printer-5.png)";

		window.scrollTo(0,0);
	},

	prepareWindow: function(icon, classes, title, element){
		ewindow = document.createElement("div");
		ewindow.className = "window";
		dom.addClass(ewindow, classes);
		
		etitlebar = dom.createEWC("div", ["titlebar"]);

		if (icon == undefined) icon = "xml_gear-3.png";
		etitlebar.innerHTML = '<img class="icon2" src="assets/themes/95/' + icon + '"><span class="title">' + title + '</span><button type="button" class="btn btn_x">&nbsp;</button><button type="button" class="btn btn_help" onclick="themeloader.helpClick(this)">&nbsp;</button>';

		econtent = dom.createEWC("div", ["wcontent"]);
		
		ewindow.appendChild(etitlebar);
		ewindow.appendChild(econtent);
		
		element.parentNode.replaceChild(ewindow, element);

		econtent.appendChild(element);
		return ewindow;
	},

	helpClick: function(t){
		//alert("TODO: help click");
		return;
	}
}

modal.create = function(id ,title, desc, closeAction){
	console.log("OVERRIDE!");
	if (document.getElementById(id) != undefined){
		modalContainer = document.getElementById(id);
		modalContainer.innerHTML = "";
	}else{
		modalContainer = document.createElement("div");
		modalContainer.id = id;
	}

	modalContainer.className = "modal center-hv shadow window";
	
	etitlebar = dom.createEWC("div", ["titlebar"]);

	icon = "xml_gear-3.png";
	etitlebar.innerHTML = '<img class="icon2" src="assets/themes/95/' + icon + '"><span class="navtitle">' + title + '</span><button type="button" class="btn btn_x">&nbsp;</button><button type="button" class="btn btn_help" onclick="themeloader.helpClick(this)">&nbsp;</button>';

	//modalClose.onclick = function(){closeAction();};

	modalDesc = dom.createEWC("p", ["mdesc"]);
	modalDesc.innerHTML = desc;

	modalDescRow = this.createRow();
	modalDescRow.appendChild(modalDesc)
	
	modalContainer.appendChild(etitlebar);
	modalContainer.appendChild(modalDescRow);

	return modalContainer;

}

themeloader.prepareHTML();