var React = require('react');
var Router = require('react-router');

var {RouteHandler} = Router;

module.exports = React.createClass({
  render: function () {
    return (
      <div>
       <div>Home</div>
        <RouteHandler />
      </div>
    );
  }
});
