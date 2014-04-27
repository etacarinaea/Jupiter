// A, T, S from http://ssd.jpl.nasa.gov/horizons.cgi

// global vars
var t = parseFloat(localStorage.getItem("t"))/60/1.769;

var Xo = 225;												// global X-Offset
var Yo = 225;												// global Y-Offset

var vs = 0.00000011;										// scaling factor
var ts = parseFloat(localStorage.getItem("ts"))/100000;	// time scale // unit?

var uJupiter = 126686511;									// Jupiter's standard gravitational parameter (GM)



// specific vars
var T = new Array(		// orbital period in seconds
 152853.5232,			// JI	Io			 1.769138 d
 306876.384,			// JII	Europa		 3.551810 d
 618153.3792,			// JIII	Ganymede	 7.154553 d
1441931.1552			// JIV	Callisto	16.689018 d
);
var A = new Array(		// semi-major axis in m
 421769000,				// JI	Io
 671079000,				// JII	Europa
1070042800,				// JIII	Ganymede
1883000000				// JIV	Callisto
);
var S = new Array(		// radius in km >>>not in use >>>for real size relations
 1821.3,				// JI	Io			+- 0.2
 1565,					// JII	Europa		+- 8
 2634,					// JIII	Ganymede	+- 10
 2403,					// JIV	Callisto	+- 5
71492					// Jupiter			+- 4
);


// scaled
var TIo = T[0]*vs;				// Io's orbital period
var AIo = A[0]*vs;				// Io's semi-major axis
var TEuropa = T[1]*vs;				// Europa's orbital period
var AEuropa = A[1]*vs;				// Europa's semi-major axis
var TGanymede = T[2]*vs;			// Ganymede's orbital period
var AGanymede = A[2]*vs;			// Ganymede's semi-major axis
var TCallisto = T[3]*vs;			// Callisto's orbital period
var ACallisto = A[3]*vs;			// Callisto's semi-major axis


var XIo;						// Io's x coordinate
var YIo;						// Io's y coordinate
var XEuropa;						// Europa's x coordinate
var YEuropa;						// Europa's y coordinate
var XGanymede;						// Ganymede's x coordinate
var YGanymede;						// Ganymede's y coordinate
var XCallisto;						// Callisto's x coordinate
var YCallisto;						// Callisto's y coordinate

var PIo = 0;
var PEuropa = 0;

var TIoC = (2*Math.PI*Math.sqrt(Math.pow(AIo, 3)/uJupiter)/24/60/60);
// Io's orbital period (calculated)


window.onload =function(){
	setInterval(function(){
		t += ts;
			
		XIo = AIo*Math.cos(2*Math.PI*(t/TIo));				// Io X
		YIo = AIo*Math.sin(2*Math.PI*(t/TIo));				// Io Y
		XEuropa = AEuropa*Math.cos(2*Math.PI*(t/TEuropa));		// Europa X
		YEuropa = AEuropa*Math.sin(2*Math.PI*(t/TEuropa));		// Europa Y
		XGanymede = AGanymede*Math.cos(2*Math.PI*(t/TGanymede));	// Ganymede X
		YGanymede = AGanymede*Math.sin(2*Math.PI*(t/TGanymede));	// Ganymede Y
		XCallisto = ACallisto*Math.cos(2*Math.PI*(t/TCallisto));	// Callisto X
		YCallisto = ACallisto*Math.sin(2*Math.PI*(t/TCallisto));	// Callisto Y
		
		document.getElementById("IoDIV").style.left = Xo -2 + XIo + "px";			// set "left"-value for Io
		document.getElementById("IoDIV").style.top = Yo -2 + YIo + "px";			// set "top"-value for Io
		document.getElementById("EuropaDIV").style.left = Xo -1 + XEuropa + "px";		// set "left"-value for Europa
		document.getElementById("EuropaDIV").style.top = Yo -1 +YEuropa + "px";			// set "top"-value for Europa
		document.getElementById("GanymedeDIV").style.left = Xo -4 + XGanymede + "px";		// set "left"-value for Ganymede
		document.getElementById("GanymedeDIV").style.top = Yo -4 + YGanymede + "px";		// set "top"-value for Ganymede
		document.getElementById("CallistoDIV").style.left = Xo -3 + XCallisto + "px";		// set "left"-value for Callisto
		document.getElementById("CallistoDIV").style.top = Yo -3 + YCallisto + "px";		// set "top"-value for Callisto
		
		document.getElementById("CurrentTime").innerHTML = "Day " + Math.round((t*60*1.769)*100)/100;	// display current time
	}, 10);
	document.getElementById("Jupiter").style.left = Xo -15 +"px";						// set "left"-value for Jupiter // -((S[7]*vs)/2)
	document.getElementById("Jupiter").style.top = Yo -15 +"px";						// set "top"-value for Jupiter // -((S[7]*vs)/2)
	// Jupiter's real size // vs must be >=0.0000072 for >1px
	// document.getElementById("Jupiter").style.height = (S[5]*2*1000*vs) +"px";				// set "height"-value for Jupiter
	// document.getElementById("Jupiter").style.width = (S[5]*2*1000*vs) +"px";				// set "width"-value for Jupiter
	// document.getElementById("Jupiter").style.borderRadius = (S[5]*2*1000*vs)/2 +"px";		// set "border-radius"-value for Jupiter
}

