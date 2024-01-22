import { ref, reactive } from "vue";
import _ from "lodash";

export default {
  name: "App",
  setup() {
    const apiMap = reactive({
      Gemini: "https://api.lolimi.cn/API/AI/gemini.php",
      文心一言: "https://api.lolimi.cn/API/AI/wx.php",
      软萌妹妹_沫沫AI: "https://api.lolimi.cn/API/AI/mm.php",
      傲娇姐姐_婧枫AI: "https://api.lolimi.cn/API/AI/jj.php",
      病变女友_黑雨AI: "https://api.lolimi.cn/API/AI/bj.php",
    });

    const selectedApi = ref("gptApi"); // 默认设置为GPT API
    const messages = ref([]);
    const userInput = ref("");
    const isLoading = ref(false);

    async function sendMessage() {
      const trimmedMessage = _.trimStart(userInput.value);
      userInput.value = "";
      if (!trimmedMessage) return;

      messages.value.push({ role: "user", content: trimmedMessage });
      isLoading.value = true;

      if (selectedApi.value === "gptApi") {
        // GPT API请求逻辑
        const data = {
          messages: messages.value,
          stream: true,
          model: "gpt-3.5-turbo-16k",
          temperature: 0.7,
          presence_penalty: 0,
        };

        try {
          let response = await fetch(
            "https://openai.lbbai.cc/v1/chat/completions",
            {
              headers: {
                accept: "text/event-stream",
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
                Referer: "https://124389964761.ai701.live/",
              },
              body: JSON.stringify(data),
              method: "POST",
            }
          );

          let text = await response.text();
          let content = processResponse(text);
          messages.value.push({ role: "assistant", content: content });
        } catch (error) {
          console.error("Failed to send message: ", error);
          messages.value.push({
            role: "assistant",
            content: "Sorry, there was an error.",
          });
        }
      } else {
        // 其他API请求逻辑
        try {
          const response = await fetch(
            `${apiMap[selectedApi.value]}?msg=${trimmedMessage}`
          );
          const data = await response.json();
          messages.value.push({ role: "assistant", content: data.data.output });
        } catch (error) {
          console.error("Failed to send message: ", error);
          messages.value.push({
            role: "assistant",
            content: "Sorry, there was an error.",
          });
        }
      }

      isLoading.value = false;
    }

    function processResponse(responseText) {
      try {
        let formattedText = responseText
          .replace(/data:/g, "")
          .replace(/\[DONE\]/g, "")
          .replace(/\s+/g, ",");
        let arrayString = `[${formattedText}]`;
        arrayString = arrayString.replace(",", "");
        let lastCommaIndex = arrayString.lastIndexOf(",");
        if (lastCommaIndex !== -1) {
          arrayString =
            arrayString.substring(0, lastCommaIndex) +
            arrayString.substring(lastCommaIndex + 1);
        }
        let json = JSON.parse(arrayString);
        let content = "";
        for (let i = 0; i < json.length; i++) {
          if (json[i].choices[0].delta.content) {
            let data = json[i].choices[0].delta.content;
            content += data;
          }
        }
        return content.replace(/,/g, " ");
      } catch (error) {
        console.error("Error processing the response: ", error);
        return "There was an error processing the response.";
      }
    }

    return {
      apiMap,
      selectedApi,
      messages,
      userInput,
      sendMessage,
      isLoading,
    };
  },
};
