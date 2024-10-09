const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = "https://www.noxscans.com";

class NoxScans {
    constructor() {
        this.cheerio = cheerio;
    }

    // Fetches a list of manga from the main page
    async getMangaList(page) {
        const request = await axios.get(`${BASE_URL}/manga-list?page=${page}`);
        const $ = this.cheerio.load(request.data);
        return this.parseMangaList($);
    }

    // Parses the manga list from the HTML structure
    parseMangaList($) {
        let mangas = [];
        $('div.manga-item').each((i, el) => {
            const title = $(el).find('h3.manga-title').text().trim();
            const url = $(el).find('a').attr('href');
            const image = $(el).find('img').attr('src');
            mangas.push({
                title: title,
                url: `${BASE_URL}${url}`,
                image: `${BASE_URL}${image}`
            });
        });
        return mangas;
    }

    // Fetches chapters for a specific manga
    async getChapters(mangaId) {
        const request = await axios.get(`${BASE_URL}/manga/${mangaId}`);
        const $ = this.cheerio.load(request.data);
        return this.parseChapters($);
    }

    // Parses the chapters from the HTML structure
    parseChapters($) {
        let chapters = [];
        $('ul.chapter-list li').each((i, el) => {
            const chapterName = $(el).find('a').text().trim();
            const chapterUrl = $(el).find('a').attr('href');
            chapters.push({
                name: chapterName,
                url: `${BASE_URL}${chapterUrl}`
            });
        });
        return chapters;
    }

    // Fetches images for a specific chapter
    async getChapterImages(chapterId) {
        const request = await axios.get(`${BASE_URL}/chapter/${chapterId}`);
        const $ = this.cheerio.load(request.data);
        return this.parseChapterImages($);
    }

    // Parses the chapter images from the HTML structure
    parseChapterImages($) {
        let images = [];
        $('div.chapter-content img').each((i, el) => {
            const imageUrl = $(el).attr('src');
            images.push(`${BASE_URL}${imageUrl}`);
        });
        return images;
    }
}

// Example Usage:
(async () => {
    const scraper = new NoxScans();
    
    // Get the first page of manga list
    const mangaList = await scraper.getMangaList(1);
    console.log("Manga List:", mangaList);

    // Get chapters for a specific manga by ID (replace 'mangaId' with actual ID)
    const chapters = await scraper.getChapters('some-manga-id');
    console.log("Chapters:", chapters);

    // Get images for a specific chapter by ID (replace 'chapterId' with actual ID)
    const chapterImages = await scraper.getChapterImages('some-chapter-id');
    console.log("Chapter Images:", chapterImages);
})();
