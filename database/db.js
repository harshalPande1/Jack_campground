
const mongoose = require('mongoose');
const user = require('./user')
mongoose.connect("mongodb://127.0.0.1:27017/tourismProject", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log('db is connected...');
    })
    .catch((e) => {
        console.log('db not connected...' + e);
    })

// review Schema
const reviewSchema = mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    Rating: {
        type: Number,
        required: true
    },
    Author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user
    }
});

const review = new mongoose.model('review', reviewSchema);


//tour schema
const tourismSchemma = mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Location: {
        type: String,
        required: true,
    },
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true 
        }
    }
    ,
    Image: {
        type: String,
    },

    Price: {
        type: Number,
        required: true,
        min: 20
    },
    lastDate: {
        type: Date
    },
    Reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: review
    }],
    Author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user
    },
    pics: [{
        filename: String,
        url: String
    }],
})

tourismSchemma.post('findOneAndDelete', async function (doc) {
    await review.deleteMany({
        _id: {
            $in: doc.Reviews
        }
    })
})

const tourlist = mongoose.model('tourList', tourismSchemma);

module.exports = { tourlist, review };