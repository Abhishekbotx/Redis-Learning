

import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

// const client = createClient({
//   url :'redis://localhost:6380'
// })

//      OR

const client = createClient({
  socket: {
    host: '127.0.0.1', 
    port: 6380,     
    // reconnectStrategy: function (retries) {
    //     if (retries > 20) {
    //       console.log("Too many attempts to reconnect. Redis connection was terminated");
    //       return new Error("Too many retries.");
    //     } else {
    //       return retries * 500; // Waits for retries * 500 milliseconds before trying again
    //     }
    // } 
    // 🍁 recconection strategies
       
}

})
client.on('error', (err) => console.log('Redis Client Error', err)); //if you got error while connection

app.post("/submit", async (req, res) => {
    const problemId = req.body.problemId;
    const code = req.body.code;
    const language = req.body.language;
    // client.exist

    try {
        await client.lPush("problems", JSON.stringify({ code, language, problemId }));
        console.log('route was hit')
        res.status(200).send("Submission received and stored.");
    } catch (error) {
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission.");
    }
});

async function startServer() {
    try {
        await client.connect();
        console.log("Connected to Redis");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startServer();

