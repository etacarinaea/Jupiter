// A, T, I, S, uJupiter from http://ssd.jpl.nasa.gov/horizons.cgi
// exception: Themisto (XVIII)
// Themisto's real orbit doesn't resemble a circle at all, it's just used as an example for visualising a satellites inclination

// variables
var t = parseFloat(localStorage.getItem("t"))/60/1.769*10000000;
var mode = parseInt(localStorage.getItem("mode"));

var mod1 = 1;
var mod2 = 0;
var mod3 = 0;

var Xo = 225;                                                   // global X-Offset
var Yo = 275;                                                   // global Y-Offset

var vs = parseFloat(localStorage.getItem("vs"))/100000000;      // scaling factor
var ts = parseFloat(localStorage.getItem("ts"))*100;            // time scale // unit?

var uJupiter = 126686511;                                       // Jupiter's standard gravitational parameter (GM)


// defaults
if(!t){
    t = 0;
}
if(!ts && ts!=0){
    ts = 0.00005;
}
if(!vs){
    vs = 0.00000002;
}
if(!mode){
    mode = 1;
}


var T = new Array(          // orbital period in seconds
152853.5232,                // JI       Io          1.769138  d
306876.384,                 // JII      Europa      3.551810  d
618153.3792,                // JIII     Ganymede    7.154553  d
1441931.1552,               // JIV      Callisto    16.689018 d
11220768                    // JXVIII               129.87    d
);
var A = new Array(          // semi-major axis in m
421769000,                  // JI    Io
671079000,                  // JII    Europa
1070042800,                 // JIII    Ganymede
1883000000,                 // JIV    Callisto
7393216000                  // JXVIII
);
var I = new Array(          // inclination (deg)
0.036,                      // JI       Io
0.464,                      // JII      Europa
0.186,                      // JIII     Ganymede
0.281,                      // JIV      Callisto
47.48                       // JXVIII
);
var S = new Array(          // radius in km >>>not in use >>>for real size relations
1821.3,                     // JI       Io          +- 0.2
1565,                       // JII      Europa      +- 8
2634,                       // JIII     Ganymede    +- 10
2403,                       // JIV      Callisto    +- 5
71492                       // Jupiter              +- 4
);


// scaled
var TIo = T[0];                         // Io's orbital period
var AIo = A[0];                         // Io's semi-major axis
var TEuropa = T[1];                     // Europa's orbital period
var AEuropa = A[1];                     // Europa's semi-major axis
var TGanymede = T[2];                   // Ganymede's orbital period
var AGanymede = A[2];                   // Ganymede's semi-major axis
var TCallisto = T[3];                   // Callisto's orbital period
var ACallisto = A[3];                   // Callisto's semi-major axis
var TThemisto = T[4];                   // Themisto's orbital period
var AThemisto = A[4];                   // Themisto's semi-major axis


var XIo;                                // Io's x coordinate
var YIo;                                // Io's y coordinate
var XEuropa;                            // Europa's x coordinate
var YEuropa;                            // Europa's y coordinate
var XGanymede;                          // Ganymede's x coordinate
var YGanymede;                          // Ganymede's y coordinate
var XCallisto;                          // Callisto's x coordinate
var YCallisto;                          // Callisto's y coordinate
var XThemisto;                          // Themisto's x coordinate
var YThemisto;                          // Themisto's y coordinate

var TIoC = (2*Math.PI*Math.sqrt(Math.pow(AIo, 3)/uJupiter)/24/60/60);
// Io's orbital period (calculated)


window.onload =function(){
    // mod
    if(mode==1){            // top
        mod1=1;
        mod2=0;
    }else if(mode==2){      // side
        mod1=0;
        mod2=1;
        // make moons translucent
        document.getElementById("IoDIV").style.opacity=0.5;
        document.getElementById("EuropaDIV").style.opacity=0.5;
        document.getElementById("GanymedeDIV").style.opacity=0.5;
        document.getElementById("CallistoDIV").style.opacity=0.5;
        document.getElementById("ThemistoDIV").style.opacity=0.5;
    }else if(mode==3){      // earth
        mod3=1;
    }
    
    setInterval(function(){
        t += ts;
            
        XIo = AIo*Math.cos(2*Math.PI*(t/TIo));                      // Io X
        YIo = AIo*Math.sin(2*Math.PI*(t/TIo));                      // Io Y
        XEuropa = AEuropa*Math.cos(2*Math.PI*(t/TEuropa));          // Europa X
        YEuropa = AEuropa*Math.sin(2*Math.PI*(t/TEuropa));          // Europa Y
        XGanymede = AGanymede*Math.cos(2*Math.PI*(t/TGanymede));    // Ganymede X
        YGanymede = AGanymede*Math.sin(2*Math.PI*(t/TGanymede));    // Ganymede Y
        XCallisto = ACallisto*Math.cos(2*Math.PI*(t/TCallisto));    // Callisto X
        YCallisto = ACallisto*Math.sin(2*Math.PI*(t/TCallisto));    // Callisto Y
        XThemisto = AThemisto*Math.cos(2*Math.PI*(t/TThemisto));    // Themisto X
        YThemisto = AThemisto*Math.sin(2*Math.PI*(t/TThemisto));    // Themisto Y
        
        document.getElementById("IoDIV").style.left = Xo -2 + XIo*vs + "px";                                                        // set "left"-value for Io
        document.getElementById("IoDIV").style.top = Yo -2 + YIo*vs*mod1 + "px";                                                    // set "top"-value for Io
        document.getElementById("EuropaDIV").style.left = Xo -1 + XEuropa*vs + "px";                                                // set "left"-value for Europa
        document.getElementById("EuropaDIV").style.top = Yo -1 + YEuropa*vs*mod1 + "px";                                            // set "top"-value for Europa
        document.getElementById("GanymedeDIV").style.left = Xo -4 + XGanymede*vs + "px";                                            // set "left"-value for Ganymede
        document.getElementById("GanymedeDIV").style.top = Yo -4 + YGanymede*vs*mod1 + "px";                                        // set "top"-value for Ganymede
        document.getElementById("CallistoDIV").style.left = Xo -3 + XCallisto*vs + "px";                                            // set "left"-value for Callisto
        document.getElementById("CallistoDIV").style.top = Yo -3 + YCallisto*vs*mod1 + "px";                                        // set "top"-value for Callisto
        document.getElementById("ThemistoDIV").style.left = Xo -1 + XThemisto*vs + "px";                                            // set "left"-value for Themisto
        document.getElementById("ThemistoDIV").style.top = Yo -1 + (YThemisto+(YThemisto*(I[4]/90)-YThemisto)*mod2)*vs + "px";      // set "top"-value for Themisto
        
        document.getElementById("CurrentTime").innerHTML = "Day " + Math.round((t*60*1.769)*100/10000000)/100;                      // display current time
    }, 10);
    
    // static objects
    document.getElementById("Jupiter").style.left = Xo -10 +"px";                           // set "left"-value for Jupiter // -((S[5]*vs)/2)
    document.getElementById("Jupiter").style.top = Yo -10 +"px";                            // set "top"-value for Jupiter // -((S[5]*vs)/2)
    document.getElementById("ref").style.top = Yo -1 +"px";                                 // set "top"-value for ref
    // Jupiter's real size
    // document.getElementById("Jupiter").style.height = (S[5]*2*1000*vs) +"px";            // set "height"-value for Jupiter
    // document.getElementById("Jupiter").style.width = (S[5]*2*1000*vs) +"px";             // set "width"-value for Jupiter
    // document.getElementById("Jupiter").style.borderRadius = (S[5]*2*1000*vs)/2 +"px";    // set "border-radius"-value for Jupiter
}
