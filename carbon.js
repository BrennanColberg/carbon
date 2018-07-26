"use strict";
!function() {
	
	window.addEventListener("load", function() {
		
		ajaxGET("stations.json", function(json) {
			qs("body").textContent = JSON.stringify(JSON.parse(json));
		});
		
	});
	
}();