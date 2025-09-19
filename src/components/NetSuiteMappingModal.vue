<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title color="dark">{{accountType == "Sandbox" ? "Add NetSuite Sandbox RMA Mapping" : "Add NetSuite Production RMA Mapping" }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding-top">
    <ion-item lines="full">
      <ion-select label="Select Mapping Type" v-model="netsuiteRmaMap.enumId">
        <ion-select-option v-for="mapping in netSuiteMappinglist" :key="mapping.enumId" :value="mapping.enumId">{{ mapping.description }}</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="(('NetSuite Mapping Value'))" v-model="netsuiteRmaMap.mappingValue" type="text" required />
    </ion-item>
    <ion-fab horizontal="end" vertical="bottom" slot="fixed">
      <ion-fab-button @click="confirm">
        <ion-icon :icon="saveOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-content>
</template>

<script setup lang="ts">
import logger from '@/logger';
import store from '@/store';
import { showToast } from '@/utils';
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
  IonSelect,
  IonSelectOption,
  modalController,
} from '@ionic/vue';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps(["accountType", "systemMessageRemoteId"]);



const accountType = props.accountType as string;
const systemMessageRemoteId = props.systemMessageRemoteId as any;
const netSuiteMappinglist = ref([]);
const netsuiteRmaMap = ref({
  systemMessageRemoteId: systemMessageRemoteId,
  enumId: '',
  mappingValue: '',
});

onMounted(async() => {
  await getNetSuiteRMAMappingList()
})

async function getNetSuiteRMAMappingList() {
  try {
    const response = await store.dispatch('user/getNetSuiteRMAMappingList');
    if (!response) {
      showToast("Unable to fetch NetSuite RMA Mapping List");
    } else {
      netSuiteMappinglist.value = response.enumList
    }
  } catch (error) {
    logger.error(error);
    showToast("Unable to fetch NetSuite RMA Mapping List");
  }
}

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => modalController.dismiss(netsuiteRmaMap.value, 'save');
</script>