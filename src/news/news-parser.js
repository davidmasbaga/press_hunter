const Parser = require('rss-parser');
const parser = new Parser();
const cheerio = require('cheerio');
const axios = require('axios');

const TurndownService = require('turndown');
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

async function fetchRSS(mediaArray) {
  try {
    for (const media of mediaArray) {
      const feed = await parser.parseURL(media.linkRRSS);

      const articles = await Promise.all(feed.items.slice(0, 15).map(async (item) => {
        let mediaName = 'Sample';
        let mainCategory = 'noticias';
        let content = '';
        let freeArticle = true;

        const title = item.title.trim().replace(/\s\s+/g, ' ') || '';
        const date = item.pubDate.trim().replace(/\s\s+/g, ' ') || '';
        const link = item.link.trim() || '';

        // Limpiar cada categoría y filtrar las vacías
        const categories = Array.isArray(item.categories)
          ? item.categories
              .map((cat) => cat.trim().replace(/\s\s+/g, ' '))
              .filter((cat) => cat.length > 0)
          : [];

          // * DIARIO.ES HECHO
          // if (media.media === 'esdiario') {
          //   mediaName = 'Diario.Es';
          //   const match = link.match(/esdiario\.com\/([^\/]+)\//);
          //   mainCategory = match[1];
          //   mainCategory = mainCategory === 'espana' ? 'españa' : mainCategory;
          //   mainCategory = mainCategory === 'chismografo' ? 'entretenimiento' : mainCategory;
  
          //   try {
          //     const response = await axios.get(link);
          //     const html = response.data;
          //     const $ = cheerio.load(html);
          //     const cardContent = $('.card-content');
          //     // Eliminar <blockquote> y <figure>
          //     cardContent.find('blockquote, figure').remove();
  
          //     cardContent.find('*').each((i, el) => {
          //       const element = $(el);
  
          //       element.removeAttr('class').removeAttr('id').removeAttr('href');
          //     });
  
          //     const cleanContent = cardContent
          //       .html()
          //       .replace(/<\!--.*?-->/gs, '') // Elimina los comentarios HTML
          //       .replace(/\s{2,}/g, ' ') // Reduce múltiples espacios en blanco
          //       .replace(/\n\s*\n/g, '\n'); // Reduce múltiples saltos de línea
  
          //     const mdxContent = turndownService.turndown(cleanContent);
          //     content = mdxContent;
          //   } catch (error) {
          //     console.error('Error al realizar la solicitud:', error);
          //   }
          // }

          // * EL PAIS (HECHO)
  
          // if (media.media === 'elpais') {
          //   mediaName = 'El pais';
          //   const match = link.match(/elpais\.com\/([^\/]+)\//);
          //   mainCategory = match[1];
          //   mainCategory = mainCategory === 'espana' ? 'españa' : mainCategory;
  
          //   try {
          //     const response = await axios.get(link);
          //     const html = response.data;
          //     const $ = cheerio.load(html);
  
          //     const paywall = $("#ctn_freemium_article");
  
          //     if (paywall.length > 0) { 
          //       freeArticle = false;
          //     } else {
          //       freeArticle = true;
          //       const cardContent = $('[data-dtm-region="articulo_cuerpo"]')
          //     // Eliminar <blockquote> y <figure>
          //     cardContent.find('blockquote, figure').remove();
  
          //     cardContent.find('*').each((i, el) => {
          //       const element = $(el);
  
          //       element.removeAttr('class').removeAttr('id').removeAttr('href');
          //     });
  
          //     const cleanContent = cardContent
          //       .html()
          //       .replace(/<\!--.*?-->/gs, '') // Elimina los comentarios HTML
          //       .replace(/\s{2,}/g, ' ') // Reduce múltiples espacios en blanco
          //       .replace(/\n\s*\n/g, '\n'); // Reduce múltiples saltos de línea
  
          //     const mdxContent = turndownService.turndown(cleanContent);
          //     content = mdxContent;
          //     }
          //   } catch (err) {
          //     console.error('Error al obtener el artículo:', err);
          //   }
          // }

          // TODO EL PERIODICO

          // if (media.media === 'elperiodico') {
          //   mediaName = 'El periodico'
          //   const match = link.match(/elperiodico\.com\/es\/([^\/]+)\//);
          //   mainCategory = match[1];
          //   mainCategory = mainCategory === 'yotele' ? 'entretenimiento' : mainCategory;
          // }
  
  
          // TODO EL MUNDO
          
          // if (media.media === 'elmundo') {
          //   mediaName = 'El Mundo';
  
          //   const match = link.match(/elmundo\.es\/([^\/]+)\//);
          //   mainCategory = match[1];
          //   mainCategory = mainCategory === 'espana' ? 'españa' : mainCategory;
          // }

          //! ABC: Valorar limpiar contenido (mucha info sucia)
          
         //  if (media.media === 'abc') {
          //    mediaName = 'ABC';
          //    const match = link.match(/abc\.es\/([^\/]+)\//);
          //    mainCategory = match[1];
          //    mainCategory = mainCategory === 'espana' ? 'españa' : mainCategory;


          //    try {
          //     const response = await axios.get(link);
          //     const html = response.data;
          //     const $ = cheerio.load(html);
  
          //     const paywall = $(".voc-paywall paywall voc-paywall--grad");
  
          //     if (paywall.length > 0) { 
          //       freeArticle = false;
          //     } else {
          //       freeArticle = true;
          //       const cardContent = $('.voc-d ')
                
              
          //     cardContent.find('blockquote, figure').remove();
  
          //     cardContent.find('*').each((i, el) => {
          //       const element = $(el);
                
          //       element.removeAttr('class').removeAttr('id').removeAttr('href');
          //     });


          //     if(cardContent !== null ){
          //       const cleanContent = cardContent
          //       .html()
          //       .replace(/<\!--.*?-->/gs, '') // Elimina los comentarios HTML
          //       .replace(/\s{2,}/g, ' ') // Reduce múltiples espacios en blanco
          //       .replace(/\n\s*\n/g, '\n') 
                
                
          //     const mdxContent = turndownService.turndown(cleanContent);
             
          //     content = mdxContent;
             
             

          //     }
             
          //     }
          //   } catch (err) {
          //     console.error('Error al obtener el artículo:', err);
          //   }


          //  }
          
          //  class="voc-paywall paywall voc-paywall--grad"
          


        // Ejemplo de acción condicional basada en el nombre del medio

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

module.exports = {
  fetchRSS,
};



function extractAbcVocPContent(paywallContent) {
  // Crear un elemento temporal para manipular el contenido HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = paywallContent;

  // Seleccionar todos los elementos <voc-p> dentro de <paywall>
  const vocPElements = tempDiv.querySelectorAll('voc-p');

  // Extraer el contenido de texto de cada elemento <voc-p>
  const vocPContentArray = Array.from(vocPElements).map(element => element.innerText);

  // Unir los contenidos en un solo string, separando con dobles saltos de línea
  const cleanedContent = vocPContentArray.join('\n\n');

  return cleanedContent;
}