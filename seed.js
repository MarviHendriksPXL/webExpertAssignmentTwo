const dotenv=require("dotenv");
dotenv.config();

const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION ;
const DB_CONNECTION_OPTIONS = JSON.parse(process.env.DATABASE_CONNECTION_OPTIONS);

const Comment = require("./models/commentModel.js");
const mongoose = require("mongoose");
const $console = require("Console");

mongoose.connect(DATABASE_CONNECTION, DB_CONNECTION_OPTIONS).catch((error)=> {
    $console.error(error.message);
    cleanup();
});

async function run() {
    try{
        await Comment.collection.drop();
        const date1 = new Date(2023, 1, 2, 20, 45); // February is month 1 (0-indexed)
        let comment1 = new Comment({text: "Vandaag mijn diploma behaald!",date: date1, reactions: ['Proficiat!!', 'Goed gedaan!', 'Nu komt het echte leven']});
        await comment1.save();
        const date2 = new Date(2023, 5, 20, 20, 45); // February is month 1 (0-indexed)
        let comment2 = new Comment({text: "Avengers endgame net gekeken in de cinema, WOW",date: date2, reactions: ['Best film ever!', 'Moet hem nog steeds zien!', 'hellll yeaah']});
        await comment2.save();
        const date3 = new Date(2023, 4, 5, 20, 45); // February is month 1 (0-indexed)
        let comment3 = new Comment({text: "1-0 gewonnen dit weekend tegen veldwezelt!! let's go!",date: date3, reactions: ['Proficiat!!', 'Dikke match gespeeld!', 'super spannend!', 'gogogo', "5de", "6de", "7de"]});
        await comment3.save();
        const date4 = new Date(2023, 3, 9, 20, 45); // February is month 1 (0-indexed)
        let comment4 = new Comment({text: "Lord of the rings van tolkien gelzen, een dikke aanrader!",date: date4, reactions: ['Zeker en vast!', 'Heb deze al minsters 10x gelezen']});
        await comment4.save();
        const date5 = new Date(2023, 5, 4, 20, 45); // February is month 1 (0-indexed)
        let comment5 = new Comment({text: "May the 4th be with you!!!",date: date5, reactions: ['Hello there, General kenobi', 'Use the force!']});
        await comment5.save();
        const date6 = new Date(2023, 10, 2, 20, 45); // February is month 1 (0-indexed)
        let comment6 = new Comment({text: "Alweer een saaie dag op school...",date: date6, reactions: ['i know the feeling', 'sooo loongg']});
        await comment6.save();
        comments = await Comment.find({});
        console.log("users");
        console.log(comments);
    } catch(error){
        console.log(error);
    } finally {
        cleanup();
    }
}

run().catch((err) => {console.log(err.stack);});
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

function cleanup (event) {
    $console.log("\nBye!");
    mongoose.connection.close();
    process.exit();
}

