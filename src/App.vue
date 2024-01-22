<template>
  <div class="chat-container">
    <div class="select-container">
      <span>模型：</span>
      <select v-model="selectedApi">
        <option v-for="(url, name) in apiMap" :key="name" :value="name">
          {{ name }}
        </option>
        <option value="gptApi">gpt-3.5-turbo-16k</option>
      </select>
    </div>

    <div class="messages">
      <div
        v-for="message in messages"
        :key="message.content"
        :class="{
          'message-user': message.role === 'user',
          'message-assistant': message.role === 'assistant',
        }"
      >
        <span class="message-content">{{ message.content }}</span>
      </div>
      <div v-if="isLoading" class="donut"></div>
    </div>

    <div class="input-area">
      <input
        v-model="userInput"
        type="text"
        class="input-field"
        placeholder="输入你的问题"
      />
      <button @click="sendMessage" class="send-button">发送</button>
    </div>
  </div>
</template>

<script src="./ChatLogic.js"></script>


<style>
* {
  box-sizing: border-box; /* 确保所有元素的盒模型不会因边框和内边距而增加尺寸 */
  padding: 0;
  margin: 0;
}

.chat-container {
  max-width: 600px;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.messages {
  padding: 10px;
  overflow-y: auto;
  background-color: #f9f9f9;
  flex-grow: 1; /* 让消息区域填充剩余空间 */
  flex-shrink: 1;
}

.input-area {
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  border-radius: 4px;
  flex-shrink: 0;
}

.select-container {
  margin: 10px;
  display: inline-block;
  flex-shrink: 0;
}

.select-container select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  appearance: none;
  cursor: pointer;
  font-size: 16px;
}

.select-container select:hover {
  border-color: #888;
}

.select-container select:focus {
  outline: none;
  border-color: #555;
}

.message-user,
.message-assistant {
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
}

.message-user {
  background-color: #e7f3fe;
  text-align: left;
}

.message-assistant {
  background-color: #d1e7dd;
  text-align: left;
}

.message-content {
  white-space: pre-wrap;
}

.input-field {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.send-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #0056b3;
}

@keyframes donut-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.donut {
  margin: auto;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #59a782;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: donut-spin 1.2s linear infinite;
}
</style>