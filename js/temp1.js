/*
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
*/
var pageWidth = window.innerWidth || document.body.clientWidth;
var treshold = Math.max(1,Math.floor(0.01 * (pageWidth)));
var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;

var limit = Math.tan(20 * 1.5 / 180 * Math.PI);
var gestureZone = document.getElementsByClassName('container')[0];

gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

function handleGesture(e) {
    var x = touchendX - touchstartX;
    var y = touchendY - touchstartY;
    var xy = Math.abs(x / y);
    var yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
        if (yx <= limit) {
            if (x < 0) {
				console.log("left");
				if (columns.activeColumn == 9000){
					return;
				}else if (columns.activeColumn > -1){
					columns.setActive(columns.activeColumn-1);
				}
            } else {
				console.log("right");
				console.log(columns.activeColumn);
				if (columns.activeColumn == 9000){columns.activeColumn = 0};
				if (columns.activeColumn == -1){
					columns.setActive(0);
				}else if (columns.activeColumn < 5){
					columns.setActive(columns.activeColumn+1);
				}
            }
		}
		/*
        if (xy <= limit) {
            if (y < 0) {
                console.log("top");
            } else {
                console.log("bottom");
            }
        }*/
	} /*else {
        console.log("tap");
    }*/
}