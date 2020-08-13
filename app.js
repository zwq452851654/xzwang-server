var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('jcyx-server:server');
var http = require('http');
const bodyParser = require('body-parser');



var app = express();
var port = normalizePort(process.env.PORT || 9000);
app.set('port', port);
var server = http.createServer(app);
server.listen(port, ()=> {
  console.log('服务器端口号为：'+ port);
});
server.on('error', onError);
server.on('listening', onListening);


app.use(bodyParser.json());//数据JSON类型
app.use(bodyParser.urlencoded({ extended: false }));//解析post请求数据


// 接口对应文件
var indexRouter = require('./routes/index');
var news = require('./routes/home/news');
var nav = require('./routes/home/nav');
var reg = require('./routes/user/index');
var { verifyTokenMiddle } = require("./common/token.js")


// 需要验证token的接口
let apiArr = ['/nav/queryNav']

//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header('Access-Control-Allow-Headers',"Token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
		
		let intercept = false;
		let url = req._parsedUrl.pathname;
		for(let i=0; i<apiArr.length; i++){
			if(url == '/api'+apiArr[i]){
				intercept = true;
				break
			}
		}
		
		if(intercept){
			verifyTokenMiddle(req, res, next, function(data){
				if(data.state){
					next();
				}else{
					res.json(data)
				}
			});
			
		}else{
			next();
		}
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/news', news);
app.use('/api/nav', nav);
app.use('/api/user', reg);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
