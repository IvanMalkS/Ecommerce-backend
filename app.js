const express = require('express');
const morgan = require('morgan');
const productsRouter = require('./routes/productRoutes');
const usersRouter = require('./routes/userRoutes');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const reviewsRouter = require('./routes/reviewRoutes');
const path = require('path');
const cartRoutes = require('./routes/cartRouts');

const app = express();

app.set('view engine', 'pug');
//access to static directory
app.use(express.static(path.join(__dirname, 'public')));
app.set('index', path.join(__dirname, 'views'));

// security middleware
app.use(helmet());

// Enable CORS for all routes
app.use(cors());

// To parse JSON bodies and limit body size
app.use(
  bodyParser.json({
    limit: '100mb',
  }),
);

//Data sanitization against SQL injection attacks
app.use(mongoSanitize());

//Data sanitization against XSS attacks
app.use(xss());

// To parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

//Prevent parameter pollution attacks
app.use(
  hpp({
    whitelist: ['price', 'category', 'description', 'brand', 'countInStock'],
  }),
);

// To log requests in console
if(process.env.NODE_ENV !== "product") app.use(morgan('dev'));


// rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again after an hour',
});
app.use('/api', limiter);

app.get('/', (req, res) => {
  res.status(200).render('index');
});

//api routes
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/reviews', reviewsRouter);
// TEST ROUTE!!!
//app.use('/api/cart', cartRoutes);

//catching all not valid pages
app.all('*', (req, res, next) => {
  next(new AppError('Page does not exist', 404));
});
app.use(globalErrorHandler);

module.exports = app;
