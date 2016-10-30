document.addEventListener("DOMContentLoaded", function(event) {
	var toyLinks = document.getElementsByClassName("linkLI"),
		heightOffset = toyLinks[0].clientHeight / 2;
	document.getElementById("listHoverMarker").style.top = heightOffset;
	for (var i = 0; i < toyLinks.length; i++) {
		toyLinks[i].addEventListener("mouseover", (function(position) {
			return function() {
				document.getElementById("listHoverMarker").style.top = position + "px";
			}
		}) (heightOffset));
		heightOffset += toyLinks[i].clientHeight;
	}
});