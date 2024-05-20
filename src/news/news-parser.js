import Parser from 'rss-parser';
const parser = new Parser();
import cheerio from 'cheerio'
import axios from 'axios'
import TurndownService from 'turndown'



const turndownService = new TurndownService();

turndownService.addRule('removeAttributes', {
  filter: ['a', 'div', 'span', 'i'],
  replacement: function (content, node) {
    if (node.nodeName === 'A' && node.getAttribute('href')) {
      return `[${content}](${node.getAttribute('href')})`;
    }
    return content;
  }
});




export async function fetchRSS(mediaArray) {
  try {
    for (const media of mediaArray) {
      const feed = await parser.parseURL(media.linkRRSS);

      const articles = await Promise.all(feed.items.slice(0, 3).map(async (item) => {
        let mediaName = 'Sample';
        let mainCategory = 'noticias';
        let content = '';
        let freeArticle = true;

        const title = item.title ? item.title.trim().replace(/\s\s+/g, ' ') : '';
        const date = item.pubDate ? item.pubDate.trim().replace(/\s\s+/g, ' ') : '';
        const link = item.link ? item.link.trim() : '';

        // Limpiar cada categoría y filtrar las vacías
        const categories = Array.isArray(item.categories)
          ? item.categories
            .map((cat) => cat.trim().replace(/\s\s+/g, ' '))
            .filter((cat) => cat.length > 0)
          : [];

        // * DIARIO.ES HECHO
        if (media.media === 'esdiario') {
          mediaName = 'Diario.Es';
          const match = link.match(/esdiario\.com\/([^\/]+)\//);
          mainCategory = match[1];
          mainCategory = mainCategory === 'espana' ? 'españa' : mainCategory;
          mainCategory = mainCategory === 'chismografo' ? 'entretenimiento' : mainCategory;

          try {
            const response = await axios.get(link);
            const html = response.data;
            const $ = cheerio.load(html);
            const cardContent = $('.card-content');
            // Eliminar <blockquote> y <figure>
            cardContent.find('blockquote, figure').remove();

            cardContent.find('*').each((i, el) => {
              const element = $(el);

              element.removeAttr('class').removeAttr('id').removeAttr('href');
            });

            const cleanContent = cardContent
              .html()
              .replace(/<\!--.*?-->/gs, '') // Elimina los comentarios HTML
              .replace(/\s{2,}/g, ' ') // Reduce múltiples espacios en blanco
              .replace(/\n\s*\n/g, '\n'); // Reduce múltiples saltos de línea

            const mdxContent = turndownService.turndown(cleanContent);
            content = mdxContent;
          } catch (error) {
            console.error('Error al realizar la solicitud:', error);
          }
        }

        // * EL PAIS (HECHO)

        if (media.media === 'elpais') {
          mediaName = 'El pais';
          const match = link.match(/elpais\.com\/([^\/]+)\//);
          mainCategory = match[1];
          mainCategory = mainCategory === 'espana' ? 'españa' : mainCategory;

          try {
            const response = await axios.get(link);
            const html = response.data;
            const $ = cheerio.load(html);

            const paywall = $("#ctn_freemium_article");

            if (paywall.length > 0) {
              freeArticle = false;
            } else {
              freeArticle = true;
              const cardContent = $('[data-dtm-region="articulo_cuerpo"]')
              // Eliminar <blockquote> y <figure>
              cardContent.find('blockquote, figure').remove();

              cardContent.find('*').each((i, el) => {
                const element = $(el);

                element.removeAttr('class').removeAttr('id').removeAttr('href');
              });

              const cleanContent = cardContent
                .html()
                .replace(/<\!--.*?-->/gs, '') // Elimina los comentarios HTML
                .replace(/\s{2,}/g, ' ') // Reduce múltiples espacios en blanco
                .replace(/\n\s*\n/g, '\n'); // Reduce múltiples saltos de línea

              const mdxContent = turndownService.turndown(cleanContent);
              content = mdxContent;
            }
          } catch (err) {
            console.error('Error al obtener el artículo:', err);
          }
        }

        // * EL PERIODICO (HECHO)

        if (media.media === 'elperiodico') {
          mediaName = 'El periodico'
          const match = link.match(/elperiodico\.com\/es\/([^\/]+)\//);
          mainCategory = match ? match[1] : '';
          mainCategory = mainCategory === 'yotele' ? 'entretenimiento' : mainCategory;



          try {
            const response = await axios.get(link);
            const html = response.data;
            const $ = cheerio.load(html);

            const paywall = $("#pn-template");

            if (paywall.length > 0) {
              freeArticle = false;
            } else {
              freeArticle = true;
              const cardContent = $('.ft-layout-grid-flex__colXs-12.ft-layout-grid-flex__colSm-11');



              // Eliminar <blockquote> y <figure>
              cardContent.find('blockquote, figure').remove();

              cardContent.find('*').each((i, el) => {
                const element = $(el);

                element.removeAttr('class').removeAttr('id').removeAttr('href');
              });

              const cleanContent = cardContent
                .html()
                .replace(/<\!--.*?-->/gs, '') // Elimina los comentarios HTML
                .replace(/\s{2,}/g, ' ') // Reduce múltiples espacios en blanco
                .replace(/\n\s*\n/g, '\n'); // Reduce múltiples saltos de línea

              const mdxContent = turndownService.turndown(cleanContent);
              content = mdxContent;
            }
          } catch (err) {
            console.error('Error al obtener el artículo:', err);
          }

        }


        // TODO EL MUNDO

        if (media.media === 'elmundo') {
          mediaName = 'El Mundo';

          const match = link.match(/elmundo\.es\/([^\/]+)\//);
          mainCategory = match[1];
          mainCategory = mainCategory === 'espana' ? 'españa' : mainCategory;

          try {
            const response = await axios.get(link);
            const html = response.data;
            const $ = cheerio.load(html);

            const paywall = $(".ue-c-article__premium-title");

            if (paywall.length > 0) {
              freeArticle = false;
            } else {
              freeArticle = true;
              const cardContent = $('.ue-c-article__body');



              // Eliminar <blockquote> y <figure>
              cardContent.find('blockquote, figure').remove();

              cardContent.find('*').each((i, el) => {
                const element = $(el);

                element.removeAttr('class').removeAttr('id').removeAttr('href');
              });

              const cleanContent = cardContent
                .html()
                .replace(/<\!--.*?-->/gs, '') // Elimina los comentarios HTML
                .replace(/\s{2,}/g, ' ') // Reduce múltiples espacios en blanco
                .replace(/\n\s*\n/g, '\n') // Reduce múltiples saltos de línea
                .replace(/\(function\(\).*/s, '')
                .replace(/Polyfills if.*/,)

              const mdxContent = turndownService.turndown(cleanContent);
              content = mdxContent;
            }
          } catch (err) {
            console.error('Error al obtener el artículo:', err);
          }

        }






        return {
          mediaName,
          date,
          title,
          link,
          mainCategory,
          entities: categories,
          content,
          freeArticle
        };
      }));

      // Filtrar solo los artículos gratuitos
      const freeArticles = articles.filter(article => article.freeArticle);

      // Imprimir los artículos gratuitos
      freeArticles.forEach(article => console.log(article));

      // console.log(articles)
    }
  } catch (error) {
    console.error('Error en fetchRSS:', error);
  }
}




