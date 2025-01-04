<script lang="ts">
import autowhizLogo from '../assets/logo.webp';

export default {
  props: {
    downUser: {
      type: [String, Object],
      required: true,
    },
  },
  mounted() {
    console.log("Menu component mounted");
    console.log("Prop downteste received in Menu.vue:", this.downUser);
  },
  data() {
    return {
      autowhizLogo
    };
  },
};
</script>


<template>
  <aside class="w-64 bg-white h-screen shadow-md flex flex-col justify-between">
    <div class="p-6">
      <h1 class="font-bold mb-4 text-[0px]">
        AutoWhiz
        <img :src="autowhizLogo.src" alt="AutoWhiz" class="w-full" />
      </h1>
      <nav class="space-y-2">
        <a href="#" class="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
          <span class="mr-3">
            <!-- Home Icon -->
            <span class="mdi mdi-home text-2xl"></span>
          </span>
          <span>Início</span>
        </a>

        <hr class="my-2 border-gray-300" />
        <a href="#" class="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
          <span class="mr-3">
            <!-- Profile Icon -->
            <span class="mdi mdi-account-circle text-2xl"></span>
          </span>
          <span>Perfil</span>
        </a>

        <a href="#" class="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
          <span class="mr-3">
            <!-- Settings Icon -->
            <span class="mdi mdi-cog-box text-2xl"></span>
          </span>
          <span>Configurações</span>
        </a>

      </nav>
    </div>

    <!-- Footer Note -->
    <div class="p-4 text-center text-gray-500">
      <form action="/api/auth/signout">
        <button type="submit" class="font-bold text-lg"><span class="mdi mdi-logout"></span> Sair</button>
      </form>
    </div>
  </aside>
</template>