function set(){
	var t = document.getElementById("ut").value;
	var ts = document.getElementById("uts").value;
	var vs = document.getElementById("uvs").value;
	var mode = document.getElementById("umode").value;
	
	if(mode>=4){
		window.alert("invalid mode, please choose an integer between 1 and 3");
	}else{
		localStorage.setItem("t", t);
		localStorage.setItem("ts", ts);
		localStorage.setItem("vs", vs);
		localStorage.setItem("mode", mode);
		
		location.reload(); 
	}
}