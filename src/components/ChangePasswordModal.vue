<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title color="dark">{{ translate("Change Password") }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding-top">
    <ion-item lines="full">
      <ion-input label-placement="floating" :label="translate('Old Password')" v-model="changePassword.oldPassword" type="text"></ion-input>
    </ion-item>
    <ion-item lines="full">
      <ion-input label-placement="floating" :label="translate('New Password')" v-model="changePassword.newPassword" type="text"></ion-input>
    </ion-item>
    <ion-item lines="full">
      <ion-input label-placement="floating" :label="translate('Confirm Password')" v-model="changePassword.newPasswordVerify" type="email"></ion-input>
    </ion-item>
    <ion-fab horizontal="end" vertical="bottom" slot="fixed">
      <ion-fab-button @click="confirm">
        <ion-icon :icon="saveOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-content>
</template>

<script setup lang="ts">
import { translate } from '@/i18n';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { defineProps, ref } from 'vue';

const props = defineProps(["profile"]);

const changePassword = ref({
  userId: props.profile.userId,
  oldPassword: '',
  newPassword: '',
  newPasswordVerify: ''
});

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => modalController.dismiss(changePassword.value, 'save');
</script>