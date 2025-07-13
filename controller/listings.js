
const Listing = require("../models/listing.js");


// ............................................

module.exports.index = async (req , res) =>{
   
   const allListings = await Listing.find({});
   
   res.render("listings/index.ejs", {allListings});
};


// ............................................

module.exports.RenderNewForm = (req,res) =>{
   console.log(req.user);
   
    res.render("listings/new.ejs");
   
};


// ............................................



module.exports.showListing = async (req ,res)=>{
    let {id} = req.params;  // nessery to pars the data app.use(express.urlencoded({extended:true}));
    const listing =  await Listing.findById(id)
    .populate({path:"reviews",populate:{
        path:"author"},
    })
    .populate("owner");
    if(!listing){
         req.flash("error", "Listing you Request is dose not exist!" );
         return res.redirect("/listings");
    }
     console.log(listing);
    // res.render("/listing/show.ejs",{ Listing });
       res.render("listings/show.ejs", { listing });

};


// ............................................


module.exports.createListing = async (req,res)=>{
   // let {title,description,image,price,country,location} = req.body;
   // let listing= req.body.listing;


   let url = req.file.path;
   let filename = req.file.filename;
   const newlisting =  new Listing(req.body.listing);
   newlisting.owner = req.user._id;
    newlisting.image = {url , filename};
    
    await newlisting.save();
    req.flash("success", "New Listing Created!" );
   res.redirect("/listings");


};

// ............................................



module.exports.renderEditForm = async (req,res)=>{

    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
    req.flash("error" , "listing you requested for does not exist!");
    return res.redirect("/listings");

    }
    let originalImageUrl = listing.image.url
     originalImageUrl = originalImageUrl.replace("/upload" ,"/upload/w_250" )
    res.render("listings/edit.ejs",{listing ,originalImageUrl},);
    

};

// ............................................


 module.exports.updateListing = async(req,res)=>{
      
    let {id}= req.params;
    let listing= await Listing.findByIdAndUpdate(id,{ ...req.body.listing});


    if(typeof req.file !=="undefined"){

      let url = req.file.path;
   let filename = req.file.filename;
   const newlisting =  new Listing(req.body.listing);

   listing.image ={url,filename};
   listing.save();

    }
     
    
      req.flash("success", "Listing is Updated" );

       res.redirect(`/listings/${id}`);
    

};

// ............................................

 module.exports.destroyListing = async (req,res) => {
    
    let {id} = req.params;

   let deletedListing = await Listing.findByIdAndDelete(id);
   req.flash("success", "Listing is Delete!" );
    res.redirect("/listings");

};