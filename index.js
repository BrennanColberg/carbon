/**
 * This JavaScript file manages the location that a user is current at, as well
 * as trigger events that change that state.
 * 
 * @author Brennan Colberg
 * @lastmodifiedDate September 27, 2018
 * @createDate July 26, 2018
 */

"use strict";
!function() {
	
	let locations = undefined;
	let index = undefined;
	
	/**
	 * Connects up buttons, queries for a JSON from which to load information.
	 */
	window.addEventListener("load", function() {
		ajaxGET("stations.json", load);
		$("next").onclick = proceed;
	});
	
	/**
	 * Gets locations from the text of stations.json and starts the program.
	 * @param {String} json Contents of the JSON file
	 */
	function load(json) {
		locations = JSON.parse(json);
		goTo(startingIndex());
		logHistory(locations[index].name);
		$("next").disabled = false;
	}
	
	/**
	 * Chooses a location randomly in which to start the program.
	 * @return {Number} Integer (index) in bounds [0, locations.length - 1]
	 */
	function startingIndex() {
		return Math.floor(Math.random() * locations.length);
	}
	
	/**
	 * Moves the user to a new location.
	 * @param {Number} newIndex Index of the targeted location.
	 */
	function goTo(newIndex) {
		index = newIndex;
		$("location").textContent = locations[index].name;
	}
	
	/**
	 * Logs an event to the history list.
	 * @param {String} name Name of the location to log
	 * @param {[[type]]} message Narrative text to explain movement (optional)
	 */
	function logHistory(name, message) {
		let history = $("history");
		// only creates a message if one is given (allows for starting location)
		// appends message first due to being a fencepost-based system where you
		// do not yet know how the program will move on
		if (message) {
			// creates second-tier UL for the description with a single li
			// inside (which contains the message)
			let ul = ce("ul");
			ul.appendChild(ce("li", message));
			history.lastChild.appendChild(ul);
		}
		// puts name, in bold (strong), inside the history ol
		let liName = ce("li");
		let locationSpan = ce("strong", name);
		liName.appendChild(locationSpan);
		history.appendChild(liName);
		// scrolls to bottom of history (otherwise it wouldn't display properly)
		history.scrollTop = history.scrollHeight;
	}
	
	/**
	 * Moves onwards in time, taking a random step to move towards a different
	 * location (or, sometimes, to stay in the same location).
	 */
	function proceed() {
		let roll = randomRoll(locations[index]);
		let message = randomMessage(roll);
		goTo(locationIndex(roll.destination));
		logHistory(roll.destination, message);
	}
	
	/**
	 * Selects a random location from the potential destinations of a carbon
	 * atom when travelling away from the given location. Accounts for precise
	 * decimal weighting of various options, proportionally.
	 * @param {Object} location Location which the user is currently at
	 * @returns {Object} Chosen roll event
	 */
	function randomRoll(location) {
		let rolls = location.rolls; // array of potentially returned objects
		// tracks total "weight" of various answers (needs total to increment
		// to figure out which is selected
		let totalWeight = 0;
		for (let i = 0; i < rolls.length; i++) {
			totalWeight += rolls[i].weight;
		}
		// chooses random point within the total weight
		let chosenWeight = Math.random() * totalWeight;
		// cycles through potential options' weights in order, to see in which
		// weight "region" the chosen point falls (this way, larger weights are
		// made more likely -- they're given a larger "area" in which the point
		// can potentially fall!)
		for (let i = 0; i < rolls.length; i++) {
			chosenWeight -= rolls[i].weight;
			if (chosenWeight <= 0) {
				return rolls[i];
			}
		}
	}
	
	/**
	 * Chooses a random description for the movement about to occur (as
	 * prescribed by the given roll).
	 * @param {Object} roll Roll event
	 * @return {String} Chosen message
	 */
	function randomMessage(roll) {
		return roll.messages[Math.floor(roll.messages.length * Math.random())];
	}
	
	/**
	 * Gets index of a given location in the stored data.
	 * @param {Object} location Location of which to find index
	 * @return {Number} Integer index
	 */
	function locationIndex(location) {
		for (let i = 0; i < locations.length; i++) {
			if (locations[i].name === location) {
				return i;
			}
		}
		return null;
	}
	
}();