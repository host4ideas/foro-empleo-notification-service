const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const webpush = require("web-push");

const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

webpush.setVapidDetails(
    process.env.WEB_PUSH_CONTACT,
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
);

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.post("/notifications/subscribe", (req, res) => {
    const subscription = req.body;

    console.log(subscription);

    const payload = JSON.stringify({
        title: "Hello!",
        body: "It works.",
    });

    webpush
        .sendNotification(subscription, payload)
        .then((result) => console.log(result))
        .catch((e) => console.log(e.stack));

    res.status(200).json({ success: true });
});

app.get("/vapidPublicKey", function (req, res) {
    res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post("/register", function (req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
});

app.post("/sendNotification", function (req, res) {
    const subscription = req.body.subscription;
    const payload = req.body.payload;
    const options = {
        TTL: req.body.ttl,
    };

    setTimeout(function () {
        webpush
            .sendNotification(subscription, payload, options)
            .then(function () {
                res.sendStatus(201);
            })
            .catch(function (error) {
                console.log(error);
                res.sendStatus(500);
            });
    }, req.body.delay * 1000);
});

app.listen(9000, () =>
    console.log("The server listening: http://localhost:9000")
);
