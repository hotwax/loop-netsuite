<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title color="dark">{{ translate(props.accountType == "sandbox" ? "Add NetSuite Sandbox RMA mapping" : "Add NetSuite Production RMA mapping") }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item lines="full">
      <ion-select label="Select Mapping Type" v-model="netsuiteRmaMap.enumId">
        <ion-select-option v-for="mapping in netSuiteMappinglist" :key="mapping.enumId" :value="mapping.enumId">{{ mapping.description }}</ion-select-option>
      </ion-select>
    </ion-item>
    <ion-item lines="full">
      <ion-input  label-placement="floating" :label="translate('NetSuite mapping values')" v-model="netsuiteRmaMap.mappingValue" type="number" required />
    </ion-item>
    <ion-fab horizontal="end" vertical="bottom" slot="fixed">
      <ion-fab-button @click="confirm">
        <ion-icon :icon="saveOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-content>
</template>

<script setup lang="ts">
import store from '@/store';
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
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps(["accountType", "systemMessageRemoteId"]);

const netSuiteMappinglist = ref([]);
const netsuiteRmaMap = ref({
  systemMessageRemoteId: props.systemMessageRemoteId,
  enumId: '',
  mappingValue: '',
});

onMounted(async() => {
  await getNetSuiteRMATypeMapping()
})

async function getNetSuiteRMATypeMapping() {
  const response = await store.dispatch('user/getNetSuiteRMATypeMapping');
  if (response) {
    netSuiteMappinglist.value = response.enumList
  }
}

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => modalController.dismiss(netsuiteRmaMap.value, 'save');
</script>