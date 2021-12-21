const express = require('express')
const app = express()
require('dotenv').config()
const session = require('express-session')
const flash = require('connect-flash')


// Database Intergration
require('./middlewares/dbconnection')


// For setting static routes for images CSS and in-browser JS
app.set('view engine', 'ejs')
app.use('/', express.static(__dirname + '/Public'))


// For creating sessions
app.use(
    session({
        secret:process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false
    })
)


// For flashing messages
app.use(flash())

// For post and put requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', require('./routes/homeroute'))
app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))
app.use('/home', require('./routes/home'))


app.use((req, res)=>{
    res.status(404).send('Error 404: Route not found.')
})

// For starting the server
app.listen(process.env.PORT, ()=>{
    console.log(`Server started at port ${process.env.PORT}`);
})