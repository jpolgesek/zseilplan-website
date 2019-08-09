function getIPs(callback){
    var ip_dups = {};
    var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    if(!RTCPeerConnection){
        //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
            || win.mozRTCPeerConnection
            || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }

    var mediaConstraints = {optional: [{RtpDataChannels: true}]};
    var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate){
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        var ip_addr = ip_regex.exec(candidate)[1];
        if(ip_dups[ip_addr] === undefined) callback(ip_addr);
        ip_dups[ip_addr] = true;
    }

    pc.onicecandidate = function(ice){
        if(ice.candidate) handleCandidate(ice.candidate.candidate);
	};
	
	pc.createDataChannel("");
    pc.createOffer(function(result){
        pc.setLocalDescription(result, function(){}, function(){});
    }, function(){});

    setTimeout(function(){
        var lines = pc.localDescription.sdp.split('\n');
        lines.forEach(function(line){
            if(line.indexOf('a=candidate:') === 0) handleCandidate(line);
        });
    }, 1000);
}


app.bugreport = {
    prepare: function(){
		output = {};
		output.window = {};
		output.document = {};
		output.screen = {};
		output.navigator = {};
		output.location = {};
		output.localstorage = {};
		output.ip = app.ip;
		output.window.innerWidth = window.innerWidth;
		output.window.outerWidth = window.outerWidth;
		output.window.innerHeight = window.innerHeight;
		output.window.outerHeight = window.outerHeight;
		output.window.devicePixelRatio = window.devicePixelRatio;
		output.document.width = document.width;
		output.screen.width = screen.width;
		output.navigator.userAgent = navigator.userAgent;
		output.document.body = document.body.innerHTML;
		output.location.href = location.href;
		output.navigator.cookieEnabled = navigator.cookieEnabled;
		try {
			for (var i = 0; i < localStorage.length; i++){
				output.localstorage[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
			}
		}catch (e) {}

		return output;
    },

	modal: function(){
		bugreportDiv = modal.create('bugreport', "Zgłoś błąd", "", function(){bugreportDiv.parentElement.removeChild(bugreportDiv);app.ui.containerBlur(false)});
		
		row = modal.createRow();
		row.style.margin.bottom = "-10px";
		row.style.fontSize = "1.5em";
		section_title = document.createElement('span');
		section_title.innerHTML = "Opisz co się stało";
		row.appendChild(section_title);
		bugreportDiv.appendChild(row);
		
		row = modal.createRow();
		input = document.createElement('textarea');
		input.type = "";
		input.style.width = "100%";
		input.style.height = "200px";

		row.appendChild(input);
		bugreportDiv.appendChild(row);

		row = modal.createRow();
		row.style.margin.bottom = "-10px";
		row.style.fontSize = "1.5em";
		section_title = document.createElement('span');
		section_title.innerHTML = "Adres email";
		row.appendChild(section_title);
		bugreportDiv.appendChild(row);
		
		row = modal.createRow();
		input = document.createElement('input');
		input.type = "text";

		row.appendChild(input);

		bugreportDiv.appendChild(row);
		
		row = modal.createRow();
		prefsBtnSave = document.createElement('button');
		prefsBtnSave.innerHTML = "Wyślij";
		prefsBtnSave.onclick = function(){
			bd = app.preparebugdump();
		};
		prefsBtnSave.className = "btn-primary";
		row.appendChild(prefsBtnSave);

		prefsBtnCancel = document.createElement('button');
		prefsBtnCancel.innerHTML = "Anuluj";
		prefsBtnCancel.onclick = function(){bugreportDiv.parentElement.removeChild(bugreportDiv);app.ui.containerBlur(false)};
		row.appendChild(prefsBtnCancel);
		bugreportDiv.appendChild(row);

		app.ui.containerBlur(true);
		document.body.appendChild(bugreportDiv);
		setTimeout(function(){dom.addClass(bugreportDiv, "modal-anim");},1);
	},

}