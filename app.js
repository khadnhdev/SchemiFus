const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const config = require('./config');
const routes = require('./routes');

const app = express();

// Cấu hình ứng dụng
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình EJS và express-layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Sử dụng routes
app.use('/', routes);

// Khởi động server
app.listen(config.port, () => {
  console.log(`Server đang chạy tại http://localhost:${config.port}`);
}); 