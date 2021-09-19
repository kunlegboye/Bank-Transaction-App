import createError from 'http-errors';
import express from 'express';
import mongoose from "mongoose"
import dotenv from "dotenv"
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import balanceRouter from './routes/balanceRouter';
import transactionRouter from './routes/transactionRouter';

dotenv.config();
const app = express();

mongoose
 .connect(process.env.DBNAME_URL as string , {
 useNewUrlParser: true,
 useCreateIndex: true,
 useFindAndModify: false,
 useUnifiedTopology: true,
 })
 .then(() => {console.log('Database connected succesful!')})
 .catch((error) => console.log(error, 'here'));

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', balanceRouter);
app.use('/route', transactionRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
