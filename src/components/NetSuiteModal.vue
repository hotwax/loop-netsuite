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
      <ion-input  label-placement="floating" :label="(('NetSuite Account ID'))"  type="text" required />
    </ion-item>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="(('Open SHH Private Key'))"  type="text" required />
    </ion-item>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="(('NetSuite Consumer Key'))"  type="text" required />
    </ion-item>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="(('NetSuite Certificate ID'))"  type="text" required />
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
    modalController,
  } from '@ionic/vue';
  import { closeOutline, saveOutline } from 'ionicons/icons';
  import { defineProps, ref } from 'vue';
  const name = ref();
  const props = defineProps(["accountType"]);

  // Extract the accountType prop
  const accountType = props.accountType as string;
  
  // Methods to handle modal actions
  const cancel = () => modalController.dismiss(null, 'cancel');
  const confirm = () => modalController.dismiss(name.value, 'confirm');
</script>