"use strict";
!function() {
	
	// uses brennancolberg/jsdb for abbreviated and AJAX functions
	
	let locations = undefined;
	let index = undefined;
	
	window.addEventListener("load", function() {
		
		ajaxGET("stations.json", load);
		
		$("next").onclick = proceed;
		
	});
	
	function load(json) {
		locations = JSON.parse(json);
		goTo(startingIndex());
		logHistory(locations[index].name);
		$("next").disabled = false;
	}
	
	function startingIndex() {
		return Math.floor(Math.random() * locations.length);
	}
	
	function goTo(newIndex) {
		index = newIndex;
		$("location").textContent = locations[index].name;
	}
	
	function logHistory(name, message) {
		let history = $("history");
		if (message) {
			let ul = ce("ul");
			let liMessage = ce("li");
			let messageText = ctn(" " + message);
			liMessage.appendChild(messageText);
			ul.appendChild(liMessage);
			history.lastChild.appendChild(ul);
		}
		let liName = ce("li");
		let locationSpan = ce("strong", name);
		liName.appendChild(locationSpan);
		history.appendChild(liName);
		history.scrollTop = history.scrollHeight;
	}
	
	function proceed() {
		let roll = randomRoll(locations[index]);
		let message = randomMessage(roll);
		goTo(locationIndex(roll.destination));
		logHistory(roll.destination, message);
	}
	
	function randomRoll(location) {
		let rolls = location.rolls;
		let totalWeight = 0;
		for (let i = 0; i < rolls.length; i++) {
			totalWeight += rolls[i].weight;
		}
		let chosenWeight = Math.random() * totalWeight;
		for (let i = 0; i < rolls.length; i++) {
			chosenWeight -= rolls[i].weight;
			if (chosenWeight < 0) {
				return rolls[i];
			}
		}
	}
	
	function randomMessage(roll) {
		return roll.messages[Math.floor(roll.messages.length * Math.random())];
	}
	
	function locationIndex(location) {
		for (let i = 0; i < locations.length; i++) {
			if (locations[i].name === location) {
				return i;
			}
		}
		return null;
	}
	
}();