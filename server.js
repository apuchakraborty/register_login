const express = require('express');
const connectDB = require('./config/db');
//const middleware = require('./middleware/auth')
//console.log(middleware);

const app = express();
// connect db
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('api running'));

// define route from router/api/
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
// end route
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running ${PORT}`));