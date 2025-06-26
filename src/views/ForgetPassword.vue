<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="auth-container">
        <ion-card>
          <form @keyup.enter="forgetPassword(form)" @submit.prevent="forgetPassword(form)">
            <Logo />
            <ion-card-header class="ion-text-center">
              <ion-card-title>{{translate("Reset Password")}}</ion-card-title>
              <ion-card-subtitle>{{translate("Enter your email and we'll send you a link to reset your password.")}}</ion-card-subtitle>
            </ion-card-header>
            <ion-item>
              <ion-input :label="translate('Email')" label-placement="fixed" v-model="forgetPasswordData.emailAddress"
                type="email"></ion-input>
            </ion-item>
            <div class="ion-padding">
              <ion-button type="submit" color="primary" expand="block">{{ translate("Send Link") }}</ion-button>
              <ion-button @click="router.push('/login')" fill="clear" expand="block">{{ translate("Back to Login") }}</ion-button>
            </div>
          </form>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import logger from '@/logger';
import { translate } from '@/i18n';
import { showToast, isValidEmail } from '@/utils';
import Logo from '@/components/Logo.vue';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonPage
} from "@ionic/vue";

const router = useRouter();
const store = useStore();

const forgetPasswordData = ref({
  emailAddress: '',
});

function validateCreateUserDetail() {
  const validationErrors: string[] = [];
  if (!forgetPasswordData.value.emailAddress) {
    validationErrors.push(translate('Email address is required.'));
  }
  if (
    forgetPasswordData.value.emailAddress &&
    !isValidEmail(forgetPasswordData.value.emailAddress)
  ) {
    validationErrors.push(translate('Invalid email address.'));
  }
  
  return validationErrors;
};

//  TODO: forgetPassword function is not functional yet, need to implement the API call
async function forgetPassword() {
  try {
    const validationErrors = validateCreateUserDetail();
    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.join(" ");
      logger.error(errorMessages);
      showToast(errorMessages);
      return;
    }

    const payload = {
      ...forgetPasswordData.value
    };

    showToast(translate('Reset link sent to your email.'));
  } catch (err: any) {
    let errorMessage = 'Failed to create user.'
    if (err?.response?.data?.error?.message) {
      errorMessage = err.response.data.error.message;
    }
    logger.error('error', err);
    showToast(translate(errorMessage));
  }
};

</script>

