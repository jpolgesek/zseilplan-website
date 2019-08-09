try {
	console.log();
} catch (e) {
	console = {
		log: alert,
		error: alert,
		warn: alert
	}
}

var is_compatible = true;

if (!window.fetch){
	console.log("No fetch in browser");
	is_compatible = false;
}

if (!document.querySelector){
	console.log("No querySelector in browser");
	is_compatible = false;
}

//ie
//newstring