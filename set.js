function set(){
    var t = document.getElementById("ut").value*24*60*60;
    var ts = document.getElementById("uts").value*60*60/100;
	var vs = document.getElementById("uvs").value/100000;
    var rot = document.getElementById("urot").value;
    



    localStorage.setItem("t", t);
    localStorage.setItem("ts", ts);
    localStorage.setItem("vs", vs);
    localStorage.setItem("rot", rot);
    location.reload(); 

}
