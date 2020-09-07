app.themeManager = {
	currentTheme: -1,
	currentVersion: -1,
	darkModeOverrided: false,
	themes: [
		{
			"name": "Klasyczny",
			"darkCompatible": false,
			"css": "",
			"js": "",
			"versions": [
				{"name": "Jasny", "className": ""},
				{"name": "Ciemny", "className": "dark"}
			]
		},
		{
			"name": "Świąteczny",
			"darkCompatible": false,
			"css": "assets/themes/christmas/christmas.css",
			"js": "assets/themes/christmas/christmas.js",
			"versions": [
				{"name": "Czerwony (DEVTEST)", "className": "c_default"},
				{"name": "Ciemny (DEVTEST)", "className": "c_dark"},
				{"name": "Niebieski (DEVTEST)", "className": "c_blue"},
				{"name": "Zielony (DEVTEST)", "className": "c_green"}
			]
		},
		{
			"name": "Retro (buggy)",
			"darkCompatible": false,
			"css": "assets/themes/windows95.css",
			"js": "assets/themes/95/95.js",
			"versions": [
				{"name": "Domyślny (DEVTEST)", "className": "c_default"}
			]
		}
	],

	init: function(){
		utils.log("themeMgr", "Init");
		utils.log("themeMgr", "Themes available: " + this.themes.length);
		// var currentlySelected = 0;
		if (typeof currentlySelected != "undefined"){
			utils.log("themeMgr", "Currently selected theme: " + currentlySelected +" [TODO]");
			this.activate(currentlySelected);
		}
	},

	activate: function(themeIndex, versionIndex){
		if (themeIndex < 0 || themeIndex >= this.themes.length){
			utils.error("themeMgr", "There is no theme with index: " + themeIndex);
			return false;
		}
		this.currentTheme = themeIndex;
		this.currentVersion = versionIndex;

		utils.log("themeMgr", "Activating theme with index: " + themeIndex);

		var selectedTheme = this.themes[themeIndex]; 
		utils.log("themeMgr", "Theme name: " + selectedTheme.name);

		if (!selectedTheme.darkCompatible){
			utils.log("themeMgr", "Theme not compatible with dark mode, disabling it.");
			if (!this.darkModeOverrided){
				app.ui.setDarkMode(false);
				app.ui.setDarkMode = function(x){
					try {
						return darkModeOverride(x);
					} catch (error) {
						utils.warn("themeMgr", "Tried to set dark mode to " + x + ", and override handler was not created. Ignoring.");
					}
					return;
				}
				this.darkModeOverrided = true;
			}
		}

		
		if (document.getElementById('thememanager_css') != undefined){
			utils.log("themeMgr", "Removed old theme CSS");
			document.getElementById('thememanager_css').parentElement.removeChild(document.getElementById('thememanager_css'));
		}

		if (selectedTheme.css != null && selectedTheme.css.length) {
			utils.log("themeMgr", "Loading CSS: " + selectedTheme.css);
			document.head.insertAdjacentHTML( "beforeend", "<link id='thememanager_css' rel='stylesheet' media='screen' href='" + selectedTheme.css + "?rand=" + Date.now() + "'>");
		}

		if (selectedTheme.js != null && selectedTheme.css.length) {
			utils.log("themeMgr", "Loading JS: " + selectedTheme.js);
			if (document.getElementById('thememanager_js') != undefined){
				document.getElementById('thememanager_js').parentElement.removeChild(document.getElementById('thememanager_js'));
			}
			var newScript = document.createElement("script");
			newScript.id = 'thememanager_js';
			newScript.src = selectedTheme.js  + "?rand=" + Date.now();
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
	
	getThemesList: function(){
		var out = [];
		for (var i = 0; i < this.themes.length; i++){
			var currentTheme = this.themes[i];
			for (var j = 0; j < currentTheme.versions.length; j++){
				if (currentTheme.versions[j].name.indexOf("DEVTEST") == -1 || app.testMode){
					out.push({
						name: currentTheme.name + " - " + currentTheme.versions[j].name,
						value: i + ":" + j,
						selected: i == this.currentTheme && j == this.currentVersion
					});
				}
			}
		}
		return out;
	}
};