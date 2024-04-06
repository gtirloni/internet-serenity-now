// ==UserScript==
// @name     HackerNews Post Hider (based on post Domains and Titles)
// @match https://news.ycombinator.com/
// @match https://news.ycombinator.com/?p=*
// @match https://news.ycombinator.com/news*
// @match https://news.ycombinator.com/front*
// @version  2.1
// @grant    none
// @namespace ahappyviking
// @license MIT
// @description Simply hides posts with specific user-specified domains or title keywords on HackerNews front page
// @icon https://www.kindpng.com/picc/m/61-613142_see-no-evil-monkey-icon-monkey-eyes-closed.png
// @downloadURL https://update.greasyfork.org/scripts/456182/HackerNews%20Post%20Hider%20%28based%20on%20post%20Domains%20and%20Titles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456182/HackerNews%20Post%20Hider%20%28based%20on%20post%20Domains%20and%20Titles%29.meta.js
// ==/UserScript==



// This is a modified script with a predefined list of domains and titles.
// The domain list has been modified to work as regular expressions instead of strings.
// The count of blocked domains is removed to avoid causing more distractions.


let hiddenDomains = [
  "9to5answer.com",
  "9to5mac.com",
  "abc.net.au",
  "aeon.co",
  "apnews.com",
  "arxiv.org",
  "bbc.com",
  "bigthink.com",
  "bloomberg.com",
  "businessinsider.com",
  "cbc.ca",
  "cbsnews.com",
  "chicagotribune.com",
  "cnbc.com",
  "cnn.com",
  "crates.io",
  "dailymail.co.uk",
  "fastcompany.com",
  "forbes.com",
  "foxnews.com",
  "france24.com",
  "ft.com",
  "gamespot.com",
  "gizmodo.com",
  "gothamist.com",
  "hbr.org",
  "ign.com",
  "jalopnik.com",
  "japantimes.co.jp",
  "macworld.com",
  "msn.com",
  "nature.com",
  "nbcnews.com",
  "neowin.net",
  "newyorker.com",
  "npr.org",
  "nypost.com",
  "nytimes.com",
  "openai.com",
  "orlandoweekly.com",
  "paulgraham.com",
  "pcmag.com",
  "pinterest.com",
  "quantamagazine.org",
  "qz.com",
  "reuters.com",
  "sfchronicle.com",
  "sfgate.com",
  "sfstandard.com",
  "smithsonianmag.com",
  "techcrunch.com",
  "techradar.com",
  "techtarget.com",
  "text.npr.org",
  "theatlantic.com",
  "theguardian.com",
  "theverge.com",
  "tiktok.com",
  "tomshardware.com",
  "twitter.com/paulg",
  "usatoday.com",
  "vogue.com",
  "washingtonpost.com",
  "wired.com",
  "wsj.com",
  "yahoo.com",
  "ycombinator.com",
];
let hiddenTitleKeywords = [
  "hiring",
  "advertise",
  "ai-startup",
  "ai apps",
  "america",
  "app store",
  "apple",
  "argentina",
  "bay area",
  "big tech",
  "billionaire",
  "bitcoin",
  "boeing",
  "bomb",
  "brexit",
  "california",
  "capitalism",
  "china",
  "chinese",
  "conservative",
  "county",
  "covid",
  "cuda",
  "democrats",
  "elixir",
  "elon",
  "emacs",
  "emcas",
  "erlang",
  "facebook",
  "fcc",
  "fine-tune",
  "fine-tuning",
  "florida",
  "fortran",
  "ftc",
  "gaza",
  "genai",
  "generative ai",
  "german",
  "government",
  "govt",
  "gpt",
  "hiring",
  "hospital",
  "houston",
  "ibm",
  "immigration",
  "instagram",
  "iran",
  "israel",
  "java",
  "judge",
  "language model",
  "laravel",
  "libreoffice",
  "lisp",
  "llama",
  "millionare",
  "musk",
  "neural",
  "new york city",
  "nyc",
  "openai",
  "openstreetmap",
  "php",
  "privacy",
  "pytorch",
  "quantum",
  "republican",
  "roblox",
  "russia",
  "rust",
  "san francisco",
  "servo",
  "shopping",
  "silicon valley",
  "slavery",
  "spy",
  "stability ai",
  "stable diffusion",
  "startup",
  "startups",
  "surveillance",
  "surveilling",
  "tesla",
  "tories",
  "tracking",
  "transformer",
  "twitter",
  "ukraine",
  "war",
  "washington",
  "wasm",
  "wealthy",
  "webassembly",
  "web engine",
  "white house",
  "zenfone",
];

function hncleaner_main() {
    deleteRanking();

    let numberOfBlocked = 0

    //First blocking based on domains...
    let posts = document.getElementsByClassName("athing")
    for (let post of posts) {
        let hasBeenHidden = false;

        //Check the title first...
        let titleHolder = post.querySelector(".titleline")
        const title = titleHolder.firstChild.textContent.toLocaleLowerCase()
        for (const word of hiddenTitleKeywords) {
            if (!title.includes(word)) continue;
            hidepost_hidePost(post)
            numberOfBlocked++
            hasBeenHidden = true
            break
        }

        if (hasBeenHidden) continue
        let link = post.querySelector(".sitestr")
        // MODIFIED: Check the link against all the hidden domains as regex patterns
        if (link && hiddenDomains.some(patternString => {
          const pattern = new RegExp(".*" + patternString);
          return pattern.test(link.innerHTML);
        })) {
          hidepost_hidePost(post);
          numberOfBlocked++;
        }
    }
}

function hncleaner_createBlockNotice() {
    //Actually decided to have this return null just to make things cleaner
    const notice = document.createElement("div");
    return notice
}

function hidepost_hidePost(owner) {
    owner.nextElementSibling?.nextElementSibling?.remove() //Removing "spacer" element
    owner.nextElementSibling?.remove() //Removing comments
    owner.replaceWith(hncleaner_createBlockNotice()) //Removing title
}

function deleteRanking() {
    const rankElements = document.getElementsByClassName("rank");
    const rankArray = Array.from(rankElements);
    rankArray.forEach(element => {
        element.remove();
    });
}

hncleaner_main()
