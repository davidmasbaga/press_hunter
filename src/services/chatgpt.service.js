const OpenAI = require('openai');

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

module.exports = { openAiChatJSON };
