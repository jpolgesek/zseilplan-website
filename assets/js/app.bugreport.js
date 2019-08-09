function getIPs(callback){
    var ip_dups = {};
    var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    if(!RTCPeerConnection){
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
		bugreportDiv = app.ui.modal.createTabbed(
			{	
				title: "Zgłoś błąd",
				tabbed: false
			}
		);

		row = app.ui.modal.createRow();
		
		input_description = app.utils.createEWC("textarea", []);
		input_description.placeholder = "Opisz co się stało";
		input_description.style.width = "100%";
		input_description.style.height = "200px";
		
		input_email = app.utils.createEWC("input", []);
		input_email.type = "email";
		input_email.placeholder = "Podaj swój adres email";
		

		bugreportDiv.sectionContent.appendChildren([
			app.ui.modal.createRow(input_description),
			app.ui.modal.createRow(input_email),
		]);

		row = app.ui.modal.createRow();

		row.appendChild(app.ui.modal.createButton({
			innerHTML: "Zgłoś błąd",
			onClick: function(){
				bd = app.bugreport.prepare();
				input_description.innerHTML += "\n\n----CUT HERE----\n\n";
				input_description.innerHTML += JSON.stringify(bd);
				input_description.innerHTML += "\n\n----CUT HERE----\n\n";
				alert("TODO: send");
				bugreportDiv.close();
			},
			primary: true
		}));

		row.appendChild(app.ui.modal.createButton({
			innerHTML: "Anuluj",
			onClick: bugreportDiv.close
		}));

		bugreportDiv.appendChild(row);
		
		document.body.appendChild(bugreportDiv);
		app.ui.containerBlur(1);

	},

}