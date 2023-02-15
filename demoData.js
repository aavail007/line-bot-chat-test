module.exports = {
  activityData: function () {
    return {
      type: "carousel",
      contents: [
        {
          type: "bubble",
          size: "micro",
          hero: {
            type: "image",
            url: "https://global-blog.cpcdn.com/tw/2022/02/AdobeStock_301707069.jpeg",
            size: "full",
            aspectMode: "cover",
            aspectRatio: "320:213",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "慶元宵包湯圓活動",
                weight: "bold",
                size: "sm",
                wrap: true,
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "baseline",
                    spacing: "sm",
                    contents: [
                      {
                        type: "text",
                        text: "時間: 2023/2/5 11:30",
                        wrap: true,
                        color: "#8c8c8c",
                        size: "xs",
                        flex: 5,
                      },
                    ],
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: "報名人數: 12",
                        size: "sm",
                        color: "#8c8c8c",
                      },
                    ],
                  },
                ],
              },
              {
                type: "button",
                action: {
                  type: "uri",
                  label: "查看活動",
                  uri: "http://linecorp.com/",
                },
                height: "sm",
              },
            ],
            spacing: "sm",
            paddingAll: "13px",
          },
        },
        {
          type: "bubble",
          size: "micro",
          hero: {
            type: "image",
            url: "https://i.ytimg.com/vi/ptKbzPSqgUI/maxresdefault.jpg",
            size: "full",
            aspectMode: "cover",
            aspectRatio: "320:213",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "日本戰國史",
                weight: "bold",
                size: "sm",
                wrap: true,
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "baseline",
                    spacing: "sm",
                    contents: [
                      {
                        type: "text",
                        text: "時間: 2023/2/3 15:00",
                        wrap: true,
                        color: "#8c8c8c",
                        size: "xs",
                        flex: 5,
                      },
                    ],
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: "報名人數: 8",
                        size: "sm",
                        color: "#8c8c8c",
                      },
                    ],
                  },
                ],
              },
              {
                type: "button",
                action: {
                  type: "uri",
                  label: "查看活動",
                  uri: "http://linecorp.com/",
                },
                height: "sm",
              },
            ],
            spacing: "sm",
            paddingAll: "13px",
          },
        },
        {
          type: "bubble",
          size: "micro",
          hero: {
            type: "image",
            url: "https://scadmin.sinyi.com.tw//UpFileForImage/1-0314%E7%B0%A1%E7%9B%88%E4%BD%B3_20180513200835.jpg",
            size: "full",
            aspectMode: "cover",
            aspectRatio: "320:213",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "合唱團團練",
                weight: "bold",
                size: "sm",
                wrap: true,
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "baseline",
                    spacing: "sm",
                    contents: [
                      {
                        type: "text",
                        text: "時間: 2023/1/5 11:30",
                        wrap: true,
                        color: "#8c8c8c",
                        size: "xs",
                        flex: 5,
                      },
                    ],
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: "報名人數: 7",
                        size: "sm",
                        color: "#8c8c8c",
                      },
                    ],
                  },
                ],
              },
              {
                type: "button",
                action: {
                  type: "uri",
                  label: "查看活動",
                  uri: "http://linecorp.com/",
                },
                height: "sm",
              },
            ],
            spacing: "sm",
            paddingAll: "13px",
          },
        },
      ],
    };
  },
  vitalsignData: () => {
    return {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "會員生命徵象",
            weight: "bold",
            color: "#1DB446",
            size: "sm",
          },
          {
            type: "text",
            text: "王小明",
            weight: "bold",
            size: "xxl",
            margin: "md",
          },
          {
            type: "text",
            text: "2023/02/15 15:38 量測",
            size: "xs",
            color: "#aaaaaa",
            wrap: true,
          },
          {
            type: "separator",
            margin: "xxl",
          },
          {
            type: "box",
            layout: "vertical",
            margin: "xxl",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "體溫",
                    size: "sm",
                    color: "#555555",
                    flex: 0,
                  },
                  {
                    type: "text",
                    text: "38",
                    size: "sm",
                    color: "#dc3545",
                    align: "end",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "脈搏",
                    size: "sm",
                    color: "#555555",
                    flex: 0,
                  },
                  {
                    type: "text",
                    text: "90 次/分",
                    size: "sm",
                    color: "#111111",
                    align: "end",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "呼吸",
                    size: "sm",
                    color: "#555555",
                    flex: 0,
                  },
                  {
                    type: "text",
                    text: "17 次/分",
                    size: "sm",
                    color: "#111111",
                    align: "end",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                margin: "sm",
                contents: [
                  {
                    type: "text",
                    text: "收縮/舒張壓",
                    size: "sm",
                    color: "#555555",
                    flex: 0,
                  },
                  {
                    type: "text",
                    text: "120/100",
                    size: "sm",
                    color: "#dc3545",
                    align: "end",
                    flex: 120,
                  },
                ],
              },
            ],
          },
        ],
      },
      styles: {
        footer: {
          separator: true,
        },
      },
    };
  },
};
