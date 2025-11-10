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
          {{ translate("Loop Return Id") }}
        </ion-label>
        <ion-label slot="end">{{ props.returnMap.loopReturnId }}</ion-label>
      </ion-item>
      <ion-item>
        <div class="status-grid">
          <ion-label>
            <strong>{{ translate("Status") }}</strong>
          </ion-label>
          <ion-label>
            <strong>{{ translate("Date") }}</strong>
          </ion-label>
          <ion-label>
            <strong>{{ translate("Change Reason") }}</strong>
          </ion-label>
        </div>
      </ion-item>
      <ion-item v-for="(item , i) in loopReturnStatus" :key="i">
        <div class="status-grid">
          <ion-label>
            {{ item.status }}
          </ion-label>
          <ion-label>
            {{ formatToLocalDateTime(item.statusDatetime) }}
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
import { DateTime } from 'luxon';

const props = defineProps(["response","returnMap"]);

const loopReturnStatus = ref(props.response.returnStatusDetailMap[props.returnMap.loopReturnId] || []);
function formatToLocalDateTime(timestamp: number) {
  if (!timestamp) return '';
  return DateTime
    .fromMillis(timestamp)
    .toLocal()
    .toFormat('MM-dd-yyyy hh:mm a');
}

const cancel = () => modalController.dismiss(null, 'cancel');
</script>
<style scoped>
.status-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 4fr 5fr;
  align-items: center;
}
</style>