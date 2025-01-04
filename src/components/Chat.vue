
<script lang="ts">
export default {
  props: {
    downUser: {
      type: [String, Object],
      required: true,
    },
  },
  mounted() {
    console.log("Chat component mounted");
    console.log("Prop downteste received in Chat.vue:", this.downUser);
  },
  data() {
    return {
      messages: [{ from: "bot", text: "Olá, <b>" + this.downUser.displayName +"</b> por favor, descreva o veículo que você gostaria de diagnosticar." }],
      botTyping: false,
      userInput: "",
    };
  },
  methods: {
    updateChat() {
      console.log("updateChat triggered");
      const input = this.userInput.trim();
      if (!input) return;

      // Add user's message to chat
      this.messages.push({ from: "user", text: input });

      // Send message to server
      this.botTyping = true;
      fetch("http://autowhiz.local/send_message.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ user_input: input }),
      })
        .then((response) => response.text()) // Get response as text
        .then((data) => {
          // Process server response
          const jsonStrings = data
            .split("data: ")
            .filter((chunk) => chunk.trim());

          jsonStrings.forEach((jsonString) => {
            try {
              const jsonData = JSON.parse(jsonString.trim());
              if (jsonData.error) {
                this.displayError(jsonData.error); // Handle error response
              } else {
                this.displayBotResponse(jsonData); // Handle successful response
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          });
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => {
          this.botTyping = false;
        });

      // Clear user input
      this.userInput = "";
    },
    displayBotResponse(data) {
      // Add bot's response to the chat
      this.messages.push({
        from: "bot",
        text: data.choices[0].message.content || "Desculpe, não entendi.",
      });
      this.scrollToBottom();
    },
    scrollToBottom() {
      const messagesContainer = document.getElementById("messages");
      messagesContainer.scrollTop =
        messagesContainer.scrollHeight - messagesContainer.clientHeight;
    },
  },
};
</script>

<style>
  @import url("https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css");
</style>

<template>
  <div
    id="app"
    class="flex-1 p-2 sm:p-6 justify-between flex flex-col h-screen bg-white w-full"
  >
    <!-- Messages -->
    <div
      id="messages"
      class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div v-for="(message, index) in messages" :key="index">
        <div
          class="flex items-end"
          :class="message.from === 'bot' ? '' : 'justify-end'"
        >
          <div
            class="flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2"
            :class="message.from === 'bot' ? 'order-2 items-start' : 'order-1 items-end'"
          >
            <div>
              <span
                class="px-4 py-3 rounded-xl inline-block"
                :class="message.from === 'bot' ? 'rounded-bl-none bg-gray-100 text-gray-600' : 'rounded-br-none bg-blue-500 text-white'"
                v-html="message.text"
              ></span>
            </div>
          </div>
          <img
            :src="message.from === 'bot' 
              ? '//cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png' 
              : '//i.pravatar.cc/100?img=7'"
            alt=""
            class="w-6 h-6 rounded-full"
            :class="message.from === 'bot' ? 'order-1' : 'order-2'"
          />
        </div>
      </div>
      <div v-if="botTyping">
        <div class="flex items-end">
          <div
            class="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start"
          >
            <div>
              <img
                src="//support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif"
                alt="Typing indicator"
                class="w-16 ml-6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div class="relative flex">
        <input
          v-model="userInput"
          type="text"
          placeholder="Envie uma mensagem para o AutoWhiz..."
          autocomplete="off"
          @keydown.enter="updateChat"
          class="text-md w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-red-500 rounded-full py-2"
        />
        <div class="absolute right-2 items-center inset-y-0 hidden sm:flex">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-200 ease-in-out text-white bg-black hover:bg-gray-600 focus:outline-none"
            @click="updateChat()"
          >
            <i class="mdi mdi-arrow-right text-xl leading-none"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

