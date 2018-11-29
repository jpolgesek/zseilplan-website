var modal = {
	element: undefined,
	create: function(id ,title, desc, closeAction){
		if (document.getElementById(id) != undefined){
			modalContainer = document.getElementById(id);
			modalContainer.innerHTML = "";
		}else{
			modalContainer = document.createElement("div");
			modalContainer.id = id;
		}
		modalContainer.className = "modal center-hv shadow";

		modalTitle = document.createElement("span");
		modalTitle.innerHTML = title;
		modalTitle.className = "title";

		modalClose = document.createElement("span");
		modalClose.innerHTML = '<i class="icon-cancel"></i>';
		modalClose.className = "close";
		modalClose.onclick = function(){closeAction();};

		modalDesc = document.createElement("p");
		modalDesc.innerHTML = desc;
		modalDesc.className = "mdesc";

		modalDescRow = this.createRow();
		modalDescRow.appendChild(modalDesc)

		modalContainer.appendChild(modalClose);
		modalContainer.appendChild(modalTitle);
		modalContainer.appendChild(modalDescRow);

		return modalContainer;

	},
	createRow: function(){
		row = document.createElement("div");
		row.className = "row";
		return row;
	},
	createButton: function(options){
		var workBtn = document.createElement('button');
		workBtn.innerHTML = options.innerHTML;
		workBtn.onclick = options.onClick;
		if (options.primary){
			workBtn.className = "btn-primary";
		}
		
		return workBtn;
	},
	createSectionHeader: function(text){
		var workHeader = document.createElement("h2");
		workHeader.innerHTML = text;
		
		return workHeader;
	}
}