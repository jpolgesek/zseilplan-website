app.themeManager = {
	themes: [
		{
			"name": "Świąteczny",
			"darkCompatible": false,
			"css": "assets/themes/christmas/christmas.css",
			"js": null,
			"versions": [
				{"name": "Czerwony (domyślny)", "className": "c_default"},
				{"name": "Ciemny", "className": "c_dark"},
				{"name": "Niebieski", "className": "c_blue"},
				{"name": "Zielony", "className": "c_green"}
			]
		},
		{
			"name": "Retro (buggy)",
			"darkCompatible": false,
			"css": null,
			"js": "assets/js/95izer.js",
			"versions": [
				{"name": "Domyślny", "className": "c_default"}
			]
		}
	],

	init: function(){
		utils.log("themeMgr", "Init");
		utils.log("themeMgr", "Themes available: " + this.themes.length);
		var currentlySelected = 0;
		utils.log("themeMgr", "Currently selected theme: " + currentlySelected +" [TODO]");
		if (typeof currentlySelected != "undefined"){
			this.activate(currentlySelected);
		}
	},

	activate: function(themeIndex, versionIndex){
		if (themeIndex < 0 || themeIndex >= this.themes.length){
			utils.error("themeMgr", "There is no theme with index: " + themeIndex);
			return false;
		}

		utils.log("themeMgr", "Activating theme with index: " + themeIndex);

		var selectedTheme = this.themes[themeIndex]; 
		utils.log("themeMgr", "Theme name: " + selectedTheme.name);

		if (!selectedTheme.darkCompatible){
			utils.log("themeMgr", "Theme not compatible with dark mode, disabling it.");
			app.ui.setDarkMode(false);
			app.ui.setDarkMode = function(x){
				utils.warn("themeMgr", "Tried to set dark mode to " + x + ", ignoring.");
				return;
			}
		}

		if (selectedTheme.css != null) {
			utils.log("themeMgr", "Loading CSS: " + selectedTheme.css);
			if (document.getElementById('thememanager_css') != undefined){
				document.getElementById('thememanager_css').parentElement.removeChild(document.getElementById('thememanager_css'));
			}
			document.head.insertAdjacentHTML( "beforeend", "<link id='thememanager_css' rel='stylesheet' href='" + selectedTheme.css + "'>");
		}

		if (selectedTheme.js != null) {
			utils.log("themeMgr", "Loading JS: " + selectedTheme.js);
			if (document.getElementById('thememanager_js') != undefined){
				document.getElementById('thememanager_js').parentElement.removeChild(document.getElementById('thememanager_js'));
			}
			var newScript = document.createElement("script");
			newScript.id = 'thememanager_js';
			newScript.src = selectedTheme.js;
			newScript.onload = function (){
				try{themeloader.prepareHTML();}catch(e){utils.error("themeMgr", "Failed executing js: " + e);}
			}
			document.head.appendChild(newScript);
		}
		

		document.body.className = "";
		if (typeof versionIndex != "undefined" && versionIndex >= 0 && versionIndex < selectedTheme.versions.length){
			utils.log("themeMgr", "Activating class: " + selectedTheme.versions[versionIndex].name);
			dom.addClass(document.body, selectedTheme.versions[versionIndex].className);
		}

		return true;
	},

	deactivate: function(themeIndex){
		utils.log("themeMgr", "Deactivating theme");
		return true;
	},

	createModal: function(){
		themeManagerModal = modal.create('thememanagermodal', "Wybierz motyw", "Wybierz motyw", function(){themeManagerModal.parentElement.removeChild(themeManagerModal);ui.containerBlur(false)});

		row = modal.createRow();
		row.style.margin.bottom = "-10px";
		row.style.fontSize = "1.5em";
		section_title = document.createElement('span');
		section_title.innerHTML = "Wybierz motyw";
		row.appendChild(section_title);
		themeManagerModal.appendChild(row);

		row = modal.createRow();

		input = document.createElement('select');
		input.type = "";
		input.checked = true;
		for (var i = 0; i < this.themes.length; i++){
			var currentTheme = this.themes[i];
			console.log(currentTheme.name);
			console.log(currentTheme.versions);
			for (var j = 0; j < currentTheme.versions.length; j++){
				input.options[input.options.length] = new Option(currentTheme.name + " - " + currentTheme.versions[j].name, i + ":" + j);
			}
		}
		
		input.onchange = function(){
			var themeIndex = input.value.split(":")[0];
			var versionIndex = input.value.split(":")[1];
			app.themeManager.activate(themeIndex, versionIndex);
		};
		
		
		title = document.createElement("span");
		title.className = "desc";
		title.innerHTML = "Wybierz motyw";

		row.appendChild(input);
		row.appendChild(title);
		themeManagerModal.appendChild(row);
		
		row = modal.createRow();

		prefsBtnSave = document.createElement('button');
		prefsBtnSave.innerHTML = "Zastosuj";
		prefsBtnSave.onclick = function(){
			var themeIndex = input.value.split(":")[0];
			var versionIndex = input.value.split(":")[1];
			app.themeManager.activate(themeIndex, versionIndex);
			console.log("TODO: thememanager modal save");
			themeManagerModal.parentElement.removeChild(themeManagerModal);
			ui.containerBlur(false);
		};
		prefsBtnSave.className = "btn-primary";
		// prefsBtnSave.title = "Wyświetl wybrany plan";
		row.appendChild(prefsBtnSave);

		prefsBtnCancel = document.createElement('button');
		prefsBtnCancel.innerHTML = "Zamknij";
		prefsBtnCancel.onclick = function(){themeManagerModal.parentElement.removeChild(themeManagerModal);ui.containerBlur(false)};
		row.appendChild(prefsBtnCancel);
		themeManagerModal.appendChild(row);

		ui.containerBlur(true);
		document.body.appendChild(themeManagerModal);
		setTimeout(function(){
			dom.addClass(themeManagerModal, "modal-anim");
		}, 1)
		return true;
	}
};