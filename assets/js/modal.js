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
	createTabbed: function(options){
		modalContainer = document.createElement("div");
		// modalContainer.id = id;
		modalContainer.className = "tabbedModal center-hv shadow";

		var modalMenu = dom.createEWC("div", ["menuCheck"]);
		modalMenu.innerHTML = "☰";
		dom.addClass(modalContainer, "hideMenu");

		var modalTitle = dom.createEWC("span", ["title"]);
		modalTitle.innerHTML = options.title;
		
		var modalClose = dom.createEWC("span", ["close"]);
		modalClose.innerHTML = '<i class="icon-cancel"></i>';
		modalClose.onclick = function(){options.closeAction();};

		var sectionList = dom.createEWC("span", ["sectionList"]);
		var sectionContent = dom.createEWC("span", ["sectionContent"]);

		modalMenu.onclick = function(){
			if (this.parentElement.parentElement.className.indexOf("hideMenu") != -1){
				dom.removeClass(this.parentElement.parentElement, "hideMenu")
				sectionContent.style.display = "none";
			}else{
				dom.addClass(this.parentElement.parentElement, "hideMenu")
				sectionContent.style.display = null;
			}
		}

		modalDescRow = this.createRow();
		modalDescRow.appendChild(modalMenu);
		modalDescRow.appendChild(modalTitle);
		modalDescRow.appendChild(modalClose);
		modalContainer.appendChild(modalDescRow);

		modalDescRow = this.createRow();
		modalDescRow.appendChild(sectionList);
		modalDescRow.appendChild(sectionContent);
		modalContainer.appendChild(modalDescRow);

		modalContainer.sectionList = sectionList;
		modalContainer.sectionContent = sectionContent;

		return modalContainer;

	},
	createTab: function(text, id, active){
		tab = dom.createEWC("div", ["listItem"])
		tab.innerHTML = text;
		tab.changeID = id;
		if (active){
			dom.addClass(tab, "active");
		}

		tab.onclick = function(){
			var allTabs = this.parentElement.parentElement.parentElement.sectionList;
			var m = this.parentElement.parentElement.parentElement.sectionContent;
			var m_save = document.getElementById(this.changeID);

			if ((typeof m_save == "undefined") || (m_save == null)){
				return false;
			}

			for (var i = 0; i < m.children.length; i++){
				m.children[i].style.display = "none";
			}

			for (var i = 0; i < allTabs.children.length; i++){
				dom.removeClass(allTabs.children[i], "active");
			}

			m_save.style.display = null;
			dom.addClass(this, "active");
		}
		return tab;
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
		workHeader.className = "sectionHeader";
		workHeader.innerHTML = text;
		
		return workHeader;
	},
	alert: function(text, className){
		var remoteInfo = document.getElementById("remote_info");
		if (typeof className != "undefined"){
			dom.addClass(remoteInfo, className);
		}
		remoteInfo.innerHTML = text;
		remoteInfo.style.display = "";
	},
	hideAlert: function(){
		var remoteInfo = document.getElementById("remote_info");
		remoteInfo.style.display = "none";
	}
}