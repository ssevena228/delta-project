//require express 
const express = require("express");
// set Router
const router = express.Router({mergeParams: true});
const wrapAsync =  require("../utils/wrapAsync.js");
const ExpressError =  require("../utils/ExpressError.js");

const {validateReview ,isLoggedIn,isReviewAuthor} =require("../middleware.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const  reviewController = require("../controller/reviews.js");




//Reviews POSt route
router.post("/" ,isLoggedIn,validateReview ,wrapAsync(reviewController.createReview));


//Delete REview Route

router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview)
);




module.exports = router;