<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>{{ translate("Edit Your Profile") }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item lines="full">
      <ion-input label-placement="floating" :label="translate('User Id')" v-model="profile.userId" :readonly="true"></ion-input>
    </ion-item>
    <ion-item lines="full">
      <ion-input label-placement="floating" :label="translate('Full Name')" v-model="updateUserProfile.userFullName" type="text"></ion-input>
    </ion-item>
    <ion-item lines="full">
      <ion-input label-placement="floating" :label="translate('Username')" v-model="updateUserProfile.username" type="text"></ion-input>
    </ion-item>
    <ion-item lines="full">
      <ion-input label-placement="floating" :label="translate('Email')" v-model="updateUserProfile.emailAddress" type="email"></ion-input>
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
import { showToast } from '@/utils';
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
const profile = props.profile as any
const updateUserProfile = ref({
  userId: profile.userId,
  username: profile.username,
  userFullName: profile.userFullName,
  emailAddress: profile.emailAddress
});

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => {
  const { userFullName, username, emailAddress } = updateUserProfile.value;
  if (!userFullName.trim() || !username.trim() || !emailAddress.trim()) {
    showToast(translate("Please fill in all fields before submitting."));
    return;
  } else {
    modalController.dismiss(updateUserProfile.value, 'save');
  }
};
</script>