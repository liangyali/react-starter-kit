var React = require('react');
var Router = require('react-router');
var App = require('./compontents/App.jsx');
var {Route, HistoryLocation} = Router;

//test
var routes = (
  <Route name="app" path="/" handler={App}/>
);

//startup
Router.run(routes, HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
