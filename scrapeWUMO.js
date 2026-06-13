import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import md5 from "md5";

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

export default async function scrapeWUMO() {
    let url = "https://wumo.com/wumo";
    let result = [];

    for (let i = 0; i < 10; i++) {
        const key = md5(url);
        let data = cacheGet(key);

        if (!data) {
            await sleep(1000);
            const res = await axios.get(url);
            data = res.data;
            cacheSet(key, data);
        }

        const $ = cheerio.load(data);

        const img = $("article.wumo .box-content img");

        result.push({
            title: img.attr("alt"),
            img: img.attr("src")
        });

        const prev = $("article.wumo a.prev").attr("href");
        url = "https://wumo.com" + prev;
    }

    return result;
}