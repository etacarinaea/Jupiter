function set(){
	var t = document.getElementById("ut").value;
	var ts = document.getElementById("uts").value;
	
	if(t==""){
		t = 0;
	}
	if(ts==""){
		ts = 5;
	}
	
	localStorage.setItem("t", t);
	localStorage.setItem("ts", ts);
	
	location.reload(); 
}