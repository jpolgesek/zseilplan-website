# Super Clever Plan - Web

This is main Super Clever Plan repository. 
To fully use this, you might need: 
- [Super Deploy Tool](https://github.com/jpolgesek/superdeploytool) - For easier deployment in CI environment
- [Super Clever Plan - Python Backend](https://github.com/jpolgesek/zseilplan-python) - For scraping timetable and overrides data from website.

**App source code is quite messy, and honestly needs another rewrite (complete one this time).**


## Quick Start
- Clone this repo
- Replace data.php with data.json contents (or put app on PHP-Enabled web server)
- Open index.html


## Directory structure
directory       | usage 
----------------| ----------
aee/      		| A Easter Egg (accessible via ↑↑↓↓←→←→BA)
assets/      	| App assets:
assets/css/ 	| CSS Files (style.css includes other files)
assets/font/	| Icon Font files
assets/ie_css/	| Because _some browsers_ just need special treatment (CSS)
assets/ie_js/	| Because _some browsers_ just need special treatment (JS)
assets/img/		| Images
assets/js/		| JS files
assets/themes/	| Themes (JS + CSS + images)
data/			| Archival timetable data
goodbye/		| Special goodbye static site.


## Some important app files
file       		| usage 
----------------| ----------
index.html		| Main app start page. Prepared to be parsed by Super Deploy Tool.
ie_index.html	| Main app start page for special browsers. Prepared to be parsed by Super Deploy Tool.
update.html		| Super Deploy Tool will show this page when app is being deployed.
.deploytool.json| Super Deploy Tool configuration file.
.gitlab-ci.yml  | Gitlab CI configuration file.
data.php	    | PHP file which prints data.json with some "no-cache" headers (that probably don't work).
manifest.json   | PWA manifest.

## App internal structure
Most of the things are in the app.something namespace, but unfortunately not all of them are.   
Also - only some small bits of code have docs. I might fix it in the future, but that depends on my free time.
