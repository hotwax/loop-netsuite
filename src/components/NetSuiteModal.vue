<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title color="dark">{{accountType == "Sandbox" ? "Add NetSuite Sandbox" : "Add NetSuite Production" }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding-top">
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="(('NetSuite Account ID'))" v-model="netSuiteDetails.remoteId" type="text" required />
    </ion-item>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="(('NetSuite Consumer Key'))" v-model="netSuiteDetails.sharedSecret" type="text" required />
    </ion-item>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="(('NetSuite Certificate ID'))" v-model="netSuiteDetails.sendSharedSecret" type="text" required />
    </ion-item>
    <ion-item lines="full">
      <ion-icon :icon="cloudUploadOutline" slot="end" />
      <ion-label>
        {{ ("Import PEM File") }}
      </ion-label>
      <input @change="uploadPemFile" ref="file" type="file" class="ion-hide"  id="updatePemFile" accept=".pem"/>
      <label for="updatePemFile" class="pointer">
        {{ ("Upload PEM File") }}
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
  import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonItem,
    IonInput,
    IonIcon,
    IonFab,
    IonFabButton, 
    IonLabel,
    modalController,
  } from '@ionic/vue';
  import { closeOutline, saveOutline, cloudUploadOutline } from 'ionicons/icons';
  import { defineProps, ref } from 'vue';
  
  const props = defineProps(["accountType"]);

  const accountType = props.accountType as string;
  const netSuiteDetails = ref({
    remoteId: '',
    sharedSecret: '',
    sendSharedSecret: '',
    sshKey: '',
    accountType: accountType === 'Sandbox' ? 'Sandbox' : 'Production'
  });
     
  const uploadPemFile = async (event: any) => {
    const selectedFile = event.target.files[0];
    console.log(`Selected file: ${selectedFile}`);
    
    if (!selectedFile) {
      return;
    }
    netSuiteDetails.value.sshKey = selectedFile;
  }
  const cancel = () => modalController.dismiss(null, 'cancel');
  const confirm = () => modalController.dismiss(netSuiteDetails.value, 'save')
</script>