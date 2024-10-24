const express = require("express");
const session = require('express-session');
const routerTodoList = require("./Router/toDoData");
const routerUser = require("./Router/user");
const bodyParser = require('body-parser');
const db = require("./Connector/db");
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');



const app = express();
const PORT = process.env.PORT || 3000;


db().then(() => {
    console.log('Database connected');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'nat-mes12',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        maxAge: 900000 
    }
}));

const checkCookieAndRedirect = (req, res, next) => {
    
    if ((req.session.userId || req.cookies.username) ) {
        
        return res.redirect('/home'); 
    } else {
       
        return res.redirect('/login'); 
    }
};
app.get('/', checkCookieAndRedirect);
app.get('/home', (req, res) => {
    res.send("Welcome to the Homepage!"); 

});
app.get('/login', (req, res) => {
    res.send("Please log in!"); 
});

app.use("/data", routerTodoList);
app.use("/user", routerUser);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});