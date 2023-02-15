require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const { Configuration, OpenAIApi } = require("openai");
const demoData = require('./demoData')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  console.log('req ***************', req);
  console.log('res ***************', res);
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      console.log('result ***************', result);
      res.json(result)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.get('/test', (req, res) => {
  const regex = /^\【.*\】$/gm;
  console.log('【機構活動】', regex.test("【機構活動】"));
  console.log('【機構活動】123', regex.test("【機構活動】123"));
  console.log('000【機構活動】', regex.test("000【機構活動】"));
  res.writeHead(200,{'Content-Type':'text/plain'})
  console.log('demoData', demoData);
  console.log('demoData.activityData()//////-----', JSON.stringify(demoData.vitalsignData()));
  res.end('V5----------------------' + JSON.stringify(demoData.vitalsignData()));
});

// event handler
async function handleEvent(event) {
  const regex = /^\【.*\】$/gm;
  let textString = '';
  let replayObj = {};
  const userId = event.source.userId; // Line userId
  console.log("Get Line userId ==================", userId);
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  if (regex.test(event.message.text)) { // 有 【】包起來表示不須經由 GPT 回覆
    if(event.message.text === '【機構活動】') {
      textString = demoData.activityData();
      replayObj = buildFlexMsgObj('機構活動', textString);
    } else if (event.message.text === '【生命徵象】') {
      textString = demoData.vitalsignData();
      replayObj = buildFlexMsgObj('生命徵象', textString);
    } else if (event.message.text === '【關於我們】') {
      textString = demoData.aboutUs();
      replayObj = { type: 'text', text: textString };
    } else if('userid') {
      replayObj = { type: 'text', text: '您的 userId = ' + userId };
    } else {
      replayObj = { type: 'text', text: '很抱歉，沒有對應這個指令的回覆' };
    }
  } else { // openai GPT 回
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: event.message.text ,
      max_tokens: 500,
    });
    textString = completion.data.choices[0].text.trim();
    replayObj = { type: 'text', text: textString };
  }

  // use reply API
  return client.replyMessage(event.replyToken, replayObj);
}

function buildFlexMsgObj(altText, contents) {
  return {
    type: "flex",
    altText,
    contents
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});