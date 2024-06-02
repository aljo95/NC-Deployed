
//controllers.js 
const express = require("express"); 
const router = express.Router(); 
const User = require("./models"); 
const Messages = require("./messagesModel");
const passport = require("passport"); 
const bcrypt = require("bcrypt"); 
  


///////////////////////////////// EXPERIMENTS
const app = express();

const bodyParser = require('body-parser');
  // support parsing of application/json type post data
  app.use(bodyParser.json());
  //support parsing of application/x-www-form-urlencoded post data
  app.use(bodyParser.urlencoded({ extended: true }));
// User registration route 

/*
router.post('/register', (req, res) => {
    console.log("POSTEDEDED");
})
////////////////////////////////////
*/


var timeStart = 0
router.post('/register', async (req, res) => { 

    let currentTime = (Math.floor((new Date()).getTime() / 1000)) - timeStart;
    if (currentTime < 840) {
        console.log(" CANT CREATE ACCOUNT YET !");
        let responseTime = 840 - currentTime
        return res.status(503).json({ message: "stillTimer", currTime:  responseTime});
    }

    console.log(req.body); 
    const { username, password} = req.body;     
    if (username==="" || password==="") { 
        console.log("FILL BOTH!")
        return res 
            .status(403) 
    } 

    try { 
        // Check if user already exists 
        const existingUser = await User.findOne({ username }); 
        if (existingUser) { 
            console.log("ERROR USERNAME EXISTS");
            
            return res 
                .status(409).json({ message: "exists"}) 
            
        } 
  
        // Hash the password before saving it to the database 
        const salt = await bcrypt.genSalt(15); 
        const hashedPassword = await bcrypt.hash(password, salt); 
  
        // Create and save the new user 
        const newUser = new User({ username, password: hashedPassword }); 
        await newUser.save(); 
        console.log("New user made xD");

        timeStart = Math.floor((new Date()).getTime() / 1000)

        return res.status(200).json({ message: "success" });
    } catch (err) { 
        return res.status(500) //.json({ message: err.message }); 
    } 
}); 
  
// User login route 
router.post(                            // NEED TO FIND USER FROM DATABASE NOT JUST EXPECT IT TO EXIST LOL
    '/login', 
    passport.authenticate("local", { session: true }), //????????????????
    async (req, res) => { 
        
        req.session.name = req.body.username; 
        /*
        console.log(req.session);
        console.log(req.sessionID);
        */
        res.status(200).json({ message: "success" });
    }
); 



router.post('/storeMessage', async (req, res) => {

    // Will return 0 if there are no records!
    let amountOfRecords = await Messages.countDocuments();
    console.log("Amount of documents/records: " + amountOfRecords); //amount before inserting new record

    // Save 10 records (0-9), when reached that count delete 5 first, move 5-9 to 0-4, then add new
    /*
    if (amountOfRecords >= 9) {
        //Remove 0-4
        console.log("Deleting records");
        await Messages.deleteMany({ msgNr: {$lte: 4} });
        //Update 5-9 with msgNr change to 0-4
        for (let i=0; i<5; i++) {
            await Messages.updateOne( { msgNr: i+5 }, { $set: { msgNr: i } } );
        }
        amountOfRecords = await Messages.countDocuments();
    }
    */
    if (amountOfRecords >= 99) {
        //Remove 0-4
        console.log("Deleting records");
        await Messages.deleteMany({ msgNr: {$lte: 49} });
        //Update 5-9 with msgNr change to 0-4
        for (let i=0; i<49; i++) {
            await Messages.updateOne( { msgNr: i+50 }, { $set: { msgNr: i } } );
        }
        amountOfRecords = await Messages.countDocuments();
    }


    if (typeof req.body.message === "string") {     
        const newMsg = new Messages( { text: req.body.message, msgNr: amountOfRecords } );
        await newMsg.save(); 
    }
    else if (typeof req.body.message === "object") {
        req.body.message.msgNr = amountOfRecords;
        const newMsg = new Messages(req.body.message); 
        await newMsg.save(); 
    } 
    else {
        console.log("Could not save history - incompatible data type with model");
        return res.status(500).json({ message: "could not save to mongoDB" });
    }
    return res.status(200).json({ message: "success" });
});


router.get('/getHistory', async (req, res) => {
    console.log("history gotteN^");

    let historyResponseArray = [];
    const fullHistory = await Messages.find();

    //Sort by msgNr property to ensure correctness
    fullHistory.sort((a, b) => a.msgNr - b.msgNr);

    console.log(fullHistory);

    for (let i=0; i<fullHistory.length; i++) {
        if (fullHistory[i].name) {
            let pushObj = { 
                name: fullHistory[i].name, 
                text: fullHistory[i].text,
                time: fullHistory[i].time,
            }
            historyResponseArray.push(pushObj);
        } else {
            // Just pushing the strong for react state format
            historyResponseArray.push(fullHistory[i].text);
        }
    }
    for (let i=0; i<historyResponseArray.length; i++) {
        if (historyResponseArray[i].name) {
            historyResponseArray = historyResponseArray.slice(i);
            break;
        }
    }

    // Correct res format for just array? Include message or status code?
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log(historyResponseArray);
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    res.send(historyResponseArray);
});





router.get('/checkAuth', (req, res) => {

    
    if (req.isAuthenticated()) {
        console.log("LOGGED IN!");
    } else {
        console.log("NOT LOGGED IN :<");
    }
    //console.log(req.session);
   res.send({ username: req.session.name } )
})

  
router.get("/logout", (req, res) => { 
    req.session.destroy(); 
    res.status(200).json({ message: "logout success" }); 
}); 

module.exports = router;  
