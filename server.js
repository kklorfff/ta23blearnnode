import { WebSocketServer } from "ws";
import express from "express";
import cors from "cors";
import comicScraper from "./comicScraper.js";


// =====================
// WebSocket server
// =====================
const wss = new WebSocketServer({ port: 8080 });

let messages = [];

wss.on("connection", (ws) => {
    ws.on("error", console.error);

    ws.on("message", (data) => {
        data = JSON.parse(data);

        messages.push(data);

        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    ws.send(JSON.stringify({ type: "messages", messages }));
});


// =====================
// Express API server
// =====================
const app = express();

app.use(cors());

app.get("/rickandmorty", async (req, res) => {
    try {
        const data = await comicScraper();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Scraper failed" });
    }
});

app.listen(9000, () => {
    console.log("API running on http://localhost:9000");
});