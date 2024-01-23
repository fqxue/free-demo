// ChatLogic.js
import { ref } from "vue";
import _ from "lodash";
import { apiMap, gptApiUrl } from "./apiConfig"; // 引入配置文件

export default {
  name: "ChatLogic",
  setup() {
    const selectedApi = ref("gptApi");
    const messages = ref([]);
    const userInput = ref("");
    const isLoading = ref(false);

    // 发送消息的逻辑
    async function sendMessage() {
      const trimmedMessage = _.trimStart(userInput.value);
      userInput.value = "";
      if (!trimmedMessage) return;

      messages.value.push({ role: "user", content: trimmedMessage });
      isLoading.value = true;

      try {
        let response;
        let data;
        let content;

        if (selectedApi.value === "gptApi") {
          // GPT API请求
          data = {
            messages: messages.value,
            model: "gpt-3.5-turbo-16k",
            temperature: 0.7,
            presence_penalty: 0,
          };

          response = await fetch(gptApiUrl, {
            headers: {
              accept: "text/event-stream",
              "content-type": "application/json",
              "x-requested-with": "XMLHttpRequest",
              Referer: "https://124389964761.ai701.live/",
            },
            body: JSON.stringify(data),
            method: "POST",
          });

          const result = await response.json();
          content = result.choices[0].message.content;
        } else {
          // 其他API请求
          response = await fetch(
            `${apiMap[selectedApi.value]}?msg=${trimmedMessage}`
          );
          const result = await response.json();
          content = result.data.output;
        }

        messages.value.push({ role: "assistant", content: content });
      } catch (error) {
        console.error("Failed to send message: ", error);
        messages.value.push({
          role: "assistant",
          content: "Sorry, there was an error.",
        });
      }

      isLoading.value = false;
    }

    return {
      selectedApi,
      messages,
      userInput,
      sendMessage,
      isLoading,
      apiMap,
    };
  },
};
