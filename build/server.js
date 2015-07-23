var koa = require('koa');
var staticServer = require('koa-static');
var app = koa();

app.use(staticServer('./build/public'));

var PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  process.send('online');
  console.log('The server is running at http://localhost:' + PORT);
});
