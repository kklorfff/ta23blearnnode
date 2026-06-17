import axios from "axios";
import * as cheerio from 'cheerio';
import fs from 'fs';
import md5 from "md5";

const sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if(!fs.existsSync('cache')){
    fs.mkdirSync('cache');
}

const cacheGet = (name) => {
    if(fs.existsSync('cache/' + name + '.html')){
        return fs.readFileSync('cache/' + name + '.html', 'utf8');
    } 
    return false;
}

const cacheSet = (name, value) => {
   fs.writeFileSync('cache/' + name + '.html', value);
}

let url = 'https://www.smbc-comics.com/';

(async () => {
    for(let i = 0; i < 10; i++){
        console.log(`Fetching page ${i+1}: ${url}`);
    
        let data = cacheGet(md5(url));
        if(!data){
            await sleep(2000);
            console.log('FETCHING LIVE DATA');
            try {
                const headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                };
                let res = await axios.get(url, { headers });
                data = res.data;
                cacheSet(md5(url), data);
            } catch (error) {
                console.error(`Error fetching ${url}:`, error.message);
                continue;
            }
        } else {
            console.log('USING CACHED DATA');
        }
        
        const $ = cheerio.load(data);
        const comicImg = $('#cc-comic');
        const imgSrc = comicImg.attr('src');
        const imgAlt = comicImg.attr('title') || 'No alt text';
        const comicTitle = $('title').text();
        
        console.log(`Comic: "${comicTitle}"`);
        console.log(`Image: ${imgSrc}`);
        console.log(`Alt Text: ${imgAlt}`);
        
        const prevLink = $('a.cc-prev').attr('href');
        if (prevLink) {
            url = prevLink;
            console.log(`Next URL: ${url}\n`);
        } else {
            console.log('No previous comic link found. Stopping.');
            break;
        }
    }
})();