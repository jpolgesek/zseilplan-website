if (window.addEventListener) {
	var _kk = [], _nk = "38,38,40,40,37,39,37,39,66,65";
	window.addEventListener("keydown", function(e) {
		_kk.push(e.keyCode);
		if (_kk.toString().indexOf(_nk) >= 0 ){
			scrollTo(0,0);
			document.body.innerHTML = '<div style="z-index: 99999999;position: absolute;top: 0;left: 0;width: 100%;height: 100%;"><iframe src="aee/" style="width: 100%;height: 100%;border-style:none"></iframe></div>' + document.body.innerHTML;
			scrollTo(0,0);
			_kk = [];
		}
	}, true);
}
