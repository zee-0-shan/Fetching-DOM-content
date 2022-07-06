// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const http=require('http')
const { createServer } = require('https')
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL of the page we want to scrape

const url = "https://time.com";

// Async function which scrapes the data
async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $(".latest-stories ul li");
    // Stores data for all Time_news
    const Time_news = [];
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // Object holding data for each latest_news/jurisdiction
      const latest_news = { title: "", link: "" };
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      latest_news.title = $(el).children("a").text().trim();
      latest_news.link = "https://time.com"+$(el).children("a").attr('href');
      // Populate Time_news array with latest_news data
      Time_news.push(latest_news);
    });
    // Logs Time_news array to the console
    console.dir(Time_news);
    // Write Time_news array in Time_news.json file
    fs.writeFile("news.json", JSON.stringify(Time_news, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data to file");
    });
  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
scrapeData();
const fileContent=fs.readFileSync('./news.json')

const server=http.createServer((req,res)=>{
    res.writeHead(200,{'Content-type':'application/json'});
    res.end(fileContent)
})

server.listen(5000,'127.0.0.1',()=>{
    console.log('listening at port 5000')
})