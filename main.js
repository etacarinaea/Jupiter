
// Jupiter's standard gravitational parameter
var uJupiter = 126686511;

var t=0, tzer, vs=0.00007, ts=180, rot=0, def = 0;
var mouse = {
	x: 0,
	y: 0
};


// array [ JI, JII, JIII, JIV, JXVIII ]
// satellite names
var sat_names = [
		"Io",
		"Europa",
		"Ganymede",
		"Callisto",
		"Themisto"
]
// orbital period (s)
var period = [
		152853.5232,
		306876.384,
		618153.3792,
		1441931.1552,
		11220768
];
// semi-major axis (km)
var semimajoraxis = [
		421769,
		671079,
		1070042.8,
		1883000,
		7393216
];

// display size of sats
var csssize = [];


var xPos = [sat_names.length];
var yPos = [sat_names.length];
for(var i=0; i<sat_names.length; i++){
	xPos[i]=0;
	yPos[i]=0;
}

// offset
var Xo = 300;
var Yo = 275;



/* create an HTML table and fill it with the values from sat_names, period
 * and semimajoraxis
 */
function table(){
	var td = "</td><td>";
	var table = "<table><tr><td>Name</td><td>Orbital Period (d)</td>"+
		"<td>Semi-Major Axis (km)</td></tr>";
	for(var i=0; i<sat_names.length; i++){
		table += "<tr><td>" + sat_names[i] + td +
			Math.round(period[i]/60/60/24*1000)/1000 + td +
		semimajoraxis[i] + "</td></tr>";
	}
	table += "</table>";
	document.getElementById("tablediv").innerHTML = table;
}


/* check whether input variables are undefined
 */
function checkIfInUndef(){
	if(!t){
		t = tzer;
	}
	if(!vs){
		vs = 0.00007;
	}
	if(!ts){
		ts = 5;
	}
	if(!rot){
		rot = 0;
	}
}


/* returns orbital period (s); A: semi-major axis (km),
 * u: standard gravitational parameter

function calculateOrbitalPeriod (A, u) {
	return 2*Math.PI*Math.sqrt(Math.pow(A,3)/u);
}

 * currently using values from 'period'-array instead
 */


/* return x or y position (m); A: semi-major axis (m),
 * T: orbital period (s), axis: axis to return: 0 for x, else y
 */
function calculatePosition (A, T, axis) {
	if (axis == 0){
		return A*Math.cos(2*Math.PI*(t/T));
	}else{
		return A*Math.sin(2*Math.PI*(t/T));
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
	angle = angle/57.295

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


/* get user input, convert them to usable units and assign them to variables
 */
function setto(){
	tzer = t;
	t = document.getElementById("ut").value*24*60*60;
	ts = document.getElementById("uts").value;
	vs = document.getElementById("uvs").value/100000;
	rot = document.getElementById("urot").value;
	checkIfInUndef();
	ts = ts*60*60/100;
}




window.onload =
function main(){
	table();
	// move viewport
	document.addEventListener("keypress", function (e){
		var key = e.keyCode;

		switch(key){
			case 38: def += 0.05; break;
			case 40: def -= 0.05; break;
			case 37: rot += 1; break;
			case 39: rot -= 1; break;
			case 13: setto(); break;
			case 45: def = Math.PI/2; break;
		}

		if([13,37,38,39,40,45].indexOf(key) > -1){
			e.preventDefault();
		}
	});
	
	// get the mouse position
	document.addEventListener("mousemove", function(e){
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	});
	document.getElementById("mouseboundary").addEventListener("click",
			function(){
				Xo = mouse.x;
				Yo = mouse.y;
			}
	);

	// all satellites grouped in a DOM element
	var satgroup = document.getElementById("satellites");
	for(var i=0; i<sat_names.length; i++){
		element = document.getElementById(sat_names[i]+"DIV");
		style = window.getComputedStyle(element);
		csssize[i] = style.getPropertyValue("height").replace("px","");
	}

	// calculate position and update
	setInterval( function (){
		for(var i=0; i< sat_names.length; i++){
			xPos[i] = calculatePosition(semimajoraxis[i], period[i], 0);
			yPos[i] = calculatePosition(semimajoraxis[i], period[i], 1)
				*Math.cos(def);
			if(sat_names[i]=="Themisto"){rot = rot+47.48}
			satgroup.children[i].style.left = Xo +
				transformRotation(xPos[i], yPos[i], rot, 0) *vs + "px";
			satgroup.children[i].style.top  = Yo +
				transformRotation(xPos[i], yPos[i], rot, 1) *vs -
				csssize[i]/2 + "px";
			if(sat_names[i]=="Themisto"){rot = rot-47.48}

			document.getElementById("Jupiter").style.left = Xo -10 +"px";
			document.getElementById("Jupiter").style.top = Yo -10 +"px";
			document.getElementById("ref").style.top = Yo -1 +"px";

			/* limit max rotation, doing this so it's easier to handle
			   what's in the background */
			if(def >= Math.PI){
				def = Math.PI;
			}else if(def <= 0){
				def = 0;
			}


			// change z-index of objects in the "background"
			b = (t % period[i])/period[i];

			
			if(b >= 0.5){
				satgroup.children[i].style.zIndex = "-20";
			}else{
				satgroup.children[i].style.zIndex = "20";
			}
			
			// change opacity of objects in the "background"
			a = 0.5*Math.sin(t*(2*Math.PI)/period[i])+0.65;
			satgroup.children[i].style.opacity = a+0.5*Math.cos(2*def)+0.5;
		}
		
		document.getElementById("CurrentTime").innerHTML = "Day " + 
			Math.round(t/24/60/60*100)/100;

		// next time step
		t += ts;
	}, 10);


	// static	
}
