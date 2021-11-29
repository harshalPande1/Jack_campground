const express = require('express');
const route = express.Router({mergeParams:true});
const { review, tourlist } = require('../database/db');
const path = require('path');
const AppError = require('../AppError');
const handleErr = require('../handleError');
const Joi = require('joi');
const ejs = require('ejs');
const {isLoggedIn , checkPermission, reviewPermission } = require('../middelware');

//validate tour form
const validationData = (req, res, next) => {
    const ValidationSchema = Joi.object({
        Name: Joi.string().required(),
        Price: Joi.number().required().min(20),
        Location: Joi.string().required(),
        Image: Joi.string().required()
    }).required();
    const { error } = ValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((ele) => ele.message).join(',');
        throw new AppError(400, msg);
    } else {
        next();
    }
}

const reviewValid = (req, res, next) => {
    const reviewValidation = Joi.object({
        body: Joi.string().required(),
        Rating: Joi.number().required().min(1).max(5)
    }).required();
    const { error } = reviewValidation.validate(req.body);
    if (error) {
        const msg = error.details.map((ele) => ele.message).join(',')
        throw new AppError(400, msg)
    } else {
        next();
    }
}

// upload review
route.post('/upload/:id', reviewValid, isLoggedIn ,async (req, res, next) => {
    try {
        const newReview = new review(req.body)
        const tour = await tourlist.findOne({ _id: req.params.id });
        tour.Reviews.push(newReview);
        newReview.Author = req.user._id;
        await tour.save();
        await newReview.save();
        if(!newReview && !tour){
            req.flash('error','review cant upload!.')
        }
        req.flash('success','new review created...');
        res.redirect(`/book/${req.params.id}`);
    } catch (e) {
        next(e);
    }
});

//delete reviews
route.delete('/book/:tourId/review/:reviewId',isLoggedIn, reviewPermission ,async (req, res, next) => {
    const { tourId, reviewId } = req.params
    try { 
        await tourlist.findOneAndUpdate({ _id : tourId }, { $pull: { Reviews : reviewId } });
        await review.findByIdAndDelete(reviewId)
        req.flash('success','review deleted...')
        res.redirect(`/book/${req.params.tourId}`);
    } catch (e) {
        next(e)
    }
});


module.exports = route