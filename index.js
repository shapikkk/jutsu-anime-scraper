const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const qs = require('querystring');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function fetchAllAnimeList() {
  const username = await new Promise(resolve => {
    rl.question('Enter your jut.su username: ', resolve);
  });

  const baseUrl = `https://jut.su/user/${username}/anime/`;
  
  let page = 1;
  const allAnimeList = [];
  const uniqueTitles = new Set();

  console.log(`\nFetching anime list for ${username}...`);

  while (true) {
    try {
      let response;
      let isFirstPage = page === 1;
      
      if (isFirstPage) {
        response = await axios.get(baseUrl, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0',
            'Referer': baseUrl
          }
        });
      } else {
        response = await axios.post(
          baseUrl,
          qs.stringify({
            ajax_load: 'yes',
            start_from_page: page,
            show_search: '',
            anime_of_user: username
          }),
          {
            responseType: 'arraybuffer',
            headers: {
              'User-Agent': 'Mozilla/5.0',
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Requested-With': 'XMLHttpRequest',
              'Referer': baseUrl
            }
          }
        );
      }

      const decodedHtml = iconv.decode(response.data, 'win1251');
      const $ = cheerio.load(decodedHtml);

      let newItems = 0;
      
      $('.all_anime_global.this_anime_is_viewed').each((_, el) => {
        const title = $(el).find('.aaname').text().trim();
        const details = $(el).find('.aailines').text().trim();
        const rating = $(el).find('.asr_rating .av_active').text().trim() || '0';

        if (title && details && !uniqueTitles.has(title)) {
          uniqueTitles.add(title);
          allAnimeList.push({ 
            title, 
            details,
            rating: parseInt(rating)
          });
          newItems++;
        }
      });

      console.log(`Page ${page}: Found ${newItems} new anime`);

      if (newItems === 0) {
        console.log('No more anime found, stopping.');
        break;
      }

      page++;
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`Error on page ${page}:`, error.message);
      break;
    }
  }

  rl.close();

  if (allAnimeList.length === 0) {
    console.log('\nNo anime found for this user. Please check the username and try again.');
    return;
  }

  // Sort by rating
  allAnimeList.sort((a, b) => b.rating - a.rating);

  // Save files
  const date = new Date().toLocaleDateString('en-US');
  const filenamePrefix = `anime_list_${username}`;

  // JSON
  fs.writeFileSync(`${filenamePrefix}.json`, JSON.stringify(allAnimeList, null, 2));

  // TXT
  const readableText = allAnimeList.map((anime, index) => {
    return `#${index + 1}
Title: ${anime.title}
Episodes: ${anime.details}
Rating: ${'★'.repeat(anime.rating)}${'☆'.repeat(5 - anime.rating)}
${'-'.repeat(40)}`;
  }).join('\n\n');

  fs.writeFileSync(`${filenamePrefix}.txt`, 
    `ANIME LIST FOR USER: ${username}\nGenerated on ${date}\nTotal: ${allAnimeList.length} anime\n\n${readableText}`
  );

  console.log(`
Data saved to 2 files:
1. ${filenamePrefix}.json (for programmatic use)
2. ${filenamePrefix}.txt (for easy reading)
`);
}

fetchAllAnimeList();
