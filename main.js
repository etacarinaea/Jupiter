/* Orbital period and semi-major axis from http://ssd.jpl.nasa.gov/horizons.cgi
 */

var t=0, tzer, vs=0.00012, ts=180, rot=0, def = Math.PI/2;
var year = 2015, month = 0, day = 17, hour = 0, minute = 0;
var usrbg=true, usropac=true;
var dotamount = 50;
var dotcurrentypos = [dotamount];
var dotcurrentxpos = [dotamount];
var mouse = {
	x: 0,
	y: 0
};

var satellites = [];

satellites[0] = {
		Name:"Io",
		Period:152853.5232,
		SemiMajorAxis:421769,
		SatPANG:110.296
}

satellites[1] = {
		Name:"Europa",
		Period:306876.384,
		SemiMajorAxis:671079,
		SatPANG:111.178
}

satellites[2] = {
		Name:"Ganymede",
		Period:618153.3792,
		SemiMajorAxis:1070042.8,
		SatPANG:110.685
}

satellites[3] = {
		Name:"Callisto",
		Period:1441931.1552,
		SemiMajorAxis:1883000,
		SatPANG:111.256
}

/* just here to test
satellites[4] = {
		Name:"Earth",
		Period:31536000,
		SemiMajorAxis:149513000,
		SatPANG:40
} */


// display size of sats (defined by css)
var csssize = [];


var xPos = [satellites.length];
var yPos = [satellites.length];
for(var i=0; i<satellites.length; i++){
	xPos[i]=0;
	yPos[i]=0;
}

// offset
var Xo = window.innerWidth/2;
var Yo = window.innerHeight/2;




/* get user input, convert them to usable units and assign them to variables
 */
function set(){
	tzer = t;
	t = document.getElementById("ut").value;
	if(t.charAt(0)=="d"){
		uday = parseFloat(t.substr(1,2));
		umonth = parseFloat(t.substr(4,2))-1;
		uyear = parseFloat(t.substr(7,4));
		var userDate = new Date(uyear,umonth,uday);
		var startDate = new Date(2015,0,17);
		t = Math.round((userDate.getTime() - startDate.getTime())/(24*60*60*1000));
	}
	ts = document.getElementById("uts").value;
	vs = document.getElementById("uvs").value/100000;
	rot = document.getElementById("urot").value;
	checkIfInUndef();
	ts = ts*60*60/100;
}


/* check whether input variables are undefined
 */
function checkIfInUndef(){
	if(!t){
		t = tzer;
	}else{
		t = t*24*60*60;
	}
	if(!vs){
		vs = 0.00012;
	}
	if(!ts){
		ts = 5;
	}
	if(!rot){
		rot = 0;
	}
}


/* create an HTML table and fill it with the values from sat_names, period
 * and semimajoraxis
 */
function table(){
	var td = "</td><td>";
	var table = "<table><tr><td>Name</td><td>Orbital Period (d)</td>"+
		"<td>Semi-Major Axis (km)</td></tr>";
	for(var i=0; i<satellites.length; i++){
		table += "<tr><td>" + satellites[i].Name + td +
			Math.round(satellites[i].Period/60/60/24*1000)/1000 + td +
		satellites[i].SemiMajorAxis + "</td></tr>";
	}
	table += "</table>";
	document.getElementById("tablediv").innerHTML = table;
}


/* create needed HTML-Elements for a sat
 */
function createSat (sat) {
	var div = document.createElement("div");
	div.setAttribute("id", sat.Name+"DIV");
	document.getElementById("satellites").appendChild(div);
	var span = document.createElement("span");
	span.setAttribute("id", sat.Name+"Name");
	span.appendChild(document.createTextNode(sat.Name));
	document.getElementById(sat.Name+"DIV").appendChild(span);
	var boundingbox = document.createElement("div");
	boundingbox.className = "orbb";
	document.getElementById("orbits").appendChild(boundingbox);
}

function parallax (amount) {
	for(var i=0; i < amount; i++){
		var dotypos = Math.floor(Math.random() * window.innerHeight*1.5)-window.innerHeight*0.75;
		var dotxpos = Math.floor(Math.random() * window.innerWidth)-window.innerWidth*0.5;
		var dot = document.createElement("div");
		dot.className = "dot";
		dot.style.top = dotypos + "px";
		dot.style.left = dotxpos + "px";
		document.getElementById("parallax").appendChild(dot);
		dotcurrentypos[i] = dotypos;
		dotcurrentxpos[i] = dotxpos;
	}
}


/* add event listeners for keypress, mousemove and click
 */
function addAllEventListeners(){
	document.addEventListener("keypress", function (e){
		var key = e.keyCode;

		switch(key){
			case 13: set(); break;
			case 38: def -= 0.02; break;
			case 40: def += 0.02; break;
			case 37: rot += 1; break;
			case 39: rot -= 1; break;
			case 45: def = Math.PI/2; break;
			case 34: if(usropac){usropac=false}else{usropac=true}; break;
			case 35: if(usrbg){usrbg=false}else{usrbg=true}; break;
		}

		if([13,37,38,39,40,45,34,35].indexOf(key) > -1){
			e.preventDefault();
		}
	});

	document.addEventListener("mousemove", function(e){
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	});
	document.getElementById("mouseboundary").addEventListener("click",
		function(){
			Xo = mouse.x;
			Yo = mouse.y;
		}
	);
}


/* output time to HTML
 */
function outputDate (time){
	minute = time/60;
	var date = new Date(year,month,day,hour,minute);
	document.getElementById("CurrentTime").innerHTML = "Day(rel.) " + 
		Math.round(minute/24/60*100)/100 + "<br> Date: " +
		date;
}


/* return x or y position (m); A: semi-major axis (m),
 * T: orbital period (s), axis: axis to return: 0 for x, else y
 */
function calculatePosition (A, T, spang, axis) {
	spang = spang/57.295;
	if (axis == 0){
		return A*Math.cos(2*Math.PI*(t/T)+spang);
	}else{
		return A*Math.sin(2*Math.PI*(t/T)+spang);
	}
}


/* return x or y position (m) after transformation; x: x-position;
 * y: y-position; angle: by what angle to rotate (deg);
 * axis: axis to return: 0 for x, else y
 */
function transformRotation (x, y, angle, axis) {
	var t_rot= new Array(2);
	for (i=0; i<3; i++){
		t_rot[i] = new Array(2);
	}
	
	// deg to rad
	angle = angle/57.295;

	t_rot[0][0] = Math.cos(angle);
	t_rot[0][1] = Math.sin(angle);
	t_rot[1][0] = 0-Math.sin(angle);
	t_rot[1][1] = Math.cos(angle);
	
	if (axis == 0){
		return t_rot[0][0]*x + t_rot[0][1]*y;
	}else{
		return t_rot[1][0]*x + t_rot[1][1]*y;
	}
}


/* check whether a satellite is in the "background"
 * change the z-index and if opac==true also change the opacity accordingly
 * elements: elements to apply the styles to
 */
function backgroundHandle (elements, opac, index) {
	/* limit max rotation; doing this so it's easier to handle
	 * what's in the background */
	if(def >= Math.PI){
		def = Math.PI;
	}else if(def <= 0){
		def = 0;
	}

	// change z-index of objects in the "background"
	var p = (t % satellites[index].Period)/satellites[index].Period;

	if(p >= 0.5){
		elements.children[index].style.zIndex = 0;
	}else{
		elements.children[index].style.zIndex = 2;
	}
	
	// change opacity of objects in the "background"; 0.65=min opacity
	if(opac){
		var a = 0.5*Math.sin(t*(2*Math.PI)/satellites[index].Period + 
				satellites[index].SatPANG/2)+0.65;
		elements.children[index].style.opacity = a+0.5*Math.cos(2*def)+0.5;
	}else{
		elements.children[index].style.opacity = 1;
	}
}



window.onload =
function main(){
	parallax(dotamount);

	table();

	for(var i=0; i<satellites.length; i++){
		createSat(satellites[i]);
	}

	addAllEventListeners();

	// all satellites grouped in a DOM element
	var satgroup = document.getElementById("satellites");

	for(var i=0; i<satellites.length; i++){
		element = document.getElementById(satellites[i].Name+"DIV");
		style = window.getComputedStyle(element);
		csssize[i] = style.getPropertyValue("height").replace("px","");
	}

	// calculate position and update
	setInterval( function (){
		for(var i=0; i<satellites.length; i++){
			xPos[i] = calculatePosition(satellites[i].SemiMajorAxis,
				satellites[i].Period, satellites[i].SatPANG, 0);
			yPos[i] = calculatePosition(satellites[i].SemiMajorAxis,
				satellites[i].Period, satellites[i].SatPANG, 1)
				*Math.cos(def);
			// apply position (with transformation) to elements
			satgroup.children[i].style.left = Xo +
				transformRotation(xPos[i], yPos[i], rot, 0) *vs -
				csssize[i]/2 + "px";
			satgroup.children[i].style.top  = Yo +
				transformRotation(xPos[i], yPos[i], rot, 1) *vs -
				csssize[i]/2 + "px";

			// sat orb minimum bounding box
			var orbitbbgroup = document.getElementById("orbits");

			orbitbbgroup.children[i].style.height = Math.abs(
				satellites[i].SemiMajorAxis*2 *Math.cos(def) *vs) + "px";
			orbitbbgroup.children[i].style.width = satellites[i].SemiMajorAxis*
				2 *vs +"px";
			orbitbbgroup.children[i].style.left = Xo -
				satellites[i].SemiMajorAxis*vs -1 + "px";
			orbitbbgroup.children[i].style.top = Yo + (
				-satellites[i].SemiMajorAxis + (satellites[i].SemiMajorAxis*2 -
				Math.abs(satellites[i].SemiMajorAxis*2*Math.cos(def)))/2)*vs -
				1 + "px";
			if(Math.cos(def)<0){rot += 180;}
			orbitbbgroup.children[i].style.webkitTransform = "rotate(" +
				-rot + "deg)";
			orbitbbgroup.children[i].style.MozTransform = "rotate(" +
				-rot + "deg)";
			orbitbbgroup.children[i].style.transform = "rotate(" +
				-rot + "deg)";
			if(Math.cos(def)<0){rot -= 180;}
			orbitbbgroup.children[i].style.borderRadius = Math.abs(
				satellites[i].SemiMajorAxis*vs) + "px / " + 
				Math.abs(satellites[i].SemiMajorAxis*Math.cos(def)*vs) + "px";


			document.getElementById("Jupiter").style.left = Xo -10 + "px";
			document.getElementById("Jupiter").style.top = Yo -10 + "px";
			document.getElementById("ref").style.top = Yo -1 + "px";
			// innerWidth + (JupiterWidth/2 - refHeight)
			document.getElementById("ref").style.left = Xo -
				window.innerWidth +8 + "px";
			document.getElementById("ref").style.webkitTransform = "rotate(" +
				-rot + "deg)";
			document.getElementById("ref").style.MozTransform = "rotate(" +
				-rot + "deg)";
			document.getElementById("ref").style.transform = "rotate(" +
				-rot + "deg)";

			if(usrbg){
				backgroundHandle(satgroup, usropac, i);
			}else{
				satgroup.children[i].style.zIndex = 20;
				satgroup.children[i].style.opacity = 1;
			}
		}
	
		
		var dotgroup = document.getElementById("parallax");
		for(var i=0; i < dotamount; i++){
			var tmp = dotcurrentypos[i] - def*100;
			dotgroup.children[i].style.left = transformRotation(dotcurrentxpos[i],tmp,rot,0)
				+ Xo + "px";
			dotgroup.children[i].style.top = transformRotation(dotcurrentxpos[i],tmp,rot,1)
				+ Yo + "px";
		}




		outputDate(t);

		// next time step
		t += ts;
	}, 10);
}
