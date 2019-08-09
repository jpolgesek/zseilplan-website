var modal = {
	elements: [],

	close: function(modal_el){
		this.elements = this.elements.filter(el => (el != modal_el));
		requestAnimationFrame(()=>{
			modal_el.classList.add("hide-animation");
		});
		setTimeout(() => {
			modal_el.parentElement.removeChild(modal_el);
			if (!this.elements.length){
				app.ui.containerBlur(0);
			}
		}, 300);
	},

	closeAll: function(){
		this.elements.map(el => {this.close(el)})
	},

	element: undefined,

	create: function(id ,title, desc, closeAction){
		console.log("DEPRECATED modal.create!!!!!!!!!");
		alert("DEPRECATED modal.create!!!!!!!!!");
		return;
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
		modalContainer = app.utils.createEWC("div", ["tabbedModal", "center-hv", "shadow", "hideMenu"]);

		var modalTitle = app.utils.createEWC("span", ["title"], options.title);
		var modalClose = app.utils.createEWC("span", ["close"], '<i class="icon-cancel"></i>');

		modalContainer.close = function(){
			app.ui.modal.close(modalContainer);
			if (options.closeAction){
				options.closeAction();
			}
		}

		modalClose.onclick = modalContainer.close;

		if (options.tabbed){
			var modalMenu = app.utils.createEWC("div", ["menuCheck"], "☰");
			var sectionList = app.utils.createEWC("span", ["sectionList"]);

			modalMenu.onclick = function(){
				if (this.parentElement.parentElement.className.indexOf("hideMenu") != -1){
					dom.removeClass(this.parentElement.parentElement, "hideMenu");
				}else{
					dom.addClass(this.parentElement.parentElement, "hideMenu");
				}
			}
		}

		var sectionContent = app.utils.createEWC("span", ["sectionContent"]);

		modalDescRow = this.createRow();

		if (options.tabbed){
			modalDescRow.appendChild(modalMenu);
		}

		modalDescRow.appendChildren([
			modalTitle,
			modalClose
		]);

		modalContainer.appendChild(modalDescRow);

		modalDescRow = this.createRow();

		if (options.tabbed){
			modalDescRow.appendChild(sectionList);
		}

		modalDescRow.appendChild(sectionContent);
		modalContainer.appendChild(modalDescRow);

		modalContainer.sectionList = sectionList;
		modalContainer.sectionContent = sectionContent;

		this.elements.push(modalContainer);
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
			//FIXME: wtf is that parentElement shit?
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
			dom.addClass(this.parentElement.parentElement.parentElement, "hideMenu");
		}
		return tab;
	},

	createRow: function(child){
		var row = app.utils.createEWC("div", ["row"]);
		if (child){
			row.appendChild(child);
		}
		return row;
	},

	createButton: function(options){
		var workBtn = app.utils.createEWC("button", (options.primary) ? ["btn-primary"] : [], options.innerHTML);
		workBtn.onclick = options.onClick;
		
		return workBtn;
	},

	createSectionHeader: function(text){
		return app.utils.createEWC("h2", ["sectionheader"], text);
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