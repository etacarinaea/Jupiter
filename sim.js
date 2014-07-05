/* A, T, I, S, uJupiter from http://ssd.jpl.nasa.gov/horizons.cgi
 * exception: Themisto (JXVIII)
 * in real life, Themisto's orbit does not resemble a circle , it is used here as an example for visualising
 * a satellites inclination/to test correct implementation
 */


// variables
var t = parseFloat(localStorage.getItem("t"))/60/1.769138*10000000;     // *10000000 = for easier user input
var mode = parseInt(localStorage.getItem("mode"));


var dayIntervalCountIo = 0;
var dayIntervalCountEuropa = 0;
var IoDay = 1.769138/60/1.769138*10000000;
var EuropaDay = 3.551810/60/1.769138*10000000;
var currentIoDay = 0;

var viewportY = 1;              // viewport

var increment = 0.05;
var swap = 0;


var mod1 = 1;
var mod2 = 0;
var mod3 = 0;

var Xo = 225;                                                   // global X-Offset
var Yo = 275;                                                   // global Y-Offset

var vs = parseFloat(localStorage.getItem("vs"))/100000000;      // scaling factor
var ts = parseFloat(localStorage.getItem("ts"))*100;            // time scale
var rot = parseFloat(localStorage.getItem("rot"));



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

// constants

var uJupiter = 126686511;       // Jupiter's standard gravitational parameter (GM)

var T = new Array(              // orbital period in seconds
152853.5232,                    // JI       Io            1.769138  d
306876.384,                     // JII      Europa        3.551810  d
618153.3792,                    // JIII     Ganymede      7.154553  d
1441931.1552,                   // JIV      Callisto     16.689018  d
11220768                        // JXVIII   Themisto    129.87      d
);
var A = new Array(              // semi-major axis in m
421769000,                      // JI       Io
671079000,                      // JII      Europa
1070042800,                     // JIII     Ganymede
1883000000,                     // JIV      Callisto
7393216000                      // JXVIII
);
var I = new Array(              // inclination (deg)
0.036,                          // JI       Io
0.464,                          // JII      Europa
0.186,                          // JIII     Ganymede
0.281,                          // JIV      Callisto
47.48                           // JXVIII
);
var S = new Array(              // radius in km ***not in use; for real size relations***
1821.3,                         // JI       Io          +- 0.2
1565,                           // JII      Europa      +- 8
2634,                           // JIII     Ganymede    +- 10
2403,                           // JIV      Callisto    +- 5
71492                           // Jupiter              +- 4
);
var displaySize = new Array(    // diameter used for displaying satellites (pixel)
4,                              // JI       Io
2,                              // JII      Europa
8,                              // JIII     Ganymede
6,                              // JIV      Callisto
2                               // JXVIII   Themisto
);



var xPos = new Array(0,0,0,0,0);
var yPos = new Array(0,0,0,0,0);


var secondsToDays = 1/24/60/60;





function calcOrbitalPeriod(A){
    var T = 2*Math.PI*Math.sqrt(Math.pow((A/1000), 3)/uJupiter)*secondsToDays;     // 1000 = m to km
    return T;
}

function calcPos(A, T, type, viewport){
    if (type == 0){
        var x = A*Math.cos(2*Math.PI*(t/T));
        return x;
    }else if(type == 1){
        var y = A*Math.sin(2*Math.PI*(t/T));
        return y*mod1*viewport;
    }
}

function transformRotation(x, y, angle, type){
    var t_rot=new Array(2);                 // 1D array 1x2
    for (i=0; i <3; i++){                   // 2D array 2x2
        t_rot[i]=new Array(2);
    }
    
    angle = angle/57.295;                   // /57.295 = deg to rad
    
    t_rot[0][0] = Math.cos(angle);
    t_rot[0][1] = Math.sin(angle);
    t_rot[1][0] = 0-Math.sin(angle);
    t_rot[1][1] = Math.cos(angle);
    
    if (type == 0){
        var ddx = t_rot[0][0]*x + t_rot[0][1]*y;
        return ddx;
    }else if(type == 1){
        var ddy = t_rot[1][0]*x + t_rot[1][1]*y;
        return ddy;
    }
}

function init(){
    var satgroup = document.getElementById("satellites");
    for(var i = 0; i < 5; i++){
        satgroup.children[i].style.height = displaySize[i] + "px";
        satgroup.children[i].style.width = displaySize[i] + "px";
    }
}




window.onload =
function main(){

    init();
    
    document.addEventListener("keypress", function moveViewport(e){
        var key = e.keyCode;
        
        if(swap >= 0 || swap <= -2){increment = 0 - increment;}
        switch(key){
            case 38: viewportY += increment; swap += increment; break;
            case 40: viewportY -= increment; swap -= increment; break;
            case 37: rot += 1; break;
            case 39: rot -= 1; break;
        }
        
        if([37, 38, 39, 40].indexOf(key) > -1) {
            e.preventDefault();
        }
        init();
    });
    
    
    var satgroup = document.getElementById("satellites");
    
    
    // modifiers for changing the observer position
    if(mode==1){            // top
        mod1=1;
        mod2=0;
    }else if(mode==2){      // side
        mod1=0;
        mod2=1;
        // make moons translucent to distinguish them when they overlap each other
        var satOpacity = 0.5;
        for(var i = 0; i < 5; i++){
            satgroup.children[i].style.opacity=satOpacity;
        }
    }else if(mode==3){      // earth ***not implemented***
        mod3=1;
    }
    
    
    setInterval(
        function(){
            
            // for meters
            if(dayIntervalCountIo<=IoDay){
                dayIntervalCountIo += ts;
                dayIntervalCountEuropa += ts;
            }else if(dayIntervalCountEuropa<=EuropaDay){
                dayIntervalCountIo = 0;
            }else{
                dayIntervalCountEuropa = 0;
            }
            
            
            for(var i = 0; i < 5; i++){
                xPos[i] = calcPos(A[i], T[i], 0, 1);
                yPos[i] = calcPos(A[i], T[i], 1, viewportY);
                if(i==4){rot = rot+30;}
                satgroup.children[i].style.left = Xo -(displaySize[i]/2) + transformRotation(xPos[i], yPos[i], rot, 0) *vs + "px";
                satgroup.children[i].style.top  = Yo -(displaySize[i]/2) + transformRotation(xPos[i], yPos[i], rot, 1) *vs + "px";
                if(i==4){rot = rot-30;}
            }
            
            document.getElementById("CurrentTime").innerHTML  = "Day " + Math.round((t*60*1.769138)*100/10000000)/100;                      // display current time (in days)
            document.getElementById("MeterIo").value = dayIntervalCountIo/176913.8;
            document.getElementById("MeterEuropa").value = dayIntervalCountEuropa/355181;
            //document.getElementById("MeterGanymede").value = dayIntervalCount/715455.3;
            //document.getElementById("MeterCallisto").value = dayIntervalCount/1668901.8;
            //document.getElementById("MeterThemisto").value = dayIntervalCount/12987000;
            
            
            // next time step
            t += ts;
    }, 10);
    
    // static objects
    document.getElementById("Jupiter").style.left = Xo -10 +"px";                           // set "left"-value for Jupiter // -10 = displaysize/2 // -((S[5]*vs)/2)
    document.getElementById("Jupiter").style.top = Yo -10 +"px";                            // set "top"-value for Jupiter // -((S[5]*vs)/2)
    document.getElementById("ref").style.top = Yo -1 +"px";                                 // set "top"-value for ref
    // Jupiter's real size
    // document.getElementById("Jupiter").style.height = (S[5]*2*1000*vs) +"px";
    // document.getElementById("Jupiter").style.width = (S[5]*2*1000*vs) +"px";
    // document.getElementById("Jupiter").style.borderRadius = (S[5]*2*1000*vs)/2 +"px";
}
