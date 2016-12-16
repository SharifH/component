/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
var app = app || {};

(function () {
	'use strict';

	app.roommateFooter = React.createClass({
		render: function () {
			var activeroommateWord = app.Utils.pluralize(this.props.count, 'item');
			var clearButton = null;

			if (this.props.completedCount > 0) {
				clearButton = (
					<button
						className="clear-completed"
						onClick={this.props.onClearCompleted}>
						Clear completed
					</button>
				);
			}

			var nowShowing = this.props.nowShowing;
			return (
				<footer className="footer">
					<span className="roommate-count">
						<strong>{this.props.count}</strong> {activeroommateWord} left
					</span>
					<ul className="filters">
						<li>
							<a
								href="#/"
								className={classNames({selected: nowShowing === app.ALL_roommateS})}>
									All
							</a>
						</li>
						{' '}
						<li>
							<a
								href="#/active"
								className={classNames({selected: nowShowing === app.ACTIVE_roommateS})}>
									Active
							</a>
						</li>
						{' '}
						<li>
							<a
								href="#/completed"
								className={classNames({selected: nowShowing === app.COMPLETED_roommateS})}>
									Completed
							</a>
						</li>
					</ul>
					{clearButton}
				</footer>
			);
		}
	});
})();
