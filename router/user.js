const express = require('express');
const route = express.Router();
const path = require('path');
const AppError = require('../AppError');
const handleErr = require('../handleError');
const Joi = require('joi');
const ejs = require('ejs');
const User = require('../database/user');
const passport = require('passport');
const localStargey = require('passport-local');


const validateData = ((req, res, next) => {
    const validateSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required()
    }).required();
    const { error } = validateSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((ele) => ele.message).join(',');
        throw new AppError(400, msg);
    } else {
        next();
    }
})


route.get('/register', (req, res) => {
    res.render('register')
});

route.post('/register', validateData, async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({
            email: email,
            username: username
        });
       const registerUser = await User.register(newUser, password)
        req.logIn(registerUser,(err)=>{
            if(err){
                next(err)
            }else{
                res.redirect('/');
            }
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/user/register')
    }

});

route.get('/login', (req, res) => {
    res.render('login')
});

route.post('/login', passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: 'invalid username or password' }), async (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    req.flash('success',`welcome ${req.user.username}`)
    res.redirect(redirectUrl);
});

route.get('/logout', async (req, res) => {
    try {
        await req.logOut();
        req.flash('success', 'goodbye...');
        res.redirect('/user/login');
    } catch (error) {
        next(error)
    }
   
})






module.exports = route