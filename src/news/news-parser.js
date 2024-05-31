const Parser = require("rss-parser");
const cheerio = require("cheerio");
const axios = require("axios");
const TurndownService = require("turndown");
const mediaES = require("../data/mediaES.js");
const { v4: uuidv4 } = require('uuid');

const loadPLimit = async () => {
  const module = await import("p-limit");
  return module.default;
};

const parser = new Parser();
const turndownService = new TurndownService();

turndownService.addRule("removeAttributes", {
  filter: ["a", "div", "span", "i"],
  replacement: function (content, node) {
    if (node.nodeName === "A" && node.getAttribute("href")) {
      return `[${content}](${node.getAttribute("href")})`;
    }
    return content;
  },
});

async function fetchRSS(mediaArray, newsPerMedia) {
  const allArticles = [];
  const pLimit = await loadPLimit();
  const limit = pLimit(5);
  try {
    const promises = mediaArray.map((media) =>
      limit(async () => {
        const feed = await parser.parseURL(media.linkRRSS);

        const articles = await Promise.all(
          feed.items.slice(0, newsPerMedia).map(async (item) => {
            let mediaName = "";
            let mainCategory = "noticias";
            let content = "";

            const title = item.title
              ? item.title.trim().replace(/\s\s+/g, " ")
              : "";
            const date = item.pubDate
              ? item.pubDate.trim().replace(/\s\s+/g, " ")
              : "";
            const link = item.link ? item.link.trim() : "";

            const categories = Array.isArray(item.categories)
              ? item.categories
                  .map((cat) => cat.trim().replace(/\s\s+/g, " "))
                  .filter((cat) => cat.length > 0)
              : [];

            if (media.media === "esdiario") {
              mediaName = "Diario.Es";
              const match = link.match(/esdiario\.com\/([^\/]+)\//);
              mainCategory = match ? match[1] : mainCategory;
              mainCategory =
                mainCategory === "espana" ? "españa" : mainCategory;
              mainCategory =
                mainCategory === "chismografo"
                  ? "entretenimiento"
                  : mainCategory;

              try {
                const response = await axios.get(link);
                const html = response.data;
                const $ = cheerio.load(html);
                const cardContent = $(mediaES[0].bodyClass);
                cardContent.find("blockquote, figure").remove();
                cardContent.find("*").each((i, el) => {
                  const element = $(el);
                  element
                    .removeAttr("class")
                    .removeAttr("id")
                    .removeAttr("href");
                });

                const cleanContent = cardContent
                  .html()
                  .replace(/<\!--.*?-->/gs, "")
                  .replace(/\s{2,}/g, " ")
                  .replace(/\n\s*\n/g, "\n");

                const mdxContent = turndownService.turndown(cleanContent);
                content = mdxContent;
              } catch (error) {
                console.error("Error al realizar la solicitud:", error);
              }
            }

            if (media.media === "elpais") {
              mediaName = "El Pais";
              const match = link.match(/elpais\.com\/([^\/]+)\//);
              mainCategory = match ? match[1] : mainCategory;
              mainCategory =
                mainCategory === "espana" ? "españa" : mainCategory;

              try {
                const response = await axios.get(link);
                const html = response.data;
                const $ = cheerio.load(html);
                const cardContent = $(mediaES[1].bodyClass);
                cardContent.find("blockquote, figure").remove();
                cardContent.find("*").each((i, el) => {
                  const element = $(el);
                  element
                    .removeAttr("class")
                    .removeAttr("id")
                    .removeAttr("href");
                });

                const cleanContent = cardContent
                  .html()
                  .replace(/<\!--.*?-->/gs, "")
                  .replace(/\s{2,}/g, " ")
                  .replace(/\n\s*\n/g, "\n");

                const mdxContent = turndownService.turndown(cleanContent);
                content = mdxContent;
              } catch (err) {
                console.error("Error al obtener el artículo:", err);
              }
            }
            // TODO: REVISAR EL PERIODICO

            if (media.media === "elperiodico") {
              mediaName = "El periodico";
              const match = link.match(/elperiodico\.com\/es\/([^\/]+)\//);
              mainCategory = match ? match[1] : "";
              mainCategory =
                mainCategory === "yotele" ? "entretenimiento" : mainCategory;

              try {
                const response = await axios.get(link);
                const html = response.data;
                const $ = cheerio.load(html);

                const cardContent = $(mediaES[2].bodyClass);

                // Eliminar <blockquote> y <figure>
                cardContent.find("blockquote, figure").remove();

                cardContent.find("*").each((i, el) => {
                  const element = $(el);

                  element
                    .removeAttr("class")
                    .removeAttr("id")
                    .removeAttr("href");
                });

                const cleanContent = cardContent
                  .html()
                  .replace(/<\!--.*?-->/gs, "") // Elimina los comentarios HTML
                  .replace(/\s{2,}/g, " ") // Reduce múltiples espacios en blanco
                  .replace(/\n\s*\n/g, "\n"); // Reduce múltiples saltos de línea

                const mdxContent = turndownService.turndown(cleanContent);
                content = mdxContent;
              } catch (err) {
                console.error("Error al obtener el artículo:", err);
              }
            }

            // TODO: REVISAR EL MUNDO

            if (media.media === "elmundo") {
              mediaName = "El Mundo";

              const match = link.match(/elmundo\.es\/([^\/]+)\//);
              mainCategory = match[1];
              mainCategory =
                mainCategory === "espana" ? "españa" : mainCategory;

              try {
                const response = await axios.get(link);
                const html = response.data;
                const $ = cheerio.load(html);

                const cardContent = $(mediaES[3].bodyClass);

                // Eliminar <blockquote> y <figure>
                cardContent.find("blockquote, figure").remove();

                cardContent.find("*").each((i, el) => {
                  const element = $(el);

                  element
                    .removeAttr("class")
                    .removeAttr("id")
                    .removeAttr("href");
                });

                const cleanContent = cardContent
                  .html()
                  .replace(/<\!--.*?-->/gs, "") // Elimina los comentarios HTML
                  .replace(/\s{2,}/g, " ") // Reduce múltiples espacios en blanco
                  .replace(/\n\s*\n/g, "\n") // Reduce múltiples saltos de línea
                  .replace(/\(function\(\).*/s, "")
                  .replace(/Polyfills if.*/);

                const mdxContent = turndownService.turndown(cleanContent);
                content = mdxContent;
              } catch (err) {
                console.error("Error al obtener el artículo:", err);
              }
            }

            return {
              id: uuidv4(),
              media:mediaName,
              date,
              title,
              link,
              mainCategory,
              entities: categories,
              content,
            };
          })
        );

        allArticles.push(...articles.filter((article) => article.content));
      })
    );

    await Promise.all(promises);

    return allArticles;
  } catch (error) {
    console.error("Error en fetchRSS:", error);
  }
}

module.exports = { fetchRSS };
