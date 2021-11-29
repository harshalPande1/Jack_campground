if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const AppError = require('./AppError');
const handleErr = require('./handleError');
const methodOverride = require('method-override');
const morgan = require('morgan')
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const router = require('./router/book.js');
const reviewRoute = require('./router/reviews');
const passport = require('passport');
const localStargey = require('passport-local');
const User = require('./database/user');
const userRoute = require('./router/user.js')
const { isLoggedIn , checkPermission } = require('./middelware');
const controller = require('./controller/home');
const multer = require('multer');
const { storage } = require('./cloudinary/index');
const upload = multer({storage});




// midelware
app.use('/css', express.static(path.join(__dirname, "/Public/css")));
app.use('/css/bootstrap', express.static(path.join(__dirname, "./node_modules/bootstrap/dist/css/bootstrap.min.css")));
app.use('/js', express.static(path.join(__dirname, "./node_modules/bootstrap/dist/js/bootstrap.min.js")));
app.use(express.static(__dirname+'/Public'))


app.use(methodOverride('_method'));
app.use(morgan('tiny'));


const sessionconfig = ({
    secret: 'jack',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
})

app.use(session(sessionconfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStargey(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.userlogin = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// ejs Template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/user', userRoute);
app.use('/book/:id/', router);
app.use('/review', reviewRoute);



//validate tour form
const validationData = (req, res, next) => {
    const ValidationSchema = Joi.object({
        Name: Joi.string().required(),
        Price: Joi.number().required().min(20),
        Location: Joi.string().required(),
        deleteImage : Joi.array()
    }).required()
    deleteImage : Joi.array()
    const { error } = ValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((ele) => ele.message).join(',');
        console.log(msg);
        throw new AppError(400, msg);
    } else {
        next();
    }
}


//home
app.get('/',controller.home);
app.get('/about',controller.about);
app.get('/registrantion', isLoggedIn,controller.registrantion);
app.get('/contact',controller.contact);
//submit tour form
app.post('/form', upload.array('pic'), validationData, controller.form);




//handling error
app.all('*', (req, res, next) => {
    next(new AppError(404, 'page not found... '))
})

//handling error middelware
app.use((err, req, res, next) => {
    const { status = 500, message = 'some error' } = err;
    console.log(err);
    res.status(status).render('./util/error', { errName: err.message });
    next()
});



app.listen(3000, () => {
    console.log('server running on port 3000');
});