import scrapeXKCD from "./scrapeXKCD.js";
import scrapeWUMO from "./scrapeWUMO.js";

export default async function comicScraper() {
    const xkcd = await scrapeXKCD();
    const wumo = await scrapeWUMO();

    return [...xkcd, ...wumo];
}