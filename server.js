// ++++++ dev tools ++++++
const util = require('util');

// ++++++ General Express config ++++++
const express         = require('express'),
      bodyParser      = require('body-parser'),
      logger          = require('morgan'),
      app             = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// ++++++ Handlebars templating engine ++++++
const hbs = require('express-handlebars');

app.engine('hbs', hbs({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
	// helpers: {
	// 	stripeRows: require('./views/helpers/stripe-rows'),
	// 	hideReferences: require('./views/helpers/hide-references')
	// }
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

//++++++ ROUTES ++++++
const getRoutes = require('./routes/get');
const postRoutes = require('./routes/post');

app.use(getRoutes);
app.use(postRoutes);

// ++++++ SERVER LISTEN ++++++
const PORT = process.env.PORT || 5000;

app.listen(PORT, function() {
  console.log("server.js listening to your mom on PORT: " + PORT);
});
