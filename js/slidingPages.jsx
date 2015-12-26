(function() {
var Router = ReactRouter;

var DefaultRoute = Router.DefaultRoute,
	Link = Router.Link,
	Route = Router.Route,
	RouteHandler = Router.RouteHandler;

var SlidingPages = React.createClass({
	getInitialState() {
		return {position: 0, maxPages: 2}
	},
	
	goRight() {
		if (!this.state.position + 1 >= this.state.maxPages)
			this.setState({position: this.state.position + 1});
	},
	
	goLeft() {
		if (!this.state.position - 1 < 0)
			this.setState({position: this.state.position - 1});
	},
	
	render() {
		var position = this.state.position,
			view = position === 0 ? <LeftView /> : <RightView />,
			btns = [],
			headerOrb = position === 0 ? "headerOrbLeft" : "headerOrbRight";
		if (position !== 0) btns.push(
			<div className="leftBtnWrapper btnWrapper" onClick={this.goLeft}>
				<div className="leftBtn"></div>
			</div>
		);
		if (position !== this.state.maxPages - 1) btns.push(
			<div className="rightBtnWrapper btnWrapper" onClick={this.goRight}>
				<div className="rightBtn"></div>
			</div>
		);
		return (
			<div id="page">
				<div id="header">
					<div id="headerOrb" className={headerOrb}></div>
				</div>
				{btns}
				{view}
				<div id="footer"></div>
			</div>
		)
	}
});

var Header = React.createClass({
	render() {
		return (
			<div id="header">
				<div id="headerOrb" className="headerOrbLeft"></div>
			</div>
		);
	}
});

var LeftView = React.createClass({
	render() {
		var nonesense = [],
			amountOfNonesense = Math.floor(Math.random() * 5 + 3);
		for (var i = 0; i < amountOfNonesense; i++) nonesense[i] = <div key={i} className="nonesenseLine"></div>;
		return (
			<div id="leftView" className="view">
				<div className="twoColumns">
					<div className="leftColumn">
						{nonesense}
					</div>
					<div className="rightColumn"></div>
				</div>
			</div>
		);
	}
});

var RightView = React.createClass({
	render() {
		var nonesense = [],
			amountOfNonesense = Math.floor(Math.random() * 5 + 3);
		for (var i = 0; i < amountOfNonesense; i++)
			nonesense[i] = <div key={i} className="nonesenseLine"></div>;
		return (
			<div id="rightView" className="view">
				<div className="twoColumns">
					<div className="leftColumn"></div>
					<div className="rightColumn">
						{nonesense}
					</div>
				</div>
			</div>
		);
	}
});

React.render(
	<SlidingPages />,
	document.getElementById('wrapper')
);

})();