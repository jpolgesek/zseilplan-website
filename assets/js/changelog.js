app.changelog = {
	modal: function(){
		changelogHTML = "";
		changelogHTML += "<b>Tak naprawdę to od czasu ostatniego wpisu tutaj było sporo zmian, ale wolę klepać kod niż changelog :P</b><br><br>";
		changelogHTML += "<b>02.09.2018 - Super Clever Plan 2.0</b>";
		changelogHTML += "<ul>";
		changelogHTML += "<li>Zupełnie nowy parser planu</li>";
		// changelogHTML += "<li>Możliwość wyświetlania planu z przeszłości</li>";
		// changelogHTML += "<li>Możliwość wyświetlania zmian w planie</li>";
		changelogHTML += "<li>Przełączanie między dniami na mobile za pomocą gestów</li>";
		changelogHTML += "<li>Poprawiony silnik wydruków</li>";
		changelogHTML += "<li>Możliwość pracy w trybie offline</li>";
		changelogHTML += "<li>Dodana instrukcja instalacji na androidzie</li>";
		changelogHTML += "<li>Kompatybilność ze starszymi przeglądarkami (Aż do IE 9)</li>";
		changelogHTML += "<li>Zmieniony interfejs</li>";
		changelogHTML += "</ul>";
		changelogDiv = modal.create('changelog', "Changelog", changelogHTML, function(){changelogDiv.parentElement.removeChild(changelogDiv);ui.containerBlur(false)});
		changelogDiv.className += "deprecated";
		
		ui.containerBlur(true);
		document.body.appendChild(changelogDiv);
		setTimeout(function(){dom.addClass(changelogDiv, "modal-anim");},1);
	}
}