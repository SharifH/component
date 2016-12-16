/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.roommateModel = function (key) {
		this.key = key;
		this.roommates = Utils.store(key);
		this.onChanges = [];
	};

	app.roommateModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.roommateModel.prototype.inform = function () {
		Utils.store(this.key, this.roommates);
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.roommateModel.prototype.addroommate = function (title) {
		this.roommates = this.roommates.concat({
			id: Utils.uuid(),
			title: title,
			completed: false
		});

		this.inform();
	};

	app.roommateModel.prototype.toggleAll = function (checked) {
		// Note: it's usually better to use immutable data structures since they're
		// easier to reason about and React works very well with them. That's why
		// we use map() and filter() everywhere instead of mutating the array or
		// roommate items themselves.
		this.roommates = this.roommates.map(function (roommate) {
			return Utils.extend({}, roommate, {completed: checked});
		});

		this.inform();
	};

	app.roommateModel.prototype.toggle = function (roommateToToggle) {
		this.roommates = this.roommates.map(function (roommate) {
			return roommate !== roommateToToggle ?
				roommate :
				Utils.extend({}, roommate, {completed: !roommate.completed});
		});

		this.inform();
	};

	app.roommateModel.prototype.destroy = function (roommate) {
		this.roommates = this.roommates.filter(function (candidate) {
			return candidate !== roommate;
		});

		this.inform();
	};

	app.roommateModel.prototype.save = function (roommateToSave, text) {
		this.roommates = this.roommates.map(function (roommate) {
			return roommate !== roommateToSave ? roommate : Utils.extend({}, roommate, {title: text});
		});

		this.inform();
	};

	app.roommateModel.prototype.clearCompleted = function () {
		this.roommates = this.roommates.filter(function (roommate) {
			return !roommate.completed;
		});

		this.inform();
	};

})();
