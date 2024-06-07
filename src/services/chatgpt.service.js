const OpenAI = require('openai');
const rawArticle = require('../models/raw-article.js');
const CleanArticle = require('../models/clean-article.js');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

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

        const prompt = `Reescribe el siguiente artículo manteniendo un tono claro, objetivo y serio. 
        Utiliza un lenguaje técnico pero accesible. Organiza el contenido de manera estructurada, 
        comenzando con una introducción al problema, seguida de la exposición de medidas o soluciones,
        y concluyendo con comentarios o reflexiones de expertos. Incluye citas directas y 
        proporciona datos específicos, ejemplos concretos y estudios relevantes para ilustrar los puntos discutidos. 
        Aborda el tema desde diferentes perspectivas para enriquecer la comprensión del problema. 
        Asegúrate de que la reinterpretación no sea una copia exacta del artículo original, 
        sino una nueva redacción con las mismas ideas clave y no necesariamente en el mismo orden. 
        ${articleContent}. El artículo debe contener, no menos de 800 palabras.
        Usaré markdown por lo que los h1, h2, h3 deberán estar en ese formato, al igual que las listas u otros elementos del texto. 
        Quiero que me devuelvas un JSON con el contenido del artículo redactado por ti. 
        El formato 
        tiene que ser ESTRICTAMENTE así: 
        {
        content: 'contenido del artículo redactado por ti en markdown', 
        title: 'Lo eliges tú en función del contenido del artículo y el título ${articleRaw.title} pero que no sea el mismo',
        mainCategory: '${article.mainCategory}', 
        path: un path que te inventes acorde al contenido del artículo (sin categoría, es decir en vez de /economia/como-invertir quiero sólo el como-invertir)
        }'`;

        const newContent = await openAiChatJSON(prompt);

        console.log('NewContent:',newContent);

        const payload = {
            content: newContent.content,
            idOrigin: articleRaw.id,
            media: articleRaw.media,
            title: newContent.title,
            mainCategory: articleRaw.mainCategory,
            entities: articleRaw.entities,
            date: articleRaw.date,
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
