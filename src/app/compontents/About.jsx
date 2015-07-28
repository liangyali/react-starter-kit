var React = require('react');
var Router = require('react-router');

var {RouteHandler} = Router;

module.exports = React.createClass({
  render: function () {
    return (
      <div>
       <div><h1>About</h1></div>
        <RouteHandler />
      </div>
    );
  }
});
