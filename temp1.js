var tabs = document.querySelector('.tabs');
var items = document.querySelector('.tabs').querySelectorAll('a');
var selector = document.querySelector(".tabs").querySelector(".selector");
var activeItem = tabs.querySelector('.active');
var activeWidth = activeItem.offsetWidth;
selector.style.left = activeItem.offsetLeft + "px";
selector.style.width = activeWidth + "px";
items.forEach(element => {
	element.onclick = function(){
		items.forEach(element => {
			element.classList.remove("active");
		});
		this.classList.add("active");
		var activeItem = tabs.querySelector('.active');
		var activeWidth = activeItem.offsetWidth;

		selector.style.left = activeItem.offsetLeft + "px";
		selector.style.width = activeWidth + "px";
	}
});