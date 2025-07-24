<template>
  <ion-page>
    <ion-content>
      <div class="flex-container">
        <ion-card>
          <form class="form-card" @keyup.enter="userRegister(form)" @submit.prevent="userRegister(form)">
            <Logo />
            <ion-item>
              <ion-input label-placement="floating" :label="translate('Full name')" v-model="registerData.userFullName">
                 <ion-text color="danger">*</ion-text>
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-input label-placement="floating" :label="translate('Email Address')" v-model="registerData.emailAddress" type="email">
                <ion-text color="danger">*</ion-text>
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-input label-placement="floating" :label="translate('Organization Name')" v-model="registerData.organizationName" type="text">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-input label-placement="floating" :label="translate('Username')" v-model="registerData.username" type="text">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-input label-placement="floating" :label="translate('Contact Number')" v-model="registerData.contactNumber" type="number">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-input label-placement="floating" :label="translate('Password')" name="password"
                v-model="registerData.newPassword" id="password" type="password" required />
            </ion-item>
            <ion-item>
              <ion-input label-placement="floating" :label="translate('Confirm Password')" name="password"
                v-model="registerData.newPasswordVerify" id="password" type="password" required />
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
  userFullName: '',
  emailAddress: '',
  organizationName: '',
  username: '',
  contactNumber: '',
  newPassword: '',
  newPasswordVerify: ''
});

function validateCreateUserDetail() {
  const validationErrors: string[] = [];

  if(!registerData.value.userFullName?.trim()) {
    validationErrors.push(translate("Name is required."));
  }
  if(!registerData.value.emailAddress) {
    validationErrors.push(translate("Email address is required."));
  }
  if(registerData.value.emailAddress && !isValidEmail(registerData.value.emailAddress)) {
    validationErrors.push(translate("Invalid email address."));
  }
  if(registerData.value.newPassword && !isValidPassword(registerData.value.newPassword)) {
    validationErrors.push(translate("Password is not valid"));
  }
  if(registerData.value.newPassword &&registerData.value.newPasswordVerify && registerData.value.newPassword !== registerData.value.newPasswordVerify) {
    validationErrors.push(translate("Password is not matching with confirm password."));
  }

  return validationErrors;
}
// TODO: userRegister function is not functional yet, need to implement the API call
async function userRegister() {
  try {
    const validationErrors = validateCreateUserDetail();

    if(validationErrors.length) {
      const errorMessages = validationErrors.join(' ');
      logger.error(translate(errorMessages));
      showToast(translate(errorMessages));
      return;
    }

    const payload = {...registerData.value};
    console.log("Register Payload:  eee ", payload);
    

    const response: any = await store.dispatch('user/register', payload);
    console.log("Register Response: ", response);
    
    showToast(translate("User created successfully"));
    router.push('/login');

  } catch (err: any) {
    let errorMessage = "Failed to create user.";
    if(err?.response?.data?.error?.message) {
      errorMessage = err.response.data.error.message;
    }
    logger.error('error', err);
    showToast(errorMessage);
  }
}
</script>
