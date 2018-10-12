/**
 * This JavaScript file manages the location that a user is current at, as well
 * as trigger events that change that state.
 * 
 * @author Brennan Colberg
 * @lastmodifiedDate September 27, 2018
 * @createDate July 26, 2018
 */

"use strict";
! function () {


	/**** VARIABLES ****/

	let locations = undefined;
	let history = []; // with: "location", "molecule", "process", "significance"
	let index = undefined;


	/***** GENERAL TOOLBOX METHODS *****/

	/**
	 * Boilerplate AJAX GET method, used to query for server files.
	 * @param {String} url Target URL to query
	 * @param {Function} onSuccess Function to call when the request comes in
	 */
	function ajaxGET(url, onSuccess) {
		fetch(url, {
				credentials: "include"
			})
			.then(function (r) {
				if (r.status >= 200 && r.status < 300) return r.text();
				else return Promise.reject(
					new Error(r.status + ": " + r.statusText)
				);
			})
			.then(onSuccess)
			.catch(console.log);
	}

	/**
	 * DOM element creation shortcut.
	 * @param {String} tag HTML tag of the new element
	 * @param {String} text Text to put within the new element (optional)
	 * @return {Object} Generated DOM element
	 */
	function ce(tag, text) {
		let element = document.createElement(tag);
		if (text) element.textContent = text;
		return element;
	}

	/**
	 * DOM element selection shortcut, inspired by jQuery.
	 * @param {String} selector CSS selector to query with
	 * @return {Object} Selected DOM element
	 */
	function $(selector) {
		let result = document.querySelectorAll(selector);
		return result.length > 1 ? result : result[0];
	}

	function show(dom) {
		dom.classList.remove("hidden");
	}

	function hide(dom) {
		dom.classList.add("hidden");
	}


	/***** APPLICATION-SPECIFIC METHODS *****/

	/**
	 * Connects up buttons, queries for a JSON from which to load information.
	 */
	window.addEventListener("load", function () {
		ajaxGET("stations.json", load);
		$("#back").onclick = back;
		$("#history").onclick = showHistory;
		$("#next").onclick = next;
	});

	/**
	 * Gets locations from the text of stations.json and starts the program.
	 * @param {String} json Contents of the JSON file
	 */
	function load(json) {
		locations = JSON.parse(json);
		goTo(startingIndex(), true);
		logHistory(locations[index].name);
		updateInformation();
		$("#next").disabled = false;
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
	 * @param {Boolean} noDisplay Optional override for auto-displaying info
	 */
	function goTo(newIndex, noDisplay) {
		index = newIndex;
		if (!noDisplay) updateInformation();
	}

	/**
	 * Logs an event to the history list.
	 * @param {String} name Name of the location to log
	 * @param {[[type]]} message Narrative text to explain movement (optional)
	 */
	function logHistory(name, message) {
		console.log("logging history");
		let result = {};
		result.name = name;
		result.process = message;
		result.molecule = locations[index].molecule;
		result.significance = locations[index].significance;
		result.location = locations[index];
		console.log(result);
		history.unshift(result);
	}


	/**
	 * Moves onwards in time, taking a random step to move towards a different
	 * location (or, sometimes, to stay in the same location).
	 */
	function next() {
		let roll = randomRoll(locations[index]);
		let message = randomMessage(roll);
		goTo(locationIndex(roll.destination));
		logHistory(roll.destination, message);
	}

	/**
	 * Shows the entire history of movements to the user.
	 */
	function showHistory() {

	}

	/**
	 * Goes back a step to the last location.
	 */
	function back() {

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

	/**
	 * Fills all elements in the #travel div with information about the current
	 * and recent locations.
	 */
	function updateInformation() {
		console.log(history);
		let location = history[0];
		$("p.location").textContent = location.name;
		$("h2.process").textContent = location.process;
		if (location.molecule) {
			$("p.molecule").textContent = location.molecule;
			show($("tr.molecule"));
		} else hide($("tr.molecule"));
		if (location.significance) {
			$("p.significance").textContent = location.significance;
			show($("tr.significance"));
		} else hide($("tr.significance"));
		console.log($("body"));
		$("body").style.backgroundImage = "url('" + location.location.image + "')";
	}

}();
