//Minified by compile.py
function getDay(n){date=new Date();var day=date.getDay()||7;if(day!==n)
date.setHours(-24*(day-n));return date.toLocaleString();}
function IEgetDay(n){date=new Date();var day=date.getDay()||7;if(day!==n)
date.setHours(-24*(day-n));out="";if(date.getDate()<10)out+="0";out+=String(date.getDate());out+="."
if(date.getMonth()+1<10)out+="0";out+=String(date.getMonth()+1);out+="."
out+=String(date.getFullYear());return out;}
function toggleOverrides(value){overrides_disabled=value;refreshView();}
function checkForOverrides(){console.log("Overrides start");if(overrides_disabled==true){console.log("Overrides are disabled. Exiting.");return;}
type=null;value=null
if(select_units.value!="default"){type="unit";value=select_units.value;}else if(select_teachers.value!="default"){type="teacher";value=select_teachers.value;}else if(select_rooms.value!="default"){type="room";value=select_rooms.value;}else{return false;}
for(y=1;y<11;y++){for(x=1;x<6;x++){tempdate2=new Date();if(tempdate2.getDay()==6||tempdate2.getDay()==0){ind=IEgetDay(x+7);}else{ind=IEgetDay(x);}
if(overrideData[ind]==undefined)continue;if(overrideData[ind][x]==undefined)continue;ui.createZMark(x);override=overrideData[ind][x][y];if(override==undefined)continue;cell=table.rows[y].cells[x];if(type=="unit"){unitParse(value,override,cell);}else if(type=="teacher"){teacherParse(value,override,cell);}else if(type=="room"){roomParse(value,override,cell);}}}}
function unitParse(unit,override,cell){override=override[value];if(override==undefined)return;for(o=0;o<override.length;o++){for(i=0;i<cell.children.length;i++){a=cell.children[i].children;teacher=a[2].children[0].innerText;gg=-1;if(a[0].innerText.split("-").length>1){gg=a[0].innerText.split("-")[1];}
console.log("teacher="+teacher);if(teacher==override[o].oldTeacherShort){console.log("Trafiony");temp_data=Object();try{temp_data.n=override[o].newTeacherShort;}catch(error){temp_data.n=override[o].newTeacher;}
temp_data.k=value;temp_data.p=override[o].subject;if(gg!=-1){temp_data.p+="-"+gg;temp_data.g=gg;}
temp_data.s=override[o].s;ui.isOverride=true;cell.replaceChild(ui.createItem(temp_data),cell.children[i]);ui.isOverride=false;}}}}
function teacherParse(teacher,override,cell){for(unit in override){for(o in override[unit]){if(override[unit][o].newTeacherShort==teacher){console.log("Mam zastepstwo dla nauczyciela "+teacher+" - ma lekcje z klasa "+unit+" na godzinie "+y+" w dniu "+x);temp_data=Object();temp_data.k=unit;temp_data.p=override[unit][o].subject;if(override[unit][o].guessedGroup!=undefined){temp_data.p+=" (Grupa "+override[unit][o].guessedGroup+")";}
temp_data.s=override[unit][o].s;temp_data.n=teacher;ui.isOverride=true;cell.appendChild(ui.createItem(temp_data));ui.isOverride=false;}
if(override[unit][o].oldTeacherShort==teacher){console.log("Nauczyciel "+teacher+" nie ma lekcji na godzinie "+y+" w dniu "+x+" z klasą "+unit+"  ");temp_data=Object();temp_data.k="";temp_data.p="Okienko";temp_data.s="";temp_data.n="";ui.isOverride=true;cell.innerHTML="";cell.appendChild(ui.createItem(temp_data));ui.isOverride=false;}}}}
function roomParse(room,override,cell){console.log("rp");for(unit in override){for(o in override[unit]){if(override[unit][o].s==room&&override[unit][o].newTeacherShort!=-1){console.log("Mam zastepstwo w sali "+room+" - "+override[unit][o].newTeacherShort+" ma lekcje z klasa "+unit+" na godzinie "+y+" w dniu "+x);temp_data=Object();temp_data.k=unit;temp_data.p=override[unit][o].subject;if(override[unit][o].guessedGroup!=undefined){temp_data.p+=" (Grupa "+override[unit][o].guessedGroup+")";}
temp_data.s=override[unit][o].s;temp_data.n=override[unit][o].newTeacherShort;ui.isOverride=true;try{if(override[unit][o].oldTeacherShort==cell.children[0].children[3].innerText){cell.innerHTML="";}}catch(e){}
cell.appendChild(ui.createItem(temp_data));ui.isOverride=false;}else if(override[unit][o].s==room&&override[unit][o].newTeacherShort==-1){console.log("Mam zastepstwo w sali "+room+" - ktos nie ma lekcji z klasa "+unit+" na godzinie "+y+" w dniu "+x);temp_data=Object();temp_data.k="";temp_data.p="";temp_data.s="";temp_data.n="";ui.isOverride=true;cell.innerHTML="";cell.appendChild(ui.createItem(temp_data));ui.isOverride=false;}else{for(i=0;i<cell.children.length;i++){if(override[unit][o].oldTeacherShort==cell.children[i].children[2].children[1].innerText){console.log("[NOWE!!!] Mam zastepstwo w sali "+room+" - ktos nie ma lekcji z klasa "+unit+" na godzinie "+y+" w dniu "+x);temp_data=Object();temp_data.k="";temp_data.p="";temp_data.s="";temp_data.n="";ui.isOverride=true;cell.innerHTML="";cell.appendChild(ui.createItem(temp_data));ui.isOverride=false;}}}}}}
var ui={breakLineInItem:false,darkMode:false,itemDisplayType:0,isOverride:false,jumpButtonsFloatRight:false,createZMark:function(n){if(document.getElementsByClassName("header")[0].children[n].children.length==0){zMark=document.createElement('span');zMark.className="zMark";zMark.innerHTML="Z";document.getElementsByClassName("header")[0].children[n].appendChild(zMark);}},createItem:function(itemData){span=[document.createElement('span'),document.createElement('span'),document.createElement('span')];if(itemData.p.length>=30){itemData.p=itemData.p.split(" ")[0];}
span[0].className='pName';span[0].innerHTML=itemData.p;span[1].className='clickable';span[2].className='clickable';if(this.itemDisplayType==0){span[1].innerHTML=itemData.k;span[1].onclick=function(){jumpTo(2,itemData.k)};span[2].innerHTML=itemData.s;span[2].onclick=function(){jumpTo(1,itemData.s)};}else if(this.itemDisplayType==1){span[1].innerHTML=itemData.k;span[1].onclick=function(){jumpTo(2,itemData.k)};span[2].innerHTML=itemData.n;try{span[2].title=data.teachermap[itemData.n];}catch(error){span[2].title="Brak informacji";}
span[2].onclick=function(){jumpTo(0,itemData.n)};}else if(this.itemDisplayType==2){span[1].innerHTML=itemData.n;try{span[1].title=data.teachermap[itemData.n];}catch(error){span[1].title="Brak informacji";}
span[1].onclick=function(){jumpTo(0,itemData.n)};span[2].innerHTML=itemData.s;span[2].onclick=function(){jumpTo(1,itemData.s)};}
jumpButtonsDiv=document.createElement('div');if(this.jumpButtonsFloatRight){jumpButtonsDiv.className="jumpButtons float-right";}else{jumpButtonsDiv.className="jumpButtons";}
element=document.createElement('div');if(this.isOverride){element.className='item override';}else{element.className='item';}
element.appendChild(span[0]);element.appendChild(this.itemLineBreak());if(itemData.n=="Uczniowie przychodzą p&#243;źniej"){span[0].innerHTML="Uczniowie przychodzą później";if(itemData.g!=undefined){span[0].innerHTML+=" ([info2]Grupa "+itemData.g+")";}}else if(itemData.n=="-1"){span[0].innerHTML="Uczniowie zwolnieni";if(itemData.g!=undefined){span[0].innerHTML+=" (Grupa "+itemData.g+")";}}else{if(itemData.g!=undefined){span[0].innerHTML+=" (Grupa "+itemData.g+")";}
jumpButtonsDiv.appendChild(span[1]);jumpButtonsDiv.appendChild(span[2]);element.appendChild(jumpButtonsDiv);}
return element;},createToast:function(text){document.getElementById("toast_desc").innerText=text;var x=document.getElementById("toast")
x.className="show";setTimeout(function(){x.className=x.className.replace("show","");},5000);},setDarkMode:function(state){this.darkMode=state;this.updateMode();try{ga('send','event','ui','setdarkmode='+state);}catch(e){}},setLineBreak:function(state){this.breakLineInItem=state;refreshView();try{ga('send','event','ui','setlinebreak='+state);}catch(e){}},setJumpButtonsFloatRight:function(state){this.jumpButtonsFloatRight=state;refreshView();try{ga('send','event','ui','setjumpbuttonsfloatright='+state);}catch(e){}},updateMode:function(){if(this.darkMode){document.body.className="dark";}else{document.body.className="";}},itemLineBreak:function(){lineBreak=document.createElement('div');if(this.breakLineInItem){lineBreak.className='item_linebreak';}else{lineBreak.className='item_linebreak_disabled';}
lineBreak.innerHTML="&nbsp;";return lineBreak;},print:function(){old_overrides_disabled=overrides_disabled;overrides_disabled=true;refreshView();o_copy=document.getElementsByClassName("copyright")[0].innerHTML;o_status=document.getElementById("status").innerHTML;document.getElementsByClassName("copyright")[0].innerHTML="<i>(dev.polgesek.pl/zseilplan)</i><br>"+o_copy+"<br>";document.getElementsByClassName("copyright")[0].innerHTML=" <span class='copyright_small'>"+document.getElementsByClassName("copyright")[0].innerHTML+"</span>";document.getElementsByClassName("copyright")[0].innerHTML+="Plan lekcji z dnia "+data._updateDate_min+" dla&nbsp;";if(this.itemDisplayType==0){document.getElementsByClassName("copyright")[0].innerHTML+="nauczyciela ";try{document.getElementsByClassName("copyright")[0].innerHTML+=data.teachermap[select_teachers.value.toLowerCase()][0];}catch(error){document.getElementsByClassName("copyright")[0].innerHTML+=select_teachers.value;}}else if(this.itemDisplayType==1){document.getElementsByClassName("copyright")[0].innerHTML+="sali ";document.getElementsByClassName("copyright")[0].innerHTML+=select_rooms.value;}else if(this.itemDisplayType==2){document.getElementsByClassName("copyright")[0].innerHTML+="klasy ";document.getElementsByClassName("copyright")[0].innerHTML+=select_units.value;}
print();document.getElementsByClassName("copyright")[0].innerHTML=o_copy;document.getElementById("status").innerHTML=o_status;overrides_disabled=old_overrides_disabled;try{gtag('event','ui.print',{'event_category':'ui.print','event_label':'Printed'});}catch(e){}},resetSelects:function(without){toClear=["units","rooms","teachers"];toClear.splice(toClear.indexOf(without),1);for(x in toClear){document.getElementById(toClear[x]).value="default";}},showPreferences:function(display){myStorage.generatePreferencesUI();if(display){document.getElementById("preferences").style.display="block";document.getElementsByClassName("container")[0].className="container blur";}else{document.getElementById("preferences").style.display="none";document.getElementsByClassName("container")[0].className="container";}}}
var d=new Date();function getTextDate(){var today=new Date();var dd=today.getDate();var mm=today.getMonth()+1;var yyyy=today.getFullYear();if(dd<10){dd='0'+dd}
if(mm<10){mm='0'+mm}
today=dd+'.'+mm+'.'+yyyy;return(today);}
var columns={currentDay:d.getDay(),activeColumn:9000,table:document.getElementById("maintable"),hideAll:function(){for(y=0;y<this.table.rows.length;y++){for(x=1;x<this.table.rows[y].cells.length;x++){this.table.rows[y].cells[x].className="col_"+x+" hidden";}}},showAll:function(){for(y=0;y<this.table.rows.length;y++){for(x=0;x<this.table.rows[y].cells.length;x++){this.table.rows[y].cells[x].className="col_"+x;}}},showSelected:function(){if(this.activeColumn==-1){this.showAll();myTime.checkAll();return;}
this.hideAll();if(this.activeColumn==9000){cells=document.getElementsByClassName("col_"+this.currentDay)
for(i=0;i<cells.length;i++){cells[i].className="col_"+this.currentDay;}}else{cells=document.getElementsByClassName("col_"+this.activeColumn)
for(i=0;i<cells.length;i++){cells[i].className="col_"+this.activeColumn;}}
if((this.activeColumn==this.currentDay)||(this.activeColumn==9000)){myTime.checkTime();}else{myTime.clear();}},setActive:function(n){for(i=-1;i<6;i++){document.getElementById("btn_"+i).className="";}
document.getElementById("btn_"+n).className="selected";if(n==0){n=9000;}
this.activeColumn=n;this.showSelected();}}
var myTime={time:d.getHours()+":"+d.getMinutes(),table:document.getElementById("maintable"),checkTime:function(){for(step in timeSteps){if(Date.parse('01/01/1970 '+this.time+':00')<Date.parse('01/01/1970 '+timeSteps[step]+':00')){console.log("time = "+this.time)
if(step%2){console.log("Lekcja "+((step-1+2)/2))
for(y=1;y<this.table.rows.length;y++){this.table.rows[y].className="";}
try{this.table.rows[(step-1+2)/2].className="currentTimeFull";}catch(error){}}else{for(y=1;y<this.table.rows.length;y++){this.table.rows[y].className="";}
try{this.table.rows[(step-1+3)/2].className="border-top-blue";}catch(error){}}
break}}},checkDate:function(){try{date=d.getDay();for(i=0;i<10;i++){for(j=0;j<document.getElementsByClassName("col_"+date).length;j++){if(document.getElementsByClassName("col_"+date).length==0){console.log("IE fix, dt.js, 115. X="+date+" Y="+j);}else{document.getElementsByClassName("col_"+date)[j].className="col_"+date+" currentTimeFull";}}}}catch(error){console.log(error);}},checkAll:function(){this.checkDate();this.checkTime();},clear:function(){for(y=1;y<this.table.rows.length;y++){this.table.rows[y].className="";}}}
if(typeof(Storage)!=="undefined"){document.getElementById("storageControl").className="";}
var myStorage={save:function(){localStorage.setItem("select_units",select_units.value);localStorage.setItem("select_teachers",select_teachers.value);localStorage.setItem("select_rooms",select_rooms.value);localStorage.setItem("columns.activeColumn",columns.activeColumn);localStorage.setItem("ui.darkMode",ui.darkMode);localStorage.setItem("ui.breakLineInItem",ui.breakLineInItem);localStorage.setItem("ui.jumpButtonsFloatRight",ui.jumpButtonsFloatRight);localStorage.setItem("saved",true);ui.createToast("Zapisałem ustawienia");try{gtag('event','show',{'event_category':'prefs.save','event_label':'prefs.save'});}catch(e){}},clear:function(){localStorage.removeItem("saved");localStorage.removeItem("select_units");localStorage.removeItem("select_teachers");localStorage.removeItem("select_rooms");localStorage.removeItem("columns.activeColumn");localStorage.removeItem("ui.darkMode");localStorage.removeItem("ui.breakLineInItem");localStorage.removeItem("ui.jumpButtonsFloatRight");ui.createToast("Wyczyściłem ustawienia domyślne");},load:function(){if(localStorage.getItem("saved")!="true"){return;}
if(localStorage.getItem("displayColumn")!=undefined){localStorage.setItem("activeColumn",localStorage.getItem("displayColumn"));localStorage.removeItem("displayColumn");}
document.getElementById("units").value=localStorage.getItem("select_units");document.getElementById("teachers").value=localStorage.getItem("select_teachers");document.getElementById("rooms").value=localStorage.getItem("select_rooms");if(localStorage.getItem("ui.darkMode")=="true"){ui.setDarkMode(true);}
if(localStorage.getItem("ui.breakLineInItem")=="true"){ui.breakLineInItem=true;}
if(localStorage.getItem("ui.jumpButtonsFloatRight")=="true"){ui.jumpButtonsFloatRight=true;}
try{columns.setActive(localStorage.getItem("columns.activeColumn"));}catch(error){console.log("Domyslny layout, ale bez selektora. E:"+error)}
if(localStorage.getItem("showTests")=="true"){console.log(12);}
},generatePreferencesUI:function(){preferencesDiv=document.getElementById("preferences");preferencesDiv.innerHTML="";prefsList=[["checkbox",ui.breakLineInItem,function(x){ui.setLineBreak(x)},"Zawijaj wiersze po nazwie przedmiotu","ui.setLineBreak"],["checkbox",ui.jumpButtonsFloatRight,function(x){ui.setJumpButtonsFloatRight(x)},"Wyrównuj sale i nauczycieli do prawej strony","ui.setJumpButtonsFloatRight"],["checkbox",ui.darkMode,function(x){ui.setDarkMode(x)},"Tryb nocny","ui.setDarkMode"],["checkbox",notifications_enabled,function(x){toggleNotifications(x);},"Odbieraj powiadomienia","toggleNotifications"],["checkbox",overrides_disabled,function(x){return;},"Tymczasowo ukryj zastępstwa","toggleOverrides"],["timetable",undefined,undefined,undefined,undefined]];prefsTitle=document.createElement('h1');prefsTitle.innerText="Ustawienia";preferencesDiv.appendChild(prefsTitle);for(var p_i=0;p_i<prefsList.length;p_i++){element=prefsList[p_i];flex=document.createElement('div');flex.className="flex-vcenter";if(element[0]=="checkbox"){label=document.createElement('label');label.className="switch"
input=document.createElement('input');input.type="checkbox";input.checked=element[1];input.setAttribute("onclick",""+element[4]+"(this.checked)");span=document.createElement('span');span.className="slider round";title=document.createElement("span");title.innerText=element[3];label.appendChild(input);label.appendChild(span);flex.appendChild(label);flex.appendChild(title);}else if(element[0]=="timetable"){biginfo=document.createElement("span");biginfo.className="preferences_default_big";title=document.createElement("span");if((localStorage.getItem("select_units")!="default")&&(localStorage.getItem("select_units")!=null)){title.innerHTML="Przy uruchamianiu ładuję automatycznie plan klasy <b>"+localStorage.getItem("select_units")+"</b>.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";biginfo.innerHTML=localStorage.getItem("select_units");}else if((localStorage.getItem("select_teachers")!="default")&&(localStorage.getItem("select_teachers")!=null)){title.innerHTML="Przy uruchamianiu ładuję automatycznie plan nauczyciela <b>"+localStorage.getItem("select_teachers")+"</b>.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";biginfo.innerHTML=localStorage.getItem("select_teachers");}else if((localStorage.getItem("select_rooms")!="default")&&(localStorage.getItem("select_rooms")!=null)){title.innerHTML="Przy uruchamianiu ładuję automatycznie plan sali <b>"+localStorage.getItem("select_rooms")+"</b>.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";biginfo.innerHTML=localStorage.getItem("select_rooms");}else{title.innerHTML="Przy uruchamianiu nie ładuję automatycznie żadnego planu.<br>Jeśli chcesz to zmienić, wyświetl plan który chcesz ustawić jako domyślny, a następnie wróć tutaj i zapisz zmiany.";biginfo.innerHTML="??";biginfo.className="preferences_default_big preferences_default_inactive";}
flex.appendChild(biginfo);flex.appendChild(title);}
preferencesDiv.appendChild(flex);}
prefsBtnSave=document.createElement('button');prefsBtnSave.innerText="Zapisz zmiany";prefsBtnSave.onclick=function(){myStorage.save();ui.showPreferences(0);};preferencesDiv.appendChild(prefsBtnSave);prefsBtnCancel=document.createElement('button');prefsBtnCancel.innerText="Anuluj";prefsBtnCancel.onclick=function(){ui.showPreferences(0)};preferencesDiv.appendChild(prefsBtnCancel);try{gtag('event','show',{'event_category':'prefs.generate','event_label':'prefs.generate'});}catch(e){}}}
var quicksearch={add:function(name,value){document.getElementById('suggestions').appendChild(new Option(name,value));},reset:function(){document.getElementById('suggestions').innerHTML="";},show:function(){document.getElementsByClassName("container")[0].className="container blur";document.getElementById("quicksearch").style.display="flex";document.getElementById("search").value="";document.getElementById("search").focus();try{gtag('event','show',{'event_category':'quicksearch.show','value':'1'});}catch(e){}},hide:function(){document.getElementById("quicksearch").style.display="none";document.getElementById("preferences").style.display="none";document.getElementById("search").value="";document.getElementsByClassName("container")[0].className="container";},eventListener:function(e){if(e.ctrlKey&&e.keyCode==32)quicksearch.show();if(e.keyCode==27)quicksearch.hide();},parse:function(code){try{gtag('event','show',{'event_category':'quicksearch.parsecode','value':code});}catch(e){}
code=code.toLowerCase();switch(code){case"tests:1":localStorage.setItem("showTests",true);alert("Włączono funkcje testowe");break;case"tests:0":localStorage.removeItem("showTests");alert("Wyłączono funkcje testowe");break;case"autocfo:1":localStorage.setItem("autocfo",true);alert("Włączono auto cfo");break;case"autocfo:0":localStorage.removeItem("autocfo");alert("Wyłączono auto cfo");break;}
location.reload();},search:function(e){if(e.keyCode==13){term=document.getElementById('search').value.toUpperCase();try{gtag('event','show',{'event_category':'quicksearch.search','event_label':term});}catch(e){}
if(term[0]=="N")jumpTo(0,term.substr(1,2))
else if(term[0]=="K")jumpTo(2,term.substr(1))
else if(term[0]=="S")jumpTo(1,term.substr(1))
else if(term[0]=="!")quicksearch.parse(term.substr(1))
quicksearch.hide();}},init:function(){document.addEventListener('keyup',this.eventListener,false);document.getElementById('search').addEventListener('keyup',this.search,false);return true;}}
maxHours=11;weekDays=5;var table=document.getElementById("maintable");var select_units=document.getElementById("units");var select_teachers=document.getElementById("teachers");var select_rooms=document.getElementById("rooms");var status_span=document.getElementById("status");var networkstatus=document.getElementById("networkStatus");var data="wait";var teachermap="wait";var teacherMapping="wait";var timeSteps="wait";var overrideData="wait";var overrides_disabled=false;var compat=false;var isIE=detectIE();function sortAsc(a,b){return a.localeCompare(b);}
function init(){console.log("init");status_span.innerText="Ładowanie preferencji...";if(typeof(Storage)!=="undefined"){myStorage.load();}
status_span.innerText="Ładowanie danych planu...";fetchData();}
function init2(){console.log("init 2");try{document.getElementById("button_comment").innerText=data.comment;}catch(error){document.getElementById("button_comment").innerText="Nie udało się pobrać wersji planu.";}
status_span.innerText="Przygotowywanie interfejsu: klasy";for(unit in data.units){select_units.options[select_units.options.length]=new Option(data.units[unit],data.units[unit]);};status_span.innerText="Przygotowywanie interfejsu: nauczyciele";for(key in data.teachermap){select_teachers.options[select_teachers.options.length]=new Option(data.teachermap[key]+' ('+key+')',key);}
status_span.innerText="Przygotowywanie interfejsu: sale";for(i in data.classrooms){select_rooms.options[select_rooms.options.length]=new Option(data.classrooms[i],data.classrooms[i]);}
select_units.onchange=refreshView;select_units.oninput=refreshView;select_teachers.onchange=refreshView;select_teachers.oninput=refreshView;select_rooms.onchange=refreshView;select_rooms.oninput=refreshView;if(data._updateDate_max==data._updateDate_min){status_span.innerText="Plan z dnia "+data._updateDate_max;}else{status_span.innerText="Plan z dni "+data._updateDate_max+" - "+data._updateDate_min;}
overrideData=data.overrideData;status_span.innerHTML+="<br>Zastępstwa na "+Object.keys(overrideData).map(function(s){return s.substr(0,5)}).join();status_span.innerHTML+="<br><a href='javascript:void(0)' onclick='updateData()'>Odśwież</a> | <a href='changelog.html'>Changelog</a>";if(screen.width>=1000){columns.setActive(-1);}
myTime.checkTime();setInterval(myTime.checkTime,60*1000);quicksearch.init();if(typeof(Storage)!=="undefined"){myStorage.load();refreshView();}
if(navigator.userAgent.indexOf('Windows NT 5.1')!=-1){if((navigator.userAgent.indexOf('Chrome/49')!=-1)||(navigator.userAgent.indexOf('Firefox/52')!=-1)){return;}
XPinfo=document.createElement("div");XPinfo.id="XPinfo";XPinfo.innerHTML="Ups, wygląda na to że twórca tej aplikacji nie przewidział wchodzenia na nią z systemu, od którego premiery:"
XPinfo.innerHTML+="<ul>"
XPinfo.innerHTML+="<li>Ziemia siedemnaście razy okrążyła słońce</li>"
XPinfo.innerHTML+="<li>Nastąpił atak terrorystyczny na WTC</li>"
XPinfo.innerHTML+="<li>Dokonała się internetowa rewolucja streamingowa</li>"
XPinfo.innerHTML+="<li>Wyszły 4 nowe główne systemy operacyjne od Microsoftu</li>"
XPinfo.innerHTML+="<li>AMD wróciło do gry</li>"
XPinfo.innerHTML+="<li>Microsoft zaczął robić konsole</li>"
XPinfo.innerHTML+="<li>AMD wypadło z gry</li>"
XPinfo.innerHTML+="<li>Dokonała się rewolucja Smart urządzeń</li>"
XPinfo.innerHTML+="<li>AMD wróciło do gry</li>"
XPinfo.innerHTML+="<li>strona szkoły jest jeszcze brzydsza</li>"
XPinfo.innerHTML+="</ul><br>"
XPinfo.innerHTML+="Więc w trosce o zdrowie psychiczne twoje oraz autora tej aplikacji polecam zaprzestać użytkowania <strong>17 LETNIEGO</strong> systemu operacyjnego."
XPinfo.innerHTML+="<br><br> <button class='wideBtn' type='button' onclick='document.getElementById(\"XPinfo\").style.display=\"none\"'>Obiecuję zainstalować nowy system, zamknij ten komunikat</button>"
XPinfo.style.background="url('err_xp.png'), rgb(142, 24, 24)";XPinfo.style.backgroundRepeat=" no-repeat";XPinfo.style.backgroundPosition="91% center";XPinfo.style.textAlign="left";XPinfo.style.color="#FAFAFA";XPinfo.style.padding="1.2%";XPinfo.style.paddingRight="40%";XPinfo.fontSize="1.2em";status_span.parentNode.insertBefore(XPinfo,status_span.nextSibling);}
if(location.hash.length>2){if(location.hash[1]=="n"){jumpTo(0,location.hash.substr(2).toUpperCase());}else if(location.hash[1]=="s"){jumpTo(1,location.hash.substr(2).toUpperCase());}else if(location.hash[1]=="k"){jumpTo(2,location.hash.substr(2).toUpperCase());}}}
function refreshView(){console.time('refreshView-pre');if(select_units.value=="default"&&select_teachers.value=="default"&&select_rooms.value=="default"){console.log("nic nie jest wybrane, nie odswiezam");return;}
console.log("Refreshing view");if(this.id!=undefined){ui.resetSelects(this.id);}
table.innerHTML="";createHeader(table);console.timeEnd('refreshView-pre');console.time('refreshView-1');for(hour=1;hour<maxHours;hour++){row=insertNumber(table,hour);for(day=1;day<6;day++){var cell=row.insertCell(-1);if(select_units.value!="default"){ui.itemDisplayType=2;try{classesArr=data.timetable[day][hour][select_units.value];for(cls in classesArr){cell.appendChild(ui.createItem(classesArr[cls]));}}catch(e){}
}else if(select_teachers.value!="default"){ui.itemDisplayType=0;try{itemData=data.teachers[select_teachers.value][day][hour];cell.appendChild(ui.createItem(itemData));}catch(e){}
}else if(select_rooms.value!="default"){ui.itemDisplayType=1;try{for(unit in data.timetable[day][hour]){itemData=data.timetable[day][hour][unit].filter(function(v){return v.s==select_rooms.value;});if(itemData.length>0){itemData=itemData[0];itemData.k=unit;cell.appendChild(ui.createItem(itemData));}
}}catch(e){}}}}
if(select_units.value!="default"){try{gtag('event','show.unit',{'event_category':'ui.unit','event_label':'show.unit='+select_units.value});}catch(e){}}else if(select_teachers.value!="default"){try{gtag('event','show.teacher',{'event_category':'ui.teacher','event_label':'show.teacher='+select_teachers.value});}catch(e){}}else if(select_rooms.value!="default"){try{gtag('event','show.room',{'event_category':'ui.room','event_label':'show.room='+select_rooms.value});}catch(e){}}
console.timeEnd('refreshView-1');console.time('refreshView-2');columns.showSelected();console.timeEnd('refreshView-2');console.time('refreshView-3');checkForOverrides();console.timeEnd('refreshView-3');myTime.checkTime();}
function createHeader(table){var header=table.insertRow(-1);header.className="header";for(i=0;i<6;i++){header.insertCell();}
table.rows[0].cells[0].innerHTML="Nr";table.rows[0].cells[1].innerHTML="Poniedziałek";table.rows[0].cells[2].innerHTML="Wtorek";table.rows[0].cells[3].innerHTML="Środa";table.rows[0].cells[4].innerHTML="Czwartek";table.rows[0].cells[5].innerHTML="Piątek";}
function insertNumber(table,y){var row=table.insertRow(-1);var cell=row.insertCell(-1);cell.innerHTML="<b>"+y+"</b><br>";cell.innerHTML+=timeSteps[(y*2-2)];cell.innerHTML+=" - ";cell.innerHTML+=timeSteps[(y*2)-1];return row;}
function jumpTo(type,value){select_units.value="default";select_teachers.value="default";select_rooms.value="default";if(type==0){if(!isIE){if(data.teachermap[value]==undefined){return;}}
select_teachers.value=value;select_teachers.onchange();}else if(type==1){if(!isIE){if(data.classrooms.find(function(x){return x==value})==undefined){return;}}
select_rooms.value=value;select_rooms.onchange();}else if(type==2){if(!isIE){if(data.units.find(function(x){return x==value})==undefined){return;}}
select_units.value=value;select_units.onchange();}}
function fetchData(){try{console.log("Fetch znaleziony: "+fetch);}catch(error){compat=true}
if(compat){console.log("Wlaczam tryb kompatybilnosci wstecznej - fetch.")
timestamp=Date.now();var fetchDataCompatXHR=new XMLHttpRequest();fetchDataCompatXHR.onreadystatechange=function(){if(this.readyState==4&&this.status==200){jdata=JSON.parse(fetchDataCompatXHR.responseText);data=jdata;teachermap=data.teachermap;teacherMapping=data.teachermap;timeSteps=data.timesteps['default'];console.log("[COMPAT] Wczytano data.json!");init2();}};fetchDataCompatXHR.open("GET","data.json",true);fetchDataCompatXHR.send();return true;}
isOK=true;timestamp=Date.now();fetch('data.json?ver='+timestamp).then(function(response){return response.json();}).then(function(jdata){console.log("Pobrano data.json!");data=jdata;teachermap=data.teachermap;teacherMapping=data.teachermap;if(getTextDate()in data.timesteps){console.log("Specjalny rozklad godzin dla dnia "+getTextDate()+" - laduje");timeSteps=data.timesteps[getTextDate()];}else{timeSteps=data.timesteps['default'];}
console.log("Wczytano data.json!");init2();}).catch(function(error){isOK=false});return isOK;}
document.body.onload=init();var notifications_enabled=false;if('serviceWorker'in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').then(function(registration){console.log('ServiceWorker registration successful with scope: ',registration.scope);registration.pushManager.getSubscription().then(function(sub){if(sub===null){console.log('Not subscribed to push service!');}else{console.log('Subscription object: ',sub);subscribeUser();}});},function(err){console.log('ServiceWorker registration failed: ',err);});});}
function toggleNotifications(v){if(v){subscribeUser();}else{unsubscribeUser();}}
function unsubscribeUser(){navigator.serviceWorker.ready.then(function(reg){reg.pushManager.getSubscription().then(function(subscription){subscription.unsubscribe().then(function(successful){ui.createToast("Wyłączyłem powiadomienia");}).catch(function(e){ui.createToast("Wystąpił nieznany błąd :(");})})});}
function subscribeUser(){if('serviceWorker'in navigator){navigator.serviceWorker.ready.then(function(reg){reg.pushManager.subscribe({userVisibleOnly:true}).then(function(sub){console.log('Endpoint URL: ',sub.endpoint);notifications_enabled=true;fetch("registerNotification.php?new",{method:'POST',body:JSON.stringify(sub),headers:new Headers({'Content-Type':'application/json'})}).then(console.log("Wyslano")).catch(function(error){console.error('Error:',error)}).then(function(response){console.log('Success:',response)});}).catch(function(e){if(Notification.permission==='denied'){console.warn('Permission for notifications was denied');ui.createToast("Brak uprawnień :(");}else{console.error('Unable to subscribe to push',e);ui.createToast("Wystąpił nieznany błąd :(");}});})}}
function dbg_clearCache(){return;}
function updateData(){location.reload();}
function tempTest(){o="";o+="in:"+window.innerWidth;o+=",ou:"+window.outerWidth;o+=",ih:"+window.innerHeight;o+=",oh:"+window.outerHeight;o+=",dpr:"+window.devicePixelRatio;o+=",dw:"+document.width;o+=",sw:"+screen.width;o+=",aw:"+screen.availWidth;alert(o);}
function detectIE(){var ua=window.navigator.userAgent;var msie=ua.indexOf('MSIE ');if(msie>0){return parseInt(ua.substring(msie+5,ua.indexOf('.',msie)),10);}
var trident=ua.indexOf('Trident/');if(trident>0){var rv=ua.indexOf('rv:');return parseInt(ua.substring(rv+3,ua.indexOf('.',rv)),10);}
return false;}
if((window.chrome)&&(navigator.userAgent.indexOf("Windows NT 6")!==-1)){document.getElementsByClassName("print_icon")[0].className="print_icon_compatible";document.getElementsByClassName("print_icon_compatible")[0].innerHTML="&#xe800;";document.getElementsByClassName("settings_icon")[0].className="settings_icon_compatible";document.getElementsByClassName("settings_icon_compatible")[0].innerHTML="&#xe801;";}
if(detectIE()){console.log("Uzywasz IE, wspolczuje...");document.getElementsByClassName("print_icon")[0].className="print_icon_compatible";document.getElementsByClassName("print_icon_compatible")[0].innerHTML="&#xe800;";document.getElementsByClassName("settings_icon")[0].className="settings_icon_compatible";document.getElementsByClassName("settings_icon_compatible")[0].innerHTML="&#xe801;";}
if(window.addEventListener){var kkeys=[],asdasd="38,38,40,40,37,39,37,39,66,65";window.addEventListener("keydown",function(e){kkeys.push(e.keyCode);if(kkeys.toString().indexOf(asdasd)>=0){scrollTo(0,0);document.body.innerHTML='<div style="z-index: 99999999;position: absolute;top: 0;left: 0;width: 100%;height: 100%;"><iframe src="aee/" style="width: 100%;height: 100%;border-style:none"></iframe></div>'+document.body.innerHTML;scrollTo(0,0);kkeys=[];}},true);}