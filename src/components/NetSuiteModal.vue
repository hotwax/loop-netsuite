<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>{{ translate(props.accountType == "sandbox" ? "Add NetSuite Sandbox credentials" : "Add NetSuite Production credentials") }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="translate('NetSuite Account ID')" v-model="netSuiteDetails.remoteId" type="text" required />
    </ion-item>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="translate('NetSuite Consumer Key')" v-model="netSuiteDetails.sharedSecret" type="text" required />
    </ion-item>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="translate('NetSuite Certificate ID')" v-model="netSuiteDetails.sendSharedSecret" type="text" required />
    </ion-item>
    <ion-item lines="full">
      <ion-icon :icon="cloudUploadOutline" slot="end" />
      <ion-label>
        {{ translate("Import PEM File") }}
      </ion-label>
      <input @change="uploadPemFile" ref="file" type="file" class="ion-hide"  id="updatePemFile" accept=".pem"/>
      <label for="updatePemFile" class="pointer">
        {{ translate("Upload PEM File") }}
      </label>
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
  IonLabel,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import { closeOutline, saveOutline, cloudUploadOutline } from 'ionicons/icons';
import { defineProps, ref } from 'vue';

const props = defineProps(["accountType"]);

const netSuiteDetails = ref({
  remoteId: '',
  sharedSecret: '',
  sendSharedSecret: '',
  sshKey: '',
  accountType: props.accountType
});
    
const uploadPemFile = async (event: any) => {
  const selectedFile = event.target.files[0];
  if (!selectedFile) {
    return;
  }
  netSuiteDetails.value.sshKey = selectedFile;
}
const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => modalController.dismiss(netSuiteDetails.value, 'save')
</script>