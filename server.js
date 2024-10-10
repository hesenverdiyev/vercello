import express from 'express';
import dotenv from "dotenv";
import conn from "./db.js";
import { fork } from 'child_process';
import cookieParser from 'cookie-parser';
import methodOverride from "method-override";
import pageRoute from "./routes/pageRoute.js";
import userRoute from "./routes/userRoute.js";
import candidateRoute from "./routes/candidateRoute.js";
import facebookRoute from "./routes/facebookRoute.js";
import pollRoute from "./routes/pollRoute.js";
import commentRoute from "./routes/commentRoute.js";
import session from 'express-session';
import { checkUser } from "./middlewares/authMiddleware.js";
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// connection to the DB
conn();

const app = express();
const port = process.env.PORT || 3000;

//ejs template engine
app.set('view engine', 'ejs');


//static files middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true, // Set to true for HTTPS connections
        maxAge: 600000, // 10 minute
      },
}));

app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}));
app.use(methodOverride('_method', {
    methods: ['POST','GET'],
}));

//routes
app.use('*', checkUser);
app.use("/", pageRoute);
app.use("/users", userRoute);
app.use("/candidates", candidateRoute);
app.use("/polls", pollRoute);
app.use("/comments", commentRoute);
app.use("/srv/service/social/Facebook/callback/", facebookRoute);

// 404 error handling middleware
app.use((req, res, next) => {
    res.status(404).render('404.ejs');
});


function startBotProcesses() {
    const bot1Process = fork('./bot.js');
    bot1Process.on('message', (message) => {
      console.log('Message from bot.js:', message);
    });
  
    const bot2Process = fork('./bot2.js');
    bot2Process.on('message', (message) => {
      console.log('Message from bot2.js:', message);
    });
  }

startBotProcesses();

//server listening
app.listen(port, ()=> {
    console.log(`App running on port : ${port}`)
});