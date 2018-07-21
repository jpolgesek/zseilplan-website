# coding: utf-8
from jsmin import jsmin
compiled = ""
js_list = []
# js_list.append("o.js")
js_list.append("overrides.js")
js_list.append("ui.js")
js_list.append("datetime.js")
js_list.append("storage.js")
js_list.append("quicksearch.js")
js_list.append("app.js")

for f in js_list:
	with open(f,"r") as js:
		compiled += js.read()
		compiled += "\n"


with open("c_app.js","w") as out:
	out.write("//Minified by compile.py\n")
	out.write(jsmin(compiled))