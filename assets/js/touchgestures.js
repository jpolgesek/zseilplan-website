app.touchGestures = {
    on_left: [
        function(){
            if (columns.activeColumn == 9000){columns.activeColumn = 0};
            if (columns.activeColumn == -1){
                columns.setActive(0);
            }else if (columns.activeColumn < 5){
                columns.setActive(columns.activeColumn+1);
            }
        }
    ],
    on_right: [
        function(){
			if (columns.activeColumn == 9000){
				return;
			}else if (columns.activeColumn >= 2){
				columns.setActive(columns.activeColumn-1);
			}
        }
    ],
    on_top: [],
    on_bottom: [],
};

var pageWidth = window.innerWidth || document.body.clientWidth;
var threshold = Math.max(1,Math.floor(0.1 * (pageWidth)));
var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;

var limit = Math.tan(20 * 1.5 / 180 * Math.PI);
var gestureZone = document.body;

gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, {passive: true});

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, {passive: true});

function handleGesture(e) {
    if (columns.activeColumn == -1){
        return;
    }
    var x = touchendX - touchstartX;
    var y = touchendY - touchstartY;
    var xy = Math.abs(x / y);
    var yx = Math.abs(y / x);
    if (Math.abs(x) > threshold || Math.abs(y) > threshold) {
        if (yx <= limit) {
            if (x >= 0) {
                app.touchGestures.on_right.forEach(f => {f(e);});
            } else {
                app.touchGestures.on_left.forEach(f => {f(e);});
            }
		}
        if (xy <= limit) {
            if (y < 0) {
                app.touchGestures.on_top.forEach(f => {f(e);});
            } else {
                app.touchGestures.on_bottom.forEach(f => {f(e);});
            }
        }
	} /*else {
        console.log("tap");
    }*/
}