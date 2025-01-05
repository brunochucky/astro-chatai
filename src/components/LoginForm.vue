<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Feedback de erro -->
    <div v-if="errorMessage" class="bg-red-500 text-white font-bold text-sm p-4">
      {{ errorMessage }}
    </div>

    <!-- Email -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        v-model="email"
        type="email"
        id="email"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Digite seu e-mail"
        required
      />
    </div>

    <!-- Senha -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">
        Senha
      </label>
      <input
        v-model="password"
        type="password"
        id="password"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Digite sua senha"
        required
      />
    </div>

    <!-- Botão -->
    <div>
      <button
        :disabled="loading"
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <svg
          v-if="loading"
          class="animate-spin h-5 w-5 text-white mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>{{ loading ? "Entrando..." : "Entrar" }}</span>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase/client";

export default defineComponent({
  name: "LoginForm",
  setup() {
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const errorMessage = ref("");

    const auth = getAuth(app);

    const handleSubmit = async () => {
      errorMessage.value = "";
      loading.value = true;

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        const idToken = await userCredential.user.getIdToken();
        const response = await fetch("/api/auth/signin", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (response.redirected) {
          window.location.assign(response.url);
        }
      } catch (error) {
        errorMessage.value = "Email ou senha incorretos.";
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      loading,
      errorMessage,
      handleSubmit,
    };
  },
});
</script>
