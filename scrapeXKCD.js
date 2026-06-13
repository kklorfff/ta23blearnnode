import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

if (!fs.existsSync("cache")) fs.mkdirSync("cache");

const cacheGet = (name) => {
    const path = "cache/" + name + ".html";
    if (fs.existsSync(path)) return fs.readFileSync(path, "utf-8");
    return false;
};

const cacheSet = (name, value) => {
    fs.writeFileSync("cache/" + name + ".html", value);
};

export default async function scrapeXKCD() {
    let result = [];

    for (let i = 3088; i > 3078; i--) {
        let data = cacheGet(i);

        if (!data) {
            await sleep(1000);
            const res = await axios.get(`https://xkcd.com/${i}/`);
            data = res.data;
            cacheSet(i, data);
        }

        const $ = cheerio.load(data);

        result.push({
            title: $("#comic img").attr("alt"),
            img: "https:" + $("#comic img").attr("src"),
            text: $("#comic img").attr("title")
        });
    }

    return result;
}