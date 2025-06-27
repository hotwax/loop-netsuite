<template>
  <ion-page>
    <ion-content>
      <div class="flex">
        <ion-card>
        <form class="login-container" @keyup.enter="login(form)" @submit.prevent="login(form)">
          <Logo />
          <ion-item lines="full" v-if="!baseURL">
            <ion-input label-placement="fixed" :label="(translate('OMS'))" v-model="instanceUrl" type="text" required />
          </ion-item>
          <ion-item lines="full">
            <ion-input label-placement="fixed" :label="(translate('Username'))" v-model="username" type="text" required />
          </ion-item>
          <ion-item lines="full">
            <ion-input label-placement="fixed" :label="(translate('Password'))" v-model="password" type="password" required />
          </ion-item>

          <div class="ion-padding">
            <ion-button type="submit" color="primary"  expand="block">{{translate("Login") }}</ion-button>
            <ion-button type="button" @click="router.push('/forgetPassword')" color="primary" fill="clear" expand="block">{{translate("Forget Password?") }}</ion-button>
          </div>
        </form>
         </ion-card>
         <ion-button @click="router.push('/register')" color="dark" >{{translate("Register") }}</ion-button>
       </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonCard,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
} from "@ionic/vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { showToast } from "@/utils";
import { translate } from "@/i18n";

import Logo from "@/components/Logo.vue";

const router = useRouter();
const store = useStore();

const username = ref("");
const password = ref("");
const instanceUrl = ref("");

const baseURL = process.env.VUE_APP_BASE_URL;
const alias = JSON.parse(process.env.VUE_APP_ALIAS as string);

const currentInstanceUrl = computed(() => store.getters["user/getInstanceUrl"]);

onMounted(() => {
  instanceUrl.value = currentInstanceUrl.value;
});

const login = async () => {
  const trimmedInstanceUrl = instanceUrl.value.trim().toLowerCase();
  if (!baseURL) {
    const resolvedUrl = alias[trimmedInstanceUrl] || trimmedInstanceUrl;
    store.dispatch("user/setUserInstanceUrl", resolvedUrl);
  }

  try {
    const response: any = await store.dispatch("user/login", {
      username: username.value,
      password: password.value,
    });

    if (response.api_key) {
      username.value = "";
      password.value = "";
      router.push("/home");
    }
  } catch (error) {
    showToast(translate("Username or password is incorrect"));
  }
};

</script>
<style scoped>
.login-container {
  width: 375px;
}

.flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>