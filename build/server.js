var koa = require('koa');
var views = require('co-views');
var path = require('path');

var app = koa();

// render views
var render = views(path.join(__dirname, 'public/views'), {
  map: {html: 'swig'}
});

// static server
app.use(require('koa-static')(path.join(__dirname, 'public')));

// render views
app.use(function*() {
  this.body = yield render('index');
});

var PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  process.send('online');
  console.log('The server is running at http://localhost:' + PORT);
});
