(function() {
var Router = ReactRouter;

var DefaultRoute = Router.DefaultRoute,
	Link = Router.Link,
	Route = Router.Route,
	RouteHandler = Router.RouteHandler;

var LeftPage = React.createClass({
	render: function () {
		return (
			<div id="leftPage">
				<div className="rightBtnWrapper">
					<div className="rightBtn"></div>
				</div>
				<div className="twoColumns">
					<div id="leftColumn"></div>
					<div id="rightColumn">
						<div className="nonesenseLine"></div>
						<div className="nonesenseLine"></div>
						<div className="nonesenseLine"></div>
					</div>
				</div>
				<div id="footer"></div>
			</div>
		);
	}
});

React.render(
	<div id="page">
		<div id="header"></div>
		<LeftPage />
	</div>,
	document.getElementById('wrapper')
);

})();