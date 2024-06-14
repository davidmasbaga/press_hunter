const OpenAI = require('openai');
const rawArticle = require('../models/raw-article.js');
const CleanArticle = require('../models/clean-article.js');
const {getImages} = require('./serp-value.service.js');

const openai = new OpenAI(process.env.OPENAI_API_KEY);


const categories = [
    'Política', 'Internacional', 'Deportes', 'Economía', 'Sociedad', 'Cultura', 'Sucesos',
    'Tecnología', 'Medios', 'Opinión', 'Ocio y televisión', 'Comunidades', 
    'Estilo de Vida', 'Salud', 'Educación', 'Ciencia', 'Clima y Medio Ambiente'
];

const autores = [
    
    { name: 'Jose Carlos Romero', categorias: [
        'Política', 'Internacional',  'Economía'
    ]},
    { name: 'Mencía Dueñas', categorias: [
        'Sociedad', 'Cultura','Ocio y televisión','Comunidades', 'Sucesos'
    ]},
    { name: 'Alejandro Cobo', categorias: [
        'Deportes', 'Tecnología','Ciencia','Clima y Medio Ambiente'
    ]},
    { name: 'Cova Ramos', categorias: [
        'Estilo de Vida', 'Salud','Educación' ,'Medios'
    ]},
    
    
]

const esquemaAutores = autores.map(autor => `${autor.name}: ${autor.categorias.join(', ')}`).join('\n');

async function openAiChatJSON(userPrompt, roleContent ='') {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: `${roleContent}. Devuelvemelo en formato JSON` }, 
            { role: "user", content: userPrompt }
        ],
        model: "gpt-4o",
        response_format: { type: "json_object" },
    });
    const content = completion.choices[0].message.content;
    try {
        return JSON.parse(content);
    } catch (error) {
        console.error("Error parsing JSON content from OpenAI:", error);
        throw new Error("Failed to parse JSON from OpenAI response");
    }
}



const roleContentArticlesSpain= ` Utiliza un lenguaje técnico pero accesible. Organiza el contenido de manera estructurada,  
 comenzando con una introducción al problema, seguida de la exposición de medidas o soluciones, 
 y concluyendo.  
 Incluye citas directas si es necesario y  proporciona datos específicos si se precisan, ejemplos concretos y estudios relevantes para ilustrar los puntos discutidos.  
 Aborda el tema desde diferentes perspectivas para enriquecer la comprensión del problema.  
 Asegúrate de que la reinterpretación no sea una copia exacta del artículo original,  
 sino una nueva redacción con las mismas ideas clave y no necesariamente en el mismo orden.  
  El artículo debe contener, no menos de 800 palabras. 
  Usaré markdown por lo que los h1, h2, h3 deberán estar en ese formato, al igual que las listas u otros elementos del texto.  Procura que la jerarquia de encabezados no sea demasiado profunda, es un artículo periodístico, así que no es necesario que haya demasiados h2 ni h3 salvo que sea imprescindible o que el artículo original esté distribuido así. Elimina créditos,firmas de artículo o nombres del medio.
Añade negritas, cursivas  (si es necesario) para comprender mejor el texto, así como quotes (si es necesario en el texto)

Quiero que me devuelvas un JSON con el contenido del artículo redactado por ti. `

async function aiContent(article) {


    try {
        const articleRaw = await rawArticle.findById(article.id);
        if (!articleRaw) {
            throw new Error(`Article with id ${article.id} not found`);
        }
        
        const existingArticle = await CleanArticle.findOne({ idOrigin: articleRaw.id });
        if( existingArticle ) {
            
            throw new Error(`Article with id ${articleRaw.id} has already been processed.`);
          
        }

        const articleContent = articleRaw.content;

        const prompt = `
        Quiero que me devuelvas un JSON con el contenido del artículo redactado por ti. 
        ${articleContent}. 
        El formato 
        tiene que ser ESTRICTAMENTE así: 
        {
        content: 'contenido del artículo redactado por ti en markdown', 
        title: 'Lo eliges tú en función del contenido del artículo y el título ${articleRaw.title} pero que no sea el mismo',
        intro: Una introducción, como subcabecera, que resuma el artículo o cuente de lo que se habla en 4 a 6 lineas
        mainCategory: '${article.mainCategory}' adapatada estrictamente a pero estas categorías: ${categories.join(', ')}. Por ejemplo, tenis, futbol, etc.. estarían consideradas como deportes, 
        entities: Devuelve SIEMPRE una array de entidades de [${articleRaw?.entities.join(', ')}. Si lo que te paso está vacío, elije tú algunas que creas que son relevantes según el contenido del artículo y sólo pásame 5 o 6],Ordena las entidades por importancia en el artículo, es decir si el artículo habla de un político la entidad primera será ese político, no su partido, si es de deportes y habla de la selección de futbol, la primera entidad será la selección, no el país.  
        autor: Nombre del autor segun este esquema ${esquemaAutores}
        path: un path que te inventes acorde al contenido del artículo (sin categoría, es decir en vez de /economia/como-invertir quiero sólo el como-invertir)
        }'`;
        

        const newContent = await openAiChatJSON(prompt, roleContentArticlesSpain);

        
        const firstEntity = newContent.entities[0];
        const secondEntity = newContent.entities[1];
        const thirdEntity = newContent.entities[2];
        
        const queryConversion = (imageName) => {
            return imageName.toLowerCase().replace(/ /g, '+').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        
        const firstImageTry = queryConversion(firstEntity);
        const secondImageTry = queryConversion(secondEntity);
        const thirdImageTry = queryConversion(thirdEntity);
        
        let imageUrl = '';
        
        const firstImageUrl = await getImages(firstImageTry);
        
        if (firstImageUrl) {
            imageUrl = firstImageUrl;
        } else {
            const secondImageUrl = await getImages(secondImageTry);
        
            if (secondImageUrl) {
                imageUrl = secondImageUrl;
            } else {
                const thirdImageUrl = await getImages(thirdImageTry);
        
                if (thirdImageUrl) {
                    imageUrl = thirdImageUrl;
                }
            }
        }          

               

        const payload = {
            content: newContent.content,
            idOrigin: articleRaw.id,
            media: articleRaw.media,
            title: newContent.title,
            intro: newContent.intro,
            mainCategory: newContent.mainCategory,
            entities: newContent.entities,
            date: articleRaw.date,
            autor: newContent.autor,
            image: imageUrl,
            path: newContent.path,
        };

        console.log(payload)

        // Save the new content as a CleanArticle
        const newArticle = new CleanArticle(payload);
        await newArticle.save();

        return newArticle;
    } catch (error) {
        console.error("Error in aiContent:", error);
        throw error;
    }
}





module.exports = { openAiChatJSON, aiContent };
