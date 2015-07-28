var React = require('react');
var Router = require('react-router');

var {Route, HistoryLocation} = Router;

var App = require('./compontents/App.jsx');
var About = require('./compontents/About.jsx');

//test
var routes = (
  <Route name="app" path="/" handler={App}>
    <Route path="about" handler={About}/>
  </Route>
);

//startup
Router.run(routes, HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
