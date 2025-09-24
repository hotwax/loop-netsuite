<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title color="dark">{{ translate(accountType == "Sandbox" ? "Add Loop Sandbox" : "Add Loop Production") }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding-top">
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="(translate('Access Key'))" v-model="loopDetails.privateKey" type="text" required />
    </ion-item>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="(translate('Webhook Secret'))" v-model="loopDetails.sendSharedSecret" type="text" required />
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

const props = defineProps(["accountType"]);

const accountType = props.accountType as string;
const loopDetails = ref({
  privateKey: '',
  sendSharedSecret: '',
  accountType: accountType === 'Sandbox' ? 'Sandbox' : 'Production'
});

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => modalController.dismiss(loopDetails.value, 'save');
</script>