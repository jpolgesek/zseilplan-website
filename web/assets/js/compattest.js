var is_compatible = true;

try {
	console.log();
} catch (e) {
	console = {
		log: alert,
		error: alert,
		warn: alert
	}
	is_compatible = false;
}
if (!window.fetch){
	console.log("No fetch in browser");
	// is_compatible = false;
}

if (!document.querySelector){
	console.log("No querySelector in browser");
	is_compatible = false;
}

if (!is_compatible){
	document.location.href = "ie_index.html";
}

//ie
//newstring