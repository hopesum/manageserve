var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods')

var orderRouter = require('./routes/order')
var shopRouter = require('./routes/shop')
var frontuserRouter = require('./routes/frontuser')
var frontaddressRouter = require('./routes/frontaddress')
var frontlikeRouter = require('./routes/frontlike')
var frontcartRouter = require('./routes/frontcart')
var app = express();

// var server = app.listen(8083)
// var io=require('socket.io')().listen(server,{  cors: {
//   origin: "http://localhost:8080"
// }})
// io.on('connection',(socket)=>{
//   console.log('a user connected')
// })
// let httpServer = require('http').Server();
// let io = require('socket.io')(httpServer);
// httpServer.listen(3000,{  cors: {
//   origin: "http://localhost:8080/#/pages/backface/backface"
// }});

// io.on('connection', socket=>{
//   socket.on('random', value=>{
//     console.log(value);
//     if(value>0.95){
//       if(typeof socket.warnign==='undefined'){
//         socket.warning = 0;// socket对象可用来存储状态和自定义数据
//       }
//       setTimeout(()=>{
//         socket.emit('warn', ++socket.warning);
//       }, 1000);
//     }
//   });
// });
// import { createServer } from "http";
// import { Server } from "socket.io";
// const httpServer = http.createServer();
// const io = require('socket.io')(httpServer, {
  // cors: {
  //   origin: "http://localhost:8080"
  // }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter)

app.use('/order', orderRouter)
app.use('/shop', shopRouter)
app.use('/frontuser', frontuserRouter)
app.use('/frontaddress',frontaddressRouter)
app.use('/frontlike',frontlikeRouter)
app.use('/frontcart',frontcartRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




// 监听端口
app.listen(5000, () => {
  console.log('服务器启动成功， 地址是: http://127.0.0.1:5000/')
})

module.exports = app;