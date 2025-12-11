const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

// middlewares
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const invoiceRoutes = require('./routes/invoice');
const paymentRoutes = require('./routes/payment');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/invoice', invoiceRoutes);
app.use('/payment', paymentRoutes);

app.listen(PORT, ()=> console.log('Server running on http://localhost:'+PORT));
