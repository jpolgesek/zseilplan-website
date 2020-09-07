document.getElementById("remote_info").innerHTML = "Idą święta, pora na motyw świąteczny. Nie chcesz go widzieć? Wyłącz go <a href='#' onclick=\"preferences.set('disable_auto_themes', true, true); document.location.reload();\">na zawsze</a> lub <a href='#' onclick=\"preferences.set('disable_auto_themes_once', true, true); document.location.reload();\">tylko raz</a>";
document.getElementsByClassName("tableTopInfo")[0].appendChild(document.getElementById("remote_info"));
document.getElementById("remote_info").style.display = null;

function darkModeOverride(value){
	app.ui.darkMode = value;
	if (value){
		return app.themeManager.activate(0,1);
	}else{
		return app.themeManager.activate(0,0);
	}
}