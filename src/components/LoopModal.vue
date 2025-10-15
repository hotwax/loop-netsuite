<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>{{ translate(props.accountType == "sandbox" ? "Add Loop Sandbox" : "Add Loop Production") }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="translate('Access Key')" v-model="loopDetails.privateKey" type="text" required />
    </ion-item>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="translate('Webhook Secret')" v-model="loopDetails.sendSharedSecret" type="text" required />
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

const props = defineProps(["accountType"]);

const loopDetails = ref({
  privateKey: '',
  sendSharedSecret: '',
  accountType: props.accountType
});

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => {
  if (!loopDetails.value.privateKey.trim() || !loopDetails.value.sendSharedSecret.trim()) {
    showToast(translate("Please fill in all fields before saving."));
    return;
  } else {
    modalController.dismiss(loopDetails.value, 'save')
  }
}
</script>