const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const Review = require("./review.js");


//schema of database collection

const listingSchema = new Schema({

    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
  url:String,
  filename : String,
},
    price:Number,
    location:String,
    country:String,
    reviews:[   // this is a way to write a review schema in side a listings schema

        {
            type:Schema.Types.ObjectId,
            ref:"review",
        },
    ],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
   
    


});

//mongoosh midilware when delet a listing the all listing reviews also delete
listingSchema.post("findOneAndDelete", async (Listing) => {
    if(Listing){
        await Review.deleteMany({_id : {$in: Listing.reviews}});

    }
});


 const Listing = mongoose.model("Listing" , listingSchema );// This tells Mongoose to create a model based on the schema you defined earlier (listingSchema).
           //  The first argument "Listing" is the model name.
          // Mongoose will automatically create a MongoDB collection called listings (it makes it lowercase and plural).
          // Now you can use Listing to interact with the listings collection in your database. 





          //Now export the  Listing 
 module.exports= Listing;
//  This exports the Listing model so that it can be used in other files of your project.

 // You can now import it using:



