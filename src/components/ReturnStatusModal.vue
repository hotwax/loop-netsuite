<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button color="medium" @click="cancel">
          <ion-icon :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>{{ translate("Return Status History") }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-item>
        <ion-label>
          {{ "Loop Return Id" }}
        </ion-label>
        <p slot="end">{{ props.returnMap.loopReturnId }}</p>
      </ion-item>
      <ion-item>
        <div class="status-grid">
          <ion-label>
            {{ "Status" }}
          </ion-label>
          <ion-label>
            {{ "Date" }}
          </ion-label>
          <ion-label>
            {{ "Change Reason" }}
          </ion-label>
        </div>
      </ion-item>
      <ion-item v-for="(item , i) in dummyStatus" :key="i">
        <div class="status-grid">
          <ion-label>
            {{ item.status }}
          </ion-label>
          <ion-label>
            {{ item.timestamp }}
          </ion-label>
          <ion-label>
            {{ item.message ? item.message : '' }}
          </ion-label>
        </div>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script setup lang="ts">
import { translate } from '@/i18n';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { defineProps, ref } from 'vue';

const props = defineProps(["returnMap"]);
const dummyStatus = ref(
  [
  {
    "timestamp": "2025-09-22 02:28",
    "status": "Created",
    "message": null
  },
  {
    "timestamp": "2025-09-22 02:39",
    "status": "Pending Receipt",
    "message": null
  },
  {
    "timestamp": "2025-09-22 03:13",
    "status": "Pending Refund",
    "message": null
  },
  {
    "timestamp": "2025-09-22 08:31",
    "status": "Error",
    "message": "Unable to create refund for Loop Return ID: 88863737. Error: You must enter at least one line item for this transaction."
  }
]
)

const cancel = () => modalController.dismiss(null, 'cancel');
</script>
<style>
.status-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 3fr 6fr;
  align-items: center;
}
</style>