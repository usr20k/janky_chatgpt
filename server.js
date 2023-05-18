/*
A Simple gpt3.5-based chatbot by Steven McDonald, 2023.
*/

const express = require('express');
const {OpenAIApi, Configuration} = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use("/images", express.static("./images"));
app.use("/scripts", express.static("./scripts"));
app.use(express.static('public'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const model = 'gpt-3.5-turbo';
const maxTokens = 300;
const sysMessage = [{"role": "system", "content" : "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.\nKnowledge cutoff: 2021-09-01\nCurrent date: 2023-05-18"}]
let messageBuffer = [];

// Uncomment the below to test if your key/org is working prior to starting using the frontend:

// async function testFunc() {
//   const test = await openai.createCompletion({
//     model: model,
//     prompt: "Hello OpenAI!",
//     max_tokens: 40,
//     temperature: 0
//   });
  
//   console.log(test)
// }

// testFunc();

app.post('/generate-text', async (req, res) => {
  try {
    const text = req.body.text;

    // Add the user's query to the end of the message buffer:
    messageBuffer.push({"role":"user", "content": text});
    
    // We only want to maintain the last 2 exchanges as context so if we exceed 5 messages in the buffer, pop the last 2:
    if (messageBuffer.length > 5) {
      messageBuffer = messageBuffer.slice(2);
    }
    const messagePayload = sysMessage.concat(messageBuffer)
    console.log("message payload:", messagePayload);

    const response = await openai.createChatCompletion({
      model: model,
      messages: messagePayload,
      max_tokens: maxTokens,
      temperature: 0
    });

    chatResponse = response.data.choices[0].message.content.trim();

    messageBuffer.push({"role": "assistant", "content": chatResponse});

    // console.log(res);
    res.json({ response: chatResponse });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
