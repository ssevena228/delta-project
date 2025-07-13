//require express 
const express = require("express");
// set Router
const router = express.Router();
const wrapAsync =  require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");

const {isLoggedIn , isOwner ,validateListing} = require("../middleware.js");
const User = require("../models/user");

const listingControl = require("../controller/listings.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({ storage });




// // validate  from  server site vatidation
// const validateListing = (req,res,next) =>{
//     let {error} = listingSchema.validate(req.body);
//    if  (error) {

//     let errMsg = error.details.map((el) => el.message).join(",");

   
//       throw new ExpressError(400, errMsg);
//    } else{
//       next();
//    }

// };



// Now requer all listing router from 


  
  // reformate of same route
    //: INDEX ROUTE,create Route 
  router
   .route("/")
   .get(wrapAsync(listingControl.index)
 )
  .post(isLoggedIn, 
    upload.single('listing[image]'), 
    validateListing,
  wrapAsync(listingControl.createListing)
 );
// .post( ,(req,res) =>{
//   res.send(req.file);
// })

//New route   

router.get("/new", isLoggedIn,listingControl.RenderNewForm);


// id Route ,Update route ,Delete Route

  router.route("/:id" )
  .get(wrapAsync(listingControl.showListing)
)
.put(isLoggedIn,isOwner ,upload.single('listing[image]'),validateListing ,wrapAsync(listingControl.updateListing)
)
.delete(isLoggedIn ,isOwner, wrapAsync (listingControl.destroyListing)
);



// Edit Rout
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControl.renderEditForm)
);




module.exports  = router ;