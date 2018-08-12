var d = new Date();

function getTextDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	
	if(dd<10) {
		dd = '0'+dd
	} 
	
	if(mm<10) {
		mm = '0'+mm
	} 
	
	today = dd + '.' + mm + '.' + yyyy;
	return(today);
}


var columns = {
	currentDay: d.getDay(),
	activeColumn: 9000,
	table: document.getElementById("maintable"),
	hideAll: function(){
		for (y=0; y<this.table.rows.length; y++){
			for (x=1; x<this.table.rows[y].cells.length; x++){
				this.table.rows[y].cells[x].className = "col_"+x+" hidden";
			}
		}
	},
	showAll: function(){
		for (y=0; y<this.table.rows.length; y++){
			for (x=0; x<this.table.rows[y].cells.length; x++){
				this.table.rows[y].cells[x].className = "col_"+x;
			}
		}
	},
	showSelected: function(){
		if (this.activeColumn == -1){
			this.showAll();
			myTime.checkAll();//Check for current day, only when looking at whole week, otherwise it will show unwanted columns.
			return;
		}

		this.hideAll();
		if (this.activeColumn == 9000){
			cells = document.getElementsByClassName("col_"+this.currentDay)
			for (i=0; i<cells.length; i++){
				cells[i].className = "col_"+this.currentDay;
			}
		}else{
			cells = document.getElementsByClassName("col_"+this.activeColumn)
			for (i=0; i<cells.length; i++){
				cells[i].className = "col_"+this.activeColumn;
			}
		}
		
		if((this.activeColumn == this.currentDay) || (this.activeColumn == 9000)){
			myTime.checkTime();
		}else{
			myTime.clear();
		}
	},
	setActive: function(n){
		/*for(i=-1; i<6; i++){
			document.getElementById("btn_"+i).className="";
		}
		document.getElementById("btn_"+n).className="selected";
		*/
		if (n == 0){
			n = 9000;
		}

		this.activeColumn = n;
		this.showSelected();
	} 
}

var myTime = {
	time: d.getHours() + ":" + d.getMinutes(),
	//time: "10:13", //DEBUG ONLY!!!
	table: document.getElementById("maintable"),
	checkTime: function(){
		for (step in timeSteps){
			if (Date.parse('01/01/1970 '+this.time+':00') < Date.parse('01/01/1970 '+timeSteps[step]+':00')){
				console.log("time = "+this.time)
				if (step%2){
					console.log("Lekcja "+((step-1+2)/2))
					for (y=1; y<this.table.rows.length; y++){
						this.table.rows[y].className = "";
					}
					try {
						this.table.rows[(step-1+2)/2].className = "currentTimeFull";
					} catch (error) {} //Nie ma takiego kroku. To nie wyjatek, ale lapie.
				}else{
					for (y=1; y<this.table.rows.length; y++){
						this.table.rows[y].className = "";
					}
					try {
						this.table.rows[(step-1+3)/2].className = "border-top-blue";
					} catch (error) {}
				}
				break
			}
		}
	},
	checkDate: function(){
		try {
			date = d.getDay();
			for (i=0; i<10; i++){ //WHY!?
				for (j=0; j<document.getElementsByClassName("col_"+date).length; j++){
					if(document.getElementsByClassName("col_"+date).length == 0){
						console.log("IE fix, dt.js, 115. X="+date+" Y="+j);
					}else{
						document.getElementsByClassName("col_"+date)[j].className = "col_"+date+" currentTimeFull";
					}
					
				}
			}
		} catch (error) {
			console.log(error);
		}
	},
	checkAll: function(){
		this.checkDate();
		this.checkTime();
	},
	clear: function(){
		for (y=1; y<this.table.rows.length; y++){
			this.table.rows[y].className = "";
		}	
	}
}
