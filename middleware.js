const Listing = require("./models/listing");
const Review = require("./models/review");
const  {listingSchema ,reviewSchema}= require("./schema.js");
const ExpressError =  require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req,res,next)=>{
   
   console.log(req.user);
     if(!req.isAuthenticated()){
      // redirectUrl
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing!" );
       return res.redirect("/login");

    }
    next();
}


module.exports.saveRedurectUrl = (req,res,next) =>{
   if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;

   }
   next();
};


// middle are for check is owner or not  have a permission to edit the listion or not 

module.exports.isOwner = async (req,res,next )=> {
   let {id} = req.params;
    let listing =await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error" , "you don't have permossion to edit ");
      return res.redirect(`/listings/${id}`);
    }
    next();
   
}


// validate  from  server site vatidation
module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
   if  (error) {

    let errMsg = error.details.map((el) => el.message).join(",");

   
      throw new ExpressError(400, errMsg);
   } else{
      next();
   }

};


//validation from reviews from serversite
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
   if  (error) {

    let errMsg = error.details.map((el) => el.message).join(",");

   
      throw new ExpressError(400, errMsg);
   } else{
      next();
   }

};



// chect this one was a review author or not if Yess then they have right to delete a review 

module.exports.isReviewAuthor = async (req,res,next )=> {
   let {id,reviewId} = req.params;
    let review =await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error" , "you don'te this review ");
      return res.redirect(`/listings/${id}`);
    }
    next();
   
}


