/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	app.ALL_roommateS = 'all';
	app.ACTIVE_roommateS = 'active';
	app.COMPLETED_roommateS = 'completed';
	var roommateFooter = app.roommateFooter;
	var roommateItem = app.roommateItem;

	var ENTER_KEY = 13;

	var roommateApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_roommateS,
				editing: null,
				newroommate: ''
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_roommateS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_roommateS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_roommateS})
			});
			router.init('/');
		},

		handleChange: function (event) {
			this.setState({newroommate: event.target.value});
		},

		handleNewroommateKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newroommate.trim();

			if (val) {
				this.props.model.addroommate(val);
				this.setState({newroommate: ''});
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		},

		toggle: function (roommateToToggle) {
			this.props.model.toggle(roommateToToggle);
		},

		destroy: function (roommate) {
			this.props.model.destroy(roommate);
		},

		edit: function (roommate) {
			this.setState({editing: roommate.id});
		},

		save: function (roommateToSave, text) {
			this.props.model.save(roommateToSave, text);
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			this.props.model.clearCompleted();
		},

		render: function () {
			var footer;
			var main;
			var roommates = this.props.model.roommates;

			var shownroommates = roommates.filter(function (roommate) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_roommateS:
					return !roommate.completed;
				case app.COMPLETED_roommateS:
					return roommate.completed;
				default:
					return true;
				}
			}, this);

			var roommateItems = shownroommates.map(function (roommate) {
				return (
					<roommateItem
						key={roommate.id}
						roommate={roommate}
						onToggle={this.toggle.bind(this, roommate)}
						onDestroy={this.destroy.bind(this, roommate)}
						onEdit={this.edit.bind(this, roommate)}
						editing={this.state.editing === roommate.id}
						onSave={this.save.bind(this, roommate)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			var activeroommateCount = roommates.reduce(function (accum, roommate) {
				return roommate.completed ? accum : accum + 1;
			}, 0);

			var completedCount = roommates.length - activeroommateCount;

			if (activeroommateCount || completedCount) {
				footer =
					<roommateFooter
						count={activeroommateCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}

			if (roommates.length) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeroommateCount === 0}
						/>
						<ul className="roommate-list">
							{roommateItems}
						</ul>
					</section>
				);
			}

			return (
				<div>
					<header className="header">
						<h1>Roommate Shopping List</h1>
						<input
							className="new-roommate"
							placeholder="What do we need?"
							value={this.state.newroommate}
							onKeyDown={this.handleNewroommateKeyDown}
							onChange={this.handleChange}
							autoFocus={true}
						/>
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});

	var model = new app.roommateModel('react-roommates');

	function render() {
		React.render(
			<roommateApp model={model}/>,
			document.getElementsByClassName('roommateapp')[0]
		);
	}

	model.subscribe(render);
	render();
})();
