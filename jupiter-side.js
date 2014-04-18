// uJupiter, R, T, S from wikipedia.org

// global vars
var t = 0;							// day

var Xo = 225;						// global X-Offset
var Yo = 225;						// global Y-Offset

var vs = 0.00011;					// scaling factor
var ts = 0.0000005;				// time scale // unit?

var uJupiter = 126686534;			// Jupiter's standard gravitational parameter



// specific vars
var T = new Array(		// orbital period in days
1.769,					// Io
3.551,					// Europa
7.155,					// Ganymede
16.69					// Callisto
);
var R = new Array(		// orbit "radius"(=semi-major axis) in km
421800,					// Io
671100,					// Europa
1070400,				// Ganymede
1882700					// Callisto
);
var S = new Array(		// mean diameter in km >>>not in use >>>for real size relations
3643.2,					// Io mean
3121.6,					// Europa
5262.4,					// Ganymede
4820.6,					// Callisto
3660.0,					// Io 1
3637.4,					// Io 2
3630.6,					// Io 3
139822.0				// Jupiter
);


// scaled
var TIo = T[0]*vs;					// Io's orbital period
var RIo = R[0]*vs;					// Io's orbit "radius"(=semi-major axis)
var TEuropa = T[1]*vs;				// Europa's orbital period
var REuropa = R[1]*vs;				// Europa's orbit "radius"(=semi-major axis)
var TGanymede = T[2]*vs;			// Ganymede's orbital period
var RGanymede = R[2]*vs;			// Ganymede's orbit "radius"(=semi-major axis)
var TCallisto = T[3]*vs;			// Callisto's orbital period
var RCallisto = R[3]*vs;			// Callisto's orbit "radius"(=semi-major axis)
// array?


var XIo;							// Io's x coordinate
var YIo;							// Io's y coordinate
var XEuropa;						// Europa's x coordinate
var YEuropa;						// Europa's y coordinate
var XGanymede;						// Ganymede's x coordinate
var YGanymede;						// Ganymede's y coordinate
var XCallisto;						// Callisto's x coordinate
var YCallisto;						// Callisto's y coordinate


var TIoC = (2*Math.PI*Math.sqrt(Math.pow(RIo, 3)/uJupiter)/24/60/60);
//									// Io's orbital period (calculated)


window.onload =function(){
	setInterval(function(){
		t += ts;
			
		XIo = RIo*Math.cos(2*Math.PI*(t/TIo));					// Io
		YIo = RIo*Math.sin(2*Math.PI*(t/TIo));					// Io Y
		XEuropa = REuropa*Math.cos(2*Math.PI*(t/TEuropa));		// Europa
		YEuropa = REuropa*Math.sin(2*Math.PI*(t/TEuropa));		// Europa Y
		XGanymede = RGanymede*Math.cos(2*Math.PI*(t/TGanymede));	// Ganymede
		YGanymede = RGanymede*Math.sin(2*Math.PI*(t/TGanymede));	// Ganymede Y
		XCallisto = RCallisto*Math.cos(2*Math.PI*(t/TCallisto));	// Callisto
		YCallisto = RCallisto*Math.sin(2*Math.PI*(t/TCallisto));	// Callisto Y
			
		document.getElementById("IoDIV").style.left = Xo -2 + XIo + "px";					// set "left"-value for Io
		document.getElementById("IoDIV").style.top = Yo -2 + "px";							// set "top"-value for Io
		document.getElementById("EuropaDIV").style.left = Xo -1 + XEuropa + "px";			// set "left"-value for Europa
		document.getElementById("EuropaDIV").style.top = Yo -1 + "px";						// set "top"-value for Europa
		document.getElementById("GanymedeDIV").style.left = Xo -4 + XGanymede + "px";		// set "left"-value for Europa
		document.getElementById("GanymedeDIV").style.top = Yo -4 + "px";					// set "top"-value for Europa
		document.getElementById("CallistoDIV").style.left = Xo -3 + XCallisto + "px";		// set "left"-value for Europa
		document.getElementById("CallistoDIV").style.top = Yo -3 + "px";					// set "top"-value for Europa
	}, 10);
	document.getElementById("Jupiter").style.left = Xo -25 +"px";			// set "left"-value for Jupiter
	document.getElementById("Jupiter").style.top = Yo -25 +"px";			// set "top"-value for Jupiter
}

