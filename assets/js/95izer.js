

var themeloader = {
	importCSS: function(){
		document.head.insertAdjacentHTML( 'beforeend', '<link rel=stylesheet href=assets/themes/windows95.css>' );
	},

	prepareHTML: function(){
		ui.setDarkMode(false); //sorry :/
		this.importCSS();
		this.prepareWindow(undefined, undefined, "Navbar", document.querySelector("#navbar-container"));
		this.prepareWindow("calendar-5.png", undefined, "Plan lekcji", table);
		this.prepareWindow("msg_information-2.png", "left-bar", "Informacje", document.querySelector("#status"));
		this.prepareWindow("template_empty-3.png", "right-bar", "Wybór planu", document.querySelectorAll(".bar")[0]);
		// this.prepareWindow("template_empty-3.png", undefined, "Porównanie planów", document.querySelector("#diff-help"));
		
		document.querySelector("#remote_info").style.display = null;
		document.querySelector("#remote_info").innerHTML = "<b>Tryb Windowsa 95 sponsorowany przez salę 116 i nieśmiertelne XP'ki.</b>";
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
		
		etitlebar = document.createElement("div");
		etitlebar.className = "titlebar";

		if (icon == undefined) icon = "xml_gear-3.png";
		etitlebar.innerHTML = '<img class="icon2" src="assets/themes/95/' + icon + '"><span class="title">' + title + '</span><button type="button" class="btn btn_x">&nbsp;</button><button type="button" class="btn btn_help">&nbsp;</button>';

		econtent = document.createElement("div");
		econtent.className = "wcontent";
		
		ewindow.appendChild(etitlebar);
		ewindow.appendChild(econtent);
		
		element.parentNode.replaceChild(ewindow, element);

		econtent.appendChild(element);
		return ewindow;
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
	
	etitlebar = document.createElement("div");
	etitlebar.className = "titlebar";

	icon = "xml_gear-3.png";
	etitlebar.innerHTML = '<img class="icon2" src="assets/themes/95/' + icon + '"><span class="navtitle">' + title + '</span><button type="button" class="btn btn_x">&nbsp;</button><button type="button" class="btn btn_help">&nbsp;</button>';

	//modalClose.onclick = function(){closeAction();};

	modalDesc = document.createElement("p");
	modalDesc.innerHTML = desc;
	modalDesc.className = "mdesc";

	modalDescRow = this.createRow();
	modalDescRow.appendChild(modalDesc)
	
	modalContainer.appendChild(etitlebar);
	modalContainer.appendChild(modalDescRow);

	return modalContainer;

},

themeloader.prepareHTML();