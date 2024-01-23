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
<style src="./style.css"></style>
