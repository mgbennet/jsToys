document.addEventListener("DOMContentLoaded", function(event) {
	var listItems = document.getElementsByClassName("toyLI");
	var heightOffset = listItems[0].clientHeight/2;
	document.getElementById("listBlock").style.top = heightOffset;
	for(var i = 0; i<listItems.length; i++) {
		listItems[i].addEventListener("mouseover", (function(position) {
			return function() {
				document.getElementById("listBlock").style.top = (position+"px");
			}
		}) (heightOffset));
		heightOffset += listItems[i].clientHeight;
	}
});