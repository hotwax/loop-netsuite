<template>
  <ion-page>
    <ion-content>
      <div class="flex-container">
        <ion-card>
          <form class="form-card" @keyup.enter="userRegister(form)" @submit.prevent="userRegister(form)">
            <Logo />
            <ion-item>
              <ion-input label-placement="floating" :label="translate('Full name')" v-model="registerData.fullName">
                 <ion-text color="danger">*</ion-text>
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-input label-placement="floating" :label="translate('Email Address')" v-model="registerData.emailAddress" type="email">
                <ion-text color="danger">*</ion-text>
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-input label-placement="floating" :label="translate('Password')" name="password"
                v-model="registerData.password" id="password" type="password" required />
            </ion-item>

            <ion-item>
              <ion-input label-placement="floating" :label="translate('Confirm Password')" name="password"
                v-model="registerData.confirmPassword" id="password" type="password" required />
            </ion-item>

            <div class="ion-padding">
              <ion-button type="submit" expand="block">{{ translate("Register") }}</ion-button>
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
import { translate } from '@/i18n';
import { showToast, isValidEmail, isValidPassword } from '@/utils';
import logger from '@/logger';
import Logo from '@/components/Logo.vue';
import {
  IonButton,
  IonCard,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonText
} from '@ionic/vue';

const router = useRouter();
const store = useStore();

const registerData = ref({
  fullName: '',
  emailAddress: '',
  password: '',
  confirmPassword: ''
});

function validateCreateUserDetail() {
  const validationErrors: string[] = [];

  if (!registerData.value.fullName) {
    validationErrors.push(translate("Name is required."));
  }
  if (!registerData.value.emailAddress) {
    validationErrors.push(translate("Email address is required."));
  }
  if (
    registerData.value.emailAddress &&
    !isValidEmail(registerData.value.emailAddress)
  ) {
    validationErrors.push(translate("Invalid email address."));
  }
  if (
    registerData.value.password &&
    !isValidPassword(registerData.value.password)
  ) {
    validationErrors.push(translate("Password is not valid"));
  }
  if (
    registerData.value.password &&
    registerData.value.confirmPassword &&
    registerData.value.password !== registerData.value.confirmPassword
  ) {
    validationErrors.push(translate("Password is not matching with confirm password."));
  }

  return validationErrors;
}
// TODO: userRegister function is not functional yet, need to implement the API call
async function userRegister() {
  try {
    const validationErrors = validateCreateUserDetail();

    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.join(' ');
      logger.error(translate(errorMessages));
      showToast(translate(errorMessages));
      return;
    }

    const payload = {
      ...registerData.value
    };

    const response = await store.dispatch('user/register', payload);
    showToast(translate("User created successfully"));
    router.push('/login');

  } catch (err: any) {
    let errorMessage = "Failed to create user.";
    if (err?.response?.data?.error?.message) {
      errorMessage = err.response.data.error.message;
    }
    logger.error('error', err);
    showToast(translate(errorMessage));
  }
}
</script>
