app.tools = {
	selectToolModal: function(){
		toolselectDiv = app.ui.modal.createTabbed({title: "Narzędzia", tabbed: false});

		row = app.ui.modal.createRow();

		tools_desc = `Tutaj znajdzie się jakiś ładny opis wyjaśniający czym są te narzędzia.`
		
		desc = app.utils.createEWC("p", ["desc"], tools_desc);
		btn1 = app.utils.createEWC("button", ["content_btn"], "Wyszukaj wolne sale");
		btn2 = app.utils.createEWC("button", ["content_btn"], "Wyświetl poprzednią wersję planu");
		btn3 = app.utils.createEWC("button", ["content_btn"], "Zmiany w planie");

		toolselectDiv.sectionContent.appendChildren([
			app.ui.modal.createRow(desc),
			app.ui.modal.createRow(btn1),
			app.ui.modal.createRow(btn2),
			app.ui.modal.createRow(btn3)
		]);

		//FIXME: layout
		toolselectDiv.sectionContent.style.padding = "10px";

		row = app.ui.modal.createRow();

		toolselectDiv.appendChild(row);
		
		document.body.appendChild(toolselectDiv);
		app.ui.containerBlur(1);
	}
}