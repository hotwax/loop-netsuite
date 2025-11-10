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
      <ion-label>
        {{ translate("Import PEM File") }}
      </ion-label>
      <ion-label class="ion-text-right ion-padding-end">
        {{ uploadedFileName }}
      </ion-label>
      <input @change="uploadPemFile" ref="file" type="file" class="ion-hide"  id="updatePemFile" accept=".pem" required/>
      <label for="updatePemFile" class="pointer">
        {{ translate("Upload") }}
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
  IonLabel,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { defineProps, ref } from 'vue';

const props = defineProps(["accountType"]);
const uploadedFileName = ref('')

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
  uploadedFileName.value = selectedFile.name 
  netSuiteDetails.value.sshKey = selectedFile;
}
const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => {
  const { remoteId, sharedSecret, sendSharedSecret, sshKey } = netSuiteDetails.value;
  if (!remoteId.trim() || !sharedSecret.trim() || !sendSharedSecret.trim() || !sshKey) {
    showToast(translate("Please fill in all fields before saving."));
    return;
  } else {
    modalController.dismiss(netSuiteDetails.value, 'save')
  }
}
</script>