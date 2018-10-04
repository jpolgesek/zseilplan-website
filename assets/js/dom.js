var dom = {
	/**
	 * Adds class to element (proxy/polyfill for classList)
	 * @param 	{string} 		elementName		Name of element to be created
	 * @param 	{string[]} 	classList 		List of classes to be attached to newly created element
	 * @returns {boolean} 								Success (true) or failure (false)
	 */
	addClass: function(elementObject, className){
		if (typeof(document.body.classList) == "undefined"){
			classList = elementObject.className.split(" ");
			if (classList.indexOf(className) != -1){
				return false; //element ma już taką klasę
			}
			classList.push(className);
			elementObject.className = classList.join(" ");
			return true;
		}else{
			return elementObject.classList.add(className);
		}
	},

	/**
	 * Removes class from element (proxy/polyfill for classList)
	 * @param 	{string} 		elementName		Name of element to be created
	 * @param 	{string[]} 	classList 		List of classes to be attached to newly created element
	 * @returns {boolean} 								Success (true) or failure (false)
	 */
	removeClass: function(elementObject, className){
		if (typeof(document.body.classList) == "undefined"){
			classList = elementObject.className.split(" ");
			if (classList.indexOf(className) == -1){
				return false; //element nie ma takiej klasy
			}
			classList.pop(classList.indexOf(className));
			elementObject.className = classList.join(" ");
			return true;
		}else{
			return elementObject.classList.remove(className);
		}
	},

	/**
	 * Creates new HTMLElement with given classlist
	 * @param {string} 		elementName 		Name of element to be created
	 * @param {string[]} 	classList 			List of classes to be attached to newly created element
	 */
	createEWC: function(elementName, classList){
		element = document.createElement(elementName);
		for (var i = 0; i < classList.length; i++){
			this.addClass(element, classList[i]);
		}
		return element;
	},
	
	/**
	 * Initializes polyfills for older browsers
	 */
	init: function(){
		if (!document.getElementsByClassName) {
			console.log("wow, przeglądarka nie ma nawet getelementsbyclassname. Czyżby IE?");
			document.super_fucking_old_ie = true;
			document.getElementsByClassName = function(search) {
			  var d = document, elements, pattern, i, results = [];
			  if (d.querySelectorAll) { // IE8
				return d.querySelectorAll("." + search);
			  }
			  if (d.evaluate) { // IE6, IE7
				pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
				elements = d.evaluate(pattern, d, null, 0, null);
				while ((i = elements.iterateNext())) {
				  results.push(i);
				}
			  } else {
				elements = d.getElementsByTagName("*");
				pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
				for (i = 0; i < elements.length; i++) {
				  if ( pattern.test(elements[i].className) ) {
					results.push(elements[i]);
				  }
				}
			  }
			  return results;
			}
		}
		if(!Array.prototype.indexOf){document.super_fucking_old_ie = true;Array.prototype.indexOf=function(b){var a=this.length>>>0;var c=Number(arguments[1])||0;c=(c<0)?Math.ceil(c):Math.floor(c);if(c<0){c+=a}for(;c<a;c++){if(c in this&&this[c]===b){return c}}return -1}};
	}
}

dom.init();

/* For older browsers, which do not create console object when console is hidden */
/* IE 6. */
try {
	console.log();
} catch (e) {
	window.console = {
		log: function(x){alert(x);},
		time: function(x){return;},
		timeEnd: function(x){return;}
	}
}