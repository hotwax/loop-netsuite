<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="auth-container">
        <ion-card>
          <form class="forgetPassword-container" @keyup.enter="forgetPassword(form)"
            @submit.prevent="forgetPassword(form)">
            <Logo />
            <ion-card-header class="ion-text-center">
              <ion-card-title>Reset Password</ion-card-title>
              <ion-card-subtitle>Enter your email and we'll send you a link to reset your password.</ion-card-subtitle>
            </ion-card-header>
            <ion-item>
              <ion-input :label="$t('Email')" label-placement="fixed" v-model="forgetPasswordData.emailAddress"
                type="email"></ion-input>
            </ion-item>
            <div class="ion-padding">
              <ion-button type="submit" color="primary" expand="block">{{ $t("forgetPassword") }}</ion-button>
              <ion-button @click="navigate('/login')" fill="clear" expand="block">{{ $t("Back to Login") }}</ion-button>
            </div>
          </form>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { useStore } from "@/store";
import { defineComponent } from "vue";
import { mapGetters } from 'vuex';
import Logo from '@/components/Logo.vue';
import logger from '@/logger';
import { showToast, isValidEmail, isValidPassword } from '@/utils'
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle
} from "@ionic/vue";

export default defineComponent({
  name: "ForgetPassword",
  components: {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonPage,
    IonCard,
    Logo,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle
  },
  data() {
    return {
      forgetPasswordData: {
        emailAddress: '',
      }
    };
  },
  computed: {
    ...mapGetters({
    })
  },
  methods: {
    validateCreateUserDetail(forgetPasswordData: any) {
      const validationErrors = [];
      if(!forgetPasswordData.emailAddress) {
        validationErrors.push(('Email address is required.'));
      }
      if(forgetPasswordData.emailAddress && !isValidEmail(forgetPasswordData.emailAddress)) {
        validationErrors.push(('Invalid email address.'));
      }
      return validationErrors;
    },
    forgetPassword(form: any) {
      try {
        const validationErrors = this.validateCreateUserDetail({ ...this.forgetPasswordData });
        if(validationErrors.length > 0) {
          const errorMessages = validationErrors.join(" ");
          logger.error(errorMessages);
          showToast((errorMessages));
          return;
        }
        const payload = {
          ...this.forgetPasswordData,

        }
      } catch (err: any) {
        let errorMessage = ('Failed to create user.');
        if (err?.response?.data?.error?.message) {
          errorMessage = err.response.data.error.message
        }
        logger.error('error', err)
        showToast(errorMessage);
      }
    },
    navigate: function (route: string) {
      this.router.push({ path: route });
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
.auth-container {
  max-width: 400px;
  margin: auto;
  padding-top: 100px;
}
</style>
