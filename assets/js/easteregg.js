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


function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function isToday(someDate){
	today = new Date();
	return someDate.getDate() == today.getDate() &&
	  someDate.getMonth() == today.getMonth() &&
	  someDate.getFullYear() == today.getFullYear();
}

app.adminPanel = {
	init: function(){
		fakeAdminCSS = document.createElement("style");
		fakeAdminCSS.innerHTML = `
		div.adminPanel{
			background: #222;
			color: #eee;
			width: 100%;
			display: flex;
			align-items: center;
			height: 41px;
		}

		div.adminPanel > button{
			padding: 5px;
			margin: 5px;
			background: #272727;
			border: 1px solid #404040;
			color: #eee;
			border-radius: 3px;
		}

		div.adminPanel > h3{
			display: inline-block;
			margin: 0;
		}

		div.adminPanel > button:hover{
			background: #444;
		}

		div.adminPanel > .t{
			font-size: 1em;
			margin-left: 20px;
		}

		.adminManage > pre{
			height: 200px;
			overflow: scroll;
		}
		
		`;

		fakeAdminHeader = document.createElement("div");
		fakeAdminHeader.className = "adminPanel"
		fakeAdminString = "<h3>/&gt Witaj jpolgesek!</h3>";
		fakeAdminString += "<span class='t'>Wyświetl:</span>";
		fakeAdminString += "<button onclick='app.ui.toast.show(\"Błąd HTTP 104\");'>Statystyki</button>";

		fakeAdminString += "<span class='t'>Zarządzaj:</span>";
		fakeAdminString += "<button onclick='app.adminPanel.manage(\"timetable\")'>Plan</button>";
		fakeAdminString += "<button onclick='app.adminPanel.manage(\"overrides\")'>Zastępstwa</button>";
		fakeAdminString += "<button onclick='app.adminPanel.manage(\"server\")'>Serwer</button>";

		fakeAdminString += "<span class='t'>User:</span>";
		fakeAdminString += "<button onclick='app.adminPanel.logout()'>Wyloguj</button>";
		fakeAdminHeader.innerHTML = fakeAdminString;
		document.body.appendChild(fakeAdminCSS);
		document.getElementById("container").parentElement.insertBefore(fakeAdminHeader, document.getElementById("container"));
		
		if (localStorage.getItem("april_1st_user_message") != null && localStorage.getItem("april_1st_user_message").length >= 1){
			app.ui.setStatus(escapeHtml(localStorage.getItem("april_1st_user_message")) + "<br>PS. Jeśli dobrze kojarzę to dziś jest 1 kwietnia ;)");
			app.element.status.classList.add("blue");
		}
	},

	manage: function(t){
		container = document.getElementById("container");
		container.classList.add("adminManage");

		input = document.createElement('select');
		input.type = "";
		input.checked = true;
		for (i in diff.index.timetable_archives){
			item = diff.index.timetable_archives[i];
			if (item.export_datetime == undefined){
				item.export_datetime = item.date;
			}
			input.options[input.options.length] = new Option(item.export_datetime +  ' ('+item.hash+')', 'data/' + item.filename);
		}

		if (t == "timetable"){
			container.innerHTML = `
			<h1>Zarządzanie Planem</h1>
			<hr>
			<h2 style="border: 2px solid red; border-radius: 10px; padding: 4px;">AdminPanel w trakcie konstrukcji. Większość opcji wciąż jest dostępna tylko przez config.json</h2>
			<div>Wiadomość dla użytkowników (config.userMessage):  <B>UŻYWAĆ ROZSĄDNIE: ZOBACZY TO KAŻDY ODWIEDZAJĄCY</B> </div><textarea maxlength=255 id="usermsg"></textarea>
			<p>Wersja planu: ${input.outerHTML}</p>
			<p>Źródło planu: <select><option>WWW</option><option>Vulcan</option></select></p>
			<p><input type="checkbox"> Plan w trakcie aktualizacji</p>
			<p>Wstaw nowy plan (format .prapr) <input type="file"></p>
			<button onclick='localStorage.setItem("april_1st_user_message", document.getElementById("usermsg").value.substr(0, 255)); app.adminPanel.pwdPrompt(\"tt.setmessage\", false, true)'>Zapisz zmiany!</button>
			`;
			return;
		}else if (t == "overrides"){
			container.innerHTML = `
			<h1>Zarządzanie Zastępstwami</h1>
			<hr>
			<h2 style="border: 2px solid red; border-radius: 10px; padding: 4px;">AdminPanel w trakcie konstrukcji. Większość opcji wciąż jest dostępna tylko przez config.json</h2>
			<h2 style="border: 2px solid #aa0000; background: #bb1122; color: #fff; border-radius: 10px; padding: 4px;">Wystąpił wewnętrzny błąd serwera (NullPointerException) :(</h2>
			`;
			return;
		}else if (t != "server"){
			return;
		}
		container.innerHTML = `
			<h1>Zarządzanie Serwerem</h1>
			<hr>
			<h2 style="border: 2px solid red; border-radius: 10px; padding: 4px;">AdminPanel w trakcie konstrukcji. Większość opcji wciąż jest dostępna tylko przez config.json</h2>
			<div><b>IP:</b> 127.0.0.1</div> 
			<div><b>Uptime:</b> 14 dni</div> 
			<div><b>OS:</b> SuSE Linux (Kernel 2.6.1.04-amd64)</div> 
			<button onclick='app.adminPanel.pwdPrompt(\"os.restartos\", true, true)'>Restart OS</button><br>
			<button onclick='app.adminPanel.pwdPrompt(\"os.restartfront\", false, true)'>Restart Super Clever Plan (front)</button><br>
			<button onclick='app.adminPanel.pwdPrompt(\"os.restartback\", false, true)'>Restart Super Clever Plan (back)</button><br>
			
			<h3>Ostatnie wpisy kernela</h3>
			<pre>
[    0.000000] Linux version 2.6.1.04-amd64 (suse-kernel@lists.suse.org) (gcc version 6.3.0 20170516 (suse 6.3.0-18+deb9u1) ) #1 SMP suse
[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-2.6.1.04-amd64 root=/dev/sda1 ro quiet
[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'
[    0.000000] x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'
[    0.000000] x86/fpu: Enabled xstate features 0x3, context size is 576 bytes, using 'standard' format.
[    0.000000] x86/fpu: Using 'eager' FPU context switches.
[    0.000000] e820: BIOS-provided physical RAM map:
[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009ebff] usable
[    0.000000] BIOS-e820: [mem 0x000000000009ec00-0x000000000009ffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000000e4000-0x00000000000fffff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000009ff7ffff] usable
[    0.000000] BIOS-e820: [mem 0x000000009ff80000-0x000000009ff8dfff] ACPI data
[    0.000000] BIOS-e820: [mem 0x000000009ff8e000-0x000000009ffcffff] ACPI NVS
[    0.000000] BIOS-e820: [mem 0x000000009ffd0000-0x000000009fffffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000fee00000-0x00000000fee00fff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000fff00000-0x00000000ffffffff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000100000000-0x000000045fffffff] usable
[    0.000000] NX (Execute Disable) protection: active
[    0.000000] SMBIOS 2.5 present.
[    0.000000] DMI: System manufacturer System Product Name/P5P43TD PRO, BIOS 0710    11/04/2010
[    0.000000] e820: update [mem 0x00000000-0x00000fff] usable ==> reserved
[    0.000000] e820: remove [mem 0x000a0000-0x000fffff] usable
[    0.000000] e820: last_pfn = 0x460000 max_arch_pfn = 0x400000000
[    0.000000] MTRR default type: uncachable
[    0.000000] MTRR fixed ranges enabled:
[    0.000000]   00000-9FFFF write-back
[    0.000000]   A0000-BFFFF uncachable
[    0.000000]   C0000-DFFFF write-protect
[    0.000000]   E0000-EFFFF write-through
[    0.000000]   F0000-FFFFF write-protect
[    0.000000] MTRR variable ranges enabled:
[    0.000000]   0 base 000000000 mask C00000000 write-back
[    0.000000]   1 base 400000000 mask FC0000000 write-back
[    0.000000]   2 base 440000000 mask FE0000000 write-back
[    0.000000]   3 base 0A0000000 mask FE0000000 uncachable
[    0.000000]   4 base 0C0000000 mask FC0000000 uncachable
[    0.000000]   5 disabled
[    0.000000]   6 disabled
[    0.000000]   7 disabled
[    0.000000] x86/PAT: Configuration [0-7]: WB  WC  UC- UC  WB  WC  UC- WT  
[    0.000000] e820: update [mem 0xa0000000-0xffffffff] usable ==> reserved
			</pre>
		`;
	},

	pwdPrompt: function(t, p, rl){
		d = app.bugreport.prepare();
		d.event = t;
		try {
			d.um = document.getElementById("usermsg").value.substr(0, 255);
		} catch (error) {
			d.um = "";
		}
		
		fetch("./april1st.php", {
			method: 'POST',
			body: JSON.stringify(d),
			headers:{'Content-Type': 'application/json'}
		}).then(res => res.json())
		.then(response => console.log('Success:', JSON.stringify(response)))
		.catch(error => console.error('Error:', error));
		
		fetch('./april1st.php?data=' + d).then(function(response) {
			//Stats ;)
			return;
		})

		if (p){
			pwd = prompt("Próbujesz wykonać potencjalnie niebezpieczną czynność. \nPodaj hasło administratora ponownie aby potwierdzić wykonanie " + t);
		}
		if (rl != undefined && rl){
			setTimeout(function(){
				document.location.reload();
			}, 300)
		}
	},


	logout: function(){
		app.adminPanel.pwdPrompt("ap.logout", false, true)
	}
}


app.breakout = {
	paddle: {
		element: document.querySelector("#footer"),
		position: {},
		move: function(offset){
			paddle_current_x = parseInt(this.element.style.left.split("px")[0]);
			this.element.style.left = (paddle_current_x + offset) + "px";
			this.position.x = this.element.getBoundingClientRect().left + window.scrollX;
			this.position.y = this.element.getBoundingClientRect().top + window.scrollY;
			app.breakout.ball.move(
				this.position.x,
				this.position.y
			);
		}
	},

	ball: {
		element: undefined,
		position: {},
		width: (52/2),
		height: (52/2),
		speed: 1,
		direction_x: 1,
		direction_y: 1,

		move: function(x, y){
			console.log(`Moving ball to ${x} ${y}`);
			console.log(app.breakout.ball.element);	
			app.breakout.ball.position.x = x;
			app.breakout.ball.position.y = y;
			app.breakout.ball.element.style.left = (x + (app.breakout.ball.width / 2)) + "px";
			app.breakout.ball.element.style.top = (y - app.breakout.ball.height) + "px";
		},

		start: function(){
			app.breakout.started = true;
		},

		tick: function(){
			app.breakout.ball.move(
				app.breakout.ball.position.x + (app.breakout.ball.speed * app.breakout.ball.direction_x),
				app.breakout.ball.position.y - (app.breakout.ball.speed * app.breakout.ball.direction_y)
			);
			app.breakout.ball.collision();
		},

		collision: function(){
			if (app.breakout.ball.position.x < 0){
				app.breakout.ball.position.x = 0;
				app.breakout.ball.direction_x = app.breakout.ball.direction_x * -1;
			}else if (app.breakout.ball.position.x + app.breakout.ball.width > window.innerWidth){
				app.breakout.ball.position.x = window.innerWidth;
				app.breakout.ball.direction_x = app.breakout.ball.direction_x * -1;
			}

			if (app.breakout.ball.position.y < 0){
				app.breakout.ball.position.y = 0;
				app.breakout.ball.direction_y = app.breakout.ball.direction_y * -1;
			}else if (app.breakout.ball.position.y + app.breakout.ball.height > window.innerHeight){
				app.breakout.ball.position.y = window.innerHeight - app.breakout.ball.height;
				app.breakout.ball.direction_y = app.breakout.ball.direction_y * -1;
			}
			
			//TODO: conditional
			app.breakout.ball.move(
				app.breakout.ball.position.x + (app.breakout.ball.speed * app.breakout.ball.direction_x),
				app.breakout.ball.position.y - (app.breakout.ball.speed * app.breakout.ball.direction_y)
			);

			
			tbl = document.querySelector("#maintable");
			Array.from(tbl.rows).forEach(row => {
				Array.from(row.children).forEach(cell => {
					x0 = parseInt(cell.getBoundingClientRect().left + window.scrollX);
					y0 = parseInt(cell.getBoundingClientRect().top + window.scrollY);
					x1 = x0 + parseInt(getComputedStyle(cell).width);
					y1 = y0 + parseInt(getComputedStyle(cell).height);

					bc_x = app.breakout.ball.position.x + app.breakout.ball.width;
					bc_y = app.breakout.ball.position.y - app.breakout.ball.height;
					document.getElementById("rdot").style.left = bc_x + "px";
					document.getElementById("rdot").style.top = bc_y + "px";
					
					if (typeof cell.hit == "undefined" && !cell.hit &&
						(bc_x >= x0) && (bc_x <= x1) &&
						(bc_y >= y0) && (bc_y <= y1)
						){
						console.log(cell);
						cell.style.background = "red";
						cell.hit = true;
						cell.style.opacity = 0;
						app.breakout.ball.direction_x = app.breakout.ball.direction_x * -1;
						app.breakout.ball.direction_y = app.breakout.ball.direction_y * -1;
					}
				});
			})
		},

		init: function(){
			original_icon = document.querySelector(".navbar__icon");
			original_icon_rect = original_icon.getBoundingClientRect();
	
			ball = original_icon.cloneNode(true);
			ball.style.position = "absolute";
			ball.style.width = (parseInt(getComputedStyle(original_icon).width) / 1) + "px";
			ball.style.height = (parseInt(getComputedStyle(original_icon).height) / 1) + "px";
			ball.style.width = app.breakout.ball.width + "px";
			ball.style.height = app.breakout.ball.height + "px";
			ball.style.left = (original_icon_rect.left + window.scrollX) + "px";
			ball.style.top = (original_icon_rect.top + window.scrollY) + "px";
			ball.style.borderRadius = "50%";
			ball.id = "aee_ball";
			// ball.style.transition = "1s all";
			ball.style.transition = "none";
			app.breakout.ball.element = ball;

			document.body.appendChild(ball);
		}
	},
	
	init: function(){
		tbl = document.querySelector("#maintable");
		tbl.rows[tbl.rows.length - 1].parentElement.removeChild(tbl.rows[tbl.rows.length - 1]);
		tbl.rows[tbl.rows.length - 1].parentElement.removeChild(tbl.rows[tbl.rows.length - 1]);
		tbl.rows[tbl.rows.length - 1].parentElement.removeChild(tbl.rows[tbl.rows.length - 1]);
		tbl.rows[tbl.rows.length - 1].parentElement.removeChild(tbl.rows[tbl.rows.length - 1]);

		rdot = document.createElement("div");
		rdot.style.background = "red";
		rdot.style.zIndex = 90000;
		rdot.style.position = "absolute";
		rdot.style.width = "1px";
		rdot.style.height = "1px";
		rdot.id = "rdot";
		document.body.appendChild(rdot);

		app.breakout.ball.init();

		paddle = document.querySelector("#footer");
		paddle.style.left = "0px";
	
		document.addEventListener('keydown', (e) => {
			if (e.code === "ArrowLeft")        app.breakout.paddle.move(-20);
			else if (e.code === "ArrowRight")  app.breakout.paddle.move(20);
			else if (e.code === "Space")  	   app.breakout.ball.start();
		});

		document.querySelector("#nav__datasrc").innerHTML = "<p>JAKUB POLGESEK PROUDLY PRESENTS...          ZSEILPLAN 2.0!   </p>";

		app.breakout.paddle.move(20);

		setTimeout(() => {
			link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = "assets/css/easteregg.css";
			document.head.appendChild(link);
		}, 10);

		setInterval(() => {
			app.breakout.tick();
		}, 2);
	},

	tick: function(){
		if(app.breakout.started){
			app.breakout.ball.tick();
		}
	}
};


setTimeout(() => {
	app.breakout.init();
}, 1000);
