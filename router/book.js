const express = require('express');
const router = express.Router({ mergeParams: true });
const { tourlist } = require('../database/db');
const path = require('path');
const AppError = require('../AppError');
const handleErr = require('../handleError');
const Joi = require('joi');
const ejs = require('ejs');
const { isLoggedIn , checkPermission} = require('../middelware');
const books = require('../controller/books');
const multer = require('multer')
const fs = require('fs');
const {storage} = require('../cloudinary/index');



const upload = multer({ storage: storage })

//validate tour form
const validationData = (req, res, next) => {
    const ValidationSchema = Joi.object({
        Name: Joi.string().required(),
        Price: Joi.number().required().min(20),
        Location: Joi.string().required(),
        deleteImage : Joi.array()
    }).required();
    
    const { error } = ValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((ele) => ele.message).join(',');
        throw new AppError(400, msg);
    } else {
        next();
    }
}

// get tour card
router.get('/', handleErr(books.book));


//get update tour card
router.get('/:cardName',isLoggedIn,checkPermission,books.booking,    books.booking);


//update tour
router.put('/update',isLoggedIn, upload.array('image'),validationData,checkPermission,  books.update);


//delete tour
router.delete('/delete', isLoggedIn,checkPermission, books.delete)


module.exports = router;