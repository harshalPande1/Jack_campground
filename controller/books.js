const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../cloudinary');
const { tourlist } = require('../database/db');

module.exports.book = async (req, res, next) => {
    const id = req.params.id;
    const result = await tourlist.findOne({ _id: id }).populate({ path: 'Reviews', populate: { path: 'Author' } }).populate('Author');
    if (!result) {
        req.flash('error', 'tour does not exist...')
    }
    res.render('book', { result });
}

module.exports.booking = async (req, res, next) => {
    try {
        const name = req.params.cardName
        let item = await tourlist.findOne({ Name: name })
        res.render('update', { item })
    } catch (err) {
        next(err);
    }
}

module.exports.update = async (req, res, next) => {
    try {
        let delName = req.body.deleteImage;
        let id = req.params.id;
        let updateUser = await tourlist.findByIdAndUpdate({ _id: id }, { ...req.body }, { runValidators: true, new: true })
        const newPic = req.files.map(pic => ({ filename: pic.filename, url: pic.path }));
        updateUser.pics.push(...newPic);
        await updateUser.save();
        if (req.body.deleteImage) {
            for (let filename of delName ){
                await cloudinary.uploader.destroy(filename);
            }
            await updateUser.updateOne({ $pull: { pics: { filename: { $in: delName } } } });
           
        }
        req.flash('success', 'successfully update tour...');
        res.redirect('/');
    } catch (err) {
        next(err);
    }
}
module.exports.delete = async (req, res, next) => {
    try {
        let id = req.params.id;
        const tour = await tourlist.findById(id);
        await tourlist.findByIdAndDelete(id);
        for (let pic of tour.pics ){
            console.log(pic.filename);
            await cloudinary.uploader.destroy(pic.filename);
        }
        req.flash('success', 'successfully deleted tour')
        res.redirect('/');
    } catch (e) {
        next(e)
    }
}