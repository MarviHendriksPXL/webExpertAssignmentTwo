const mongoSanitize = require('express-mongo-sanitize');
const express = require("express");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const path = require("path");
const mongoose = require("mongoose");
const $console = require("Console");
const app = express();

const commentsRouter = require("./routes/comment");
const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION;
const DB_CONNECTION_OPTIONS = JSON.parse(process.env.DATABASE_CONNECTION_OPTIONS);

// 5req per minuut
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // limit each IP to 5 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});

// Limiter toevoegen
app.use(limiter);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());
app.use("/", commentsRouter);
app.use("/comments", commentsRouter);

app.post("/comments/:commentId/reactions", (req, res) => {
    const commentId = req.params.commentId;
    const reaction = req.body.reaction;

    addReaction(commentId, reaction)
        .then(() => {
            res.redirect("/comments");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error adding reaction");
        });
});

mongoose.connect(DATABASE_CONNECTION, DB_CONNECTION_OPTIONS)
    .catch((error) => {
        $console.error(error.message);
        cleanup();
    });

app.listen(PORT, () => {
    $console.log((new Date()).toUTCString(), `\tApp listening at port ${PORT}.`);
});

mongoose.connection.on("disconnected", function () {
    $console.error((new Date()).toUTCString(), "\tDisconnected from database.");
});

mongoose.connection.on("connected", function () {
    $console.log((new Date()).toUTCString(), "\tConnected to database.");
});

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

function cleanup(event) {
    $console.log((new Date()).toUTCString(), "\nBye!");
    mongoose.connection.close();
    process.exit();
}