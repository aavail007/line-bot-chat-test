require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const demoData = require('./demoData')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const googleEnv = {
  googleKey: process.env.GOOGLE_KEY,
  googleSheetId: process.env.GOOGLE_SHEET_ID,
  googleSheetName: process.env.GOOGLE_SHEET_NAME
}
let demoDataFromGoogle;


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
  console.log('req ***************', JSON.stringify(req));
  console.log('res ***************', JSON.stringify(res));
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      console.log('result ***************', JSON.stringify(result));
      res.json(result)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.get('/test', async (req, res) => {
  let demoDataFromGoogle = await getDemoData();
  console.log('demoDataFromGoogle=====', demoDataFromGoogle);
  res.writeHead(200,{'Content-Type':'text/plain'})
  res.end('V6----------------------' + JSON.stringify(demoDataFromGoogle));
});

// event handler
async function handleEvent(event) {
  const regex = /^\[.*\]$/gm;
  let textString = '';
  let replayObj = {};
  const userId = event.source.userId; // Line userId
  console.log("Get Line userId ==================", userId);
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  if (regex.test(event.message.text)) { // 有 []包起來表示不須經由 GPT 回覆
    if(event.message.text === '[活動資料]') {
      textString = demoData.activityData();
      replayObj = buildFlexMsgObj('活動資料', textString);
    } else if (event.message.text === '[健康資料]') {
      textString = demoData.vitalsignData();
      replayObj = buildFlexMsgObj('健康資料', textString);
    } else if (event.message.text === '[機構資訊]') {
      textString = demoData.aboutUs();
      replayObj = { type: 'text', text: textString };
    } else if(event.message.text === '[基本資料]') {
      textString = demoData.memberInfo();
      replayObj = buildFlexMsgObj('基本資料', textString);
    } else if(event.message.text === '[操作說明]') {
      textString = demoData.instructions();
      replayObj = buildFlexMsgObj('操作說明', textString);
    } else if(event.message.text === '[userid]') {
      replayObj = { type: 'text', text: '您的 userId = ' + userId };
    } else if(event.message.text === '[切換住民]') {
      textString = demoData.changeResident();
      replayObj = buildFlexMsgObj('切換住民', textString);
    } else if(event.message.text.includes('[=')) { // 重複你說的話: 輸入 [={type:123}] 會取 [= ]中間的 
      replayObj = buildFlexMsgObj('自定義格式', event.message.text.match(/\[\=(\S*)]/)[1]);
    } else if(event.message.text.includes('[@')) { // 來自 google 
      textString = demoDataFromGoogle.activityData;
      replayObj = buildFlexMsgObj('來自google data', textString);
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
  console.log("++++++++ replayObj +++++++++", replayObj);
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

async function getDemoData() {
  console.log("觸發撈取 google 資料");
  var api_url = `https://sheets.googleapis.com/v4/spreadsheets/${googleEnv.googleSheetId}/values/${googleEnv.googleSheetName}?alt=json&key=${googleEnv.googleKey}`;
  let data = await axios.get(api_url);
  demoDataFromGoogle = {
    activityData: data.data.values[0][1],
    vitalsignData: data.data.values[1][1],
    aboutUs: data.data.values[2][1],
    memberInfo: data.data.values[3][1],
    instructions: data.data.values[4][1],
    changeResident: data.data.values[5][1],
  }
  console.log('demoDataFromGoogle****************', demoDataFromGoogle);
  console.log('JSON.stringify(demoDataFromGoogle)****************', JSON.stringify(demoDataFromGoogle));
  return demoDataFromGoogle;
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});