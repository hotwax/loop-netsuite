<template>
  <ion-page>
    <ion-content>
      <div class="flex">
        <ion-card>
        <form class="login-container" @keyup.enter="login(form)" @submit.prevent="login(form)">
          <Logo />
          <ion-item lines="full" v-if="!baseURL">
            <ion-input label-placement="fixed" :label="($t('OMS'))" name="instanceUrl" v-model="instanceUrl" id="instanceUrl" type="text" required />
          </ion-item>
          <ion-item lines="full">
            <ion-input label-placement="fixed" :label="($t('Email'))" name="username" v-model="username" id="email" type="text" required />
          </ion-item>
          <ion-item lines="full">
            <ion-input label-placement="fixed" :label="($t('Password'))" name="password" v-model="password" id="password" type="password" required />
          </ion-item>

          <div class="ion-padding">
            <ion-button type="submit" color="primary"  expand="block">{{$t("Login") }}</ion-button>
            <ion-button type="button" @click="navigate('/forgotPassword')" color="primary" fill="clear" expand="block">{{("Forgot Password?") }}</ion-button>
          </div>
        </form>
         </ion-card>
         <ion-button @click="navigate('/register')" color="dark" >{{("Register") }}</ion-button>
       </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonCard
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { mapGetters } from 'vuex';
import {showToast} from "@/utils";
import Logo from '@/components/Logo.vue';

export default defineComponent({
  name: "Login",
  components: {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonPage,
    Logo,
    IonCard
  },
  data() {
    return {
      username: "",
      password: "",
      instanceUrl: "",
      baseURL: process.env.VUE_APP_BASE_URL,
      alias: JSON.parse(process.env.VUE_APP_ALIAS as any)
    };
  },
  computed: {
    ...mapGetters({
      currentInstanceUrl: 'user/getInstanceUrl'
    })
  },
  mounted() {
    this.instanceUrl = this.currentInstanceUrl;
  },
  methods: {
    login: function () {
      const instanceURL = this.instanceUrl.trim().toLowerCase();
      if(!this.baseURL) this.store.dispatch("user/setUserInstanceUrl", this.alias[instanceURL] ? this.alias[instanceURL] : instanceURL);
      const { username, password } = this;
      this.store.dispatch("user/login", { username, password }).then((data: any) => {
        if (data.api_key) {
          this.username = ''
          this.password = ''
          this.router.push('/home');
        }
      }).catch((error: any) => {
        showToast(this.$t("Username or password is incorrect"));
      });
    },
    navigate: function (route: string) {
      this.router.push({ path : route });
    }
  },
  
  setup() {
    const router = useRouter();
    const store = useStore();
    return { router, store };
  }
});
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