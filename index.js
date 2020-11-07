const  express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('./socket.io')(http);
const mongoose = require('mongoose');
const passport = require('passport');

//bring all routes
const auth = require('./routes/auth');
const friends = require('./routes/friends');
const profile = require('./routes/profile');
const chats = require('./routes/chats');

//Middleware for bodyparser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//CORS setup
app.use("*", (req, res, next) => {
    // console.log('MIDDLEWARE IS CALLED ');
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "Content-Type,Access-Control-Allow-Headers,Access-Control-Allow-Headers,Authorization,X-Request-With, token");
    res.setHeader('Access-Control-Allow-Methods', "*");
    next();
})

//mongoDB config
const db = require('./setup/dburl').mongoURL;

//Attempt to connect to database

mongoose.connect(db , {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(()=> console.log(`MongoDB connected successfully`))
    .catch(err =>console.log(err));

//Passport Middleware
app.use(passport.initialize());

const port = process.env.PORT || 5000;

//just for testing -> route

app.get('/',(req,res)=>{
    res.send('Hey there BigStack');
});

// routes
app.use('/auth', auth);
app.use('/friends',friends);
app.use('/profile',profile);
app.use('/chat',chats);

http.listen(port,()=>console.log(`App is running at ${port}`));