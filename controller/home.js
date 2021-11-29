/** @format */

const { review, tourlist } = require("../database/db");
const mpxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocoder = mpxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
module.exports.home = (req, res) => {
  tourlist.find({}, (e, result) => {
    if (e) {
      res.send(e);
    } else {
      res.render("home", { result: result });
    }
  });
};

module.exports.about = (req, res) => {
  res.render("about");
};
module.exports.registrantion = (req, res) => {
  res.render("registrantion");
};
module.exports.contact = (req, res) => {
  res.render("contact");
};
module.exports.form = async (req, res, next) => {
  try {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.Name,
        limit: 1,
      })
      .send();
    const newData = new tourlist({
      Name: req.body.Name,
      Price: req.body.Price,
      Location: req.body.Location,
    });
    newData.geometry = geoData.body.features[0].geometry;
    newData.Author = req.user._id;
    newData.pics = req.files.map((file) => ({
      filename: file.filename,
      url: file.path,
    }));
    await newData.save();

    req.flash("success", "new tour successfully saved...");
    res.redirect("/");
  } catch (e) {
    next(e);
  }
};
