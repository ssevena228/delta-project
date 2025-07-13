if(process.env.NODE_ENV != "production"){
   require("dotenv").config();
}



console.log(process.env);
// const port = process.env.PORT || 8080;



const  express = require("express");
const app = express();
const mongoose = require("mongoose");

const wrapAsync =  require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");


//require listing Router
const listingRouter  = require("./routes/listing.js");

//requere reviews router
 const reviewRouter = require("./routes/review.js");

 //requere user router
 const userRouter = require("./routes/user.js");

 //require session
 const session = require("express-session");
 const MongoStore = require('connect-mongo');


 // require flash
  const flash = require("connect-flash");

  //require Pasport , pasport-local , user
  const passport = require("passport");
  const LocalStrategy = require("passport-local");
  const User = require("./models/user.js"); 



//to setup ejs 
const path = require("path");
const methodOverride = require("method-override");

// use EJS Mate to one level up use templeating
const ejsMate = require("ejs-mate");


const dbUrl = process.env.ATLASTDB_URL;


main()
.then(() =>{
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main (){
    await mongoose.connect(dbUrl);
}




app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
     mongoUrl: dbUrl,
     crypto:{
         secret:process.env.SECRET,
     },
     touchAfter:24*3600,
  });

  store.on("errer" , () =>{
    console.log("ERROR in  MONGO SESSION STORE", err);
  });

// definde session
  const sessionOptions  = {
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,//today  * 7 days *  24hr * 60min * 60sec * 1000ms

        maxAge:7*24*60*60*1000 //today  * 7 days *  24hr * 60min * 60sec * 1000ms
    }
   } ;

//    app.get("/",(req , res)=>{
//     res.send("sussesfull ");
// });

  
   // now use the session
   app.use(session(sessionOptions));
   //noq use a flash middleware
   app.use(flash());

   app.use(passport.initialize());
   app.use(passport.session());

   passport.use(new LocalStrategy(User.authenticate()));  // use static authenticate method of model in LocalStrategy
   passport.serializeUser(User.serializeUser());
   passport.deserializeUser(User.deserializeUser());// use static serialize and deserialize of model for passport session support

  


// pass messages to views
   app.use((req,res,next)=>{

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user ;
    
    // console.log(res.locals.success);
    next();

   })




   
//    //demo user
//    app.get("/demouser" , async(req,res)=>{

//     let fackUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//    let registeredUser =  await User.register(fackUser , "helloWorld");//register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. 
//  res.send(registeredUser);
    

//    });







// now use listing router for listing

app.use("/listings",listingRouter);

//now use review route for reviews
app.use("/listings/:id/reviews",reviewRouter);

// now use user router for user

app.use("/",userRouter);





app.all("*",(req,res,next) =>{

    next(new ExpressError(404,"page not found!"));
});


app.use((err,req,res,next)=>{
    let  {statusCode =500, message="somthing went worrng"} = err; 

    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});




app.listen(8080,() =>{
    console.log("server is litien to port");
});
