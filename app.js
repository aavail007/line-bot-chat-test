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
let demoDataFromGoogle = {}


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

app.get('/test', async (req, res) => {
  let demoDataFromGoogle = await getDemoData();
  res.writeHead(200,{'Content-Type':'text/plain'})
  res.end('V6----------------------' + JSON.stringify(demoDataFromGoogle));
});

// event handler
async function handleEvent(event) {
  console.log("Get Line userId ================== type ==== " + event.type + " ====== ", event.source.userId);
  if (event.type === 'message' || event.message?.type === 'text') {
    msgEvent(event);
  } else if(event.type === 'postback') {
    postbackEvent(event);
  } else {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
}

async function msgEvent(event) {
  const regex = /^\[.*\]$/gm;
  let textString = '';
  let replayObj = {};
  const userId = event.source.userId; // Line userId
  if (regex.test(event.message.text)) { // 有 []包起來表示不須經由 GPT 回覆
    if(event.message.text === '[活動資料]') {
      textString = demoDataFromGoogle.activityData;
      replayObj = buildFlexMsgObj('活動資料', textString);
    } else if (event.message.text === '[健康資料]') {
      textString = demoDataFromGoogle.vitalsignData;
      replayObj = buildFlexMsgObj('健康資料', textString);
    } else if (event.message.text === '[機構資訊]') {
      textString = demoDataFromGoogle.aboutUs;
      replayObj = { type: 'text', text: textString };
    } else if(event.message.text === '[基本資料]') {
      textString = demoDataFromGoogle.memberInfo;
      replayObj = buildFlexMsgObj('基本資料', textString);
    } else if(event.message.text === '[操作說明]') {
      textString = demoDataFromGoogle.instructions;
      replayObj = { type: 'text', text: textString };
    } else if(event.message.text === '[userid]') {
      replayObj = { type: 'text', text: '您的 userId = ' + userId };
    } else if(event.message.text === '[切換住民]') {
      textString = demoDataFromGoogle.changeResident;
      replayObj = buildFlexMsgObj('切換住民', textString);
    } else if(event.message.text.includes('[=')) { // 重複你說的話: 輸入 [={type:123}] 會取 [= ]中間的 
      replayObj = buildFlexMsgObj('自定義格式', event.message.text.match(/\[\=(\S*)]/)[1]);
    } else if(event.message.text.includes('[@')) { // 來自 google 
      let key = event.message.text.match(/\[\@(\S*)]/)[1]
      textString = demoDataFromGoogle[key];
      replayObj = buildFlexMsgObj('來自google data', textString);
    } else {
      replayObj = { type: 'text', text: '很抱歉，沒有對應這個指令的回覆' };
    }
  } else if(event.message.text.includes('請輸入身分證')) {
    if(event.message.text.includes('false')) {
      replayObj = { type: 'text', text: '驗證碼錯誤' };
    } else {
      replayObj = { type: 'text', text: '綁定成功，請點選圖文選單功能來取得長者資訊' };
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

function postbackEvent(event) {
  const data = event.postback.data;
  let replayObj;
  console.log("++++++++ postbackEvent event data +++++++++", data);
  // 根据 postback 資料执行相应的操作
  if (data === 'bindMember') {
    replayObj = { type: 'text', text: '請輸入要綁定的長者身分證字號與驗證碼\n※手機版請勿刪除輸入框的預設文字 \n ※桌機版請複製下列格式回覆\n\n請輸入身分證:\n O123456789\n請輸入驗證碼:\n 123456' };
    console.log("++++++++ postbackEvent replayObj +++++++++", replayObj);
    return client.replyMessage(event.replyToken, replayObj);
  } else if (data === 'ACTION_2') {
    // 执行操作 2
  } else {
    // 处理其他的 postback 資料
    return Promise.resolve(null);
  }

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
  data.data.values.forEach(element => {
    try {
      demoDataFromGoogle[element[0]] = JSON.parse(element[1]);
    } catch (e) {
      demoDataFromGoogle[element[0]] = element[1];
    }
  });
  console.log('demoDataFromGoogle****************', demoDataFromGoogle);
  return demoDataFromGoogle;
}

getDemoData();

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});