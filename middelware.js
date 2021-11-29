const { tourlist , review } = require('./database/db')
module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'u must be sing up first');
        return res.redirect('/user/login');
    }
}


module.exports.checkPermission = async(req,res,next)=>{
    const {id} = req.params;
    const tour = await tourlist.findById(id);
    if(!tour.Author._id.equals(req.user._id)){
        req.flash('error','you dont have permison');
       return res.redirect('/');
    }
    next();
}

module.exports.reviewPermission = async(req,res,next)=>{
    const {reviewId , id } = req.params;
    const ReviewsData = await review.findById(reviewId);
    if(!ReviewsData.Author._id.equals(req.user._id)){
        req.flash('error','you dont have permison');
       return res.redirect('/');
    }
    next();
}