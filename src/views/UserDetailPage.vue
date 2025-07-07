<template>
  <ion-page>
    <ion-header :translucent="true" >
      <ion-toolbar>
        <ion-item lines="none" slot="start">
          <h3>Hotwax Commnerce</h3>
        </ion-item>
          <ion-segment v-model="segmentSelected" @ionChange="segmentChanged">
            <ion-segment-button value="Configuration">
              <ion-label>{{ $t("Configuration") }}</ion-label>
            </ion-segment-button>
            <ion-segment-button value="account">
              <ion-label>{{ $t("Account") }}</ion-label>
            </ion-segment-button>
            <ion-segment-button value="SyncStatus">
              <ion-label>{{ $t("Sync Status") }}</ion-label>
            </ion-segment-button>
          </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content ref="contentRef" :scroll-events="true" >
      <div v-if="segmentSelected === 'Configuration'">
        <h1>Connect</h1>
        <section>
          <ion-card>
            <ion-card-header>
              <ion-item lines="none">
                <ion-thumbnail slot="start">
                  <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                </ion-thumbnail>
                <ion-card-title>NetSuite Credentials</ion-card-title>
              </ion-item>
              <ion-item lines="none">
                <ion-chip @click="openNetsuiteModal('Sandbox')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>Sandbox</ion-label></ion-chip>
                <ion-chip @click="openNetsuiteModal('Producation')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>Producation</ion-label></ion-chip>
              </ion-item>
            </ion-card-header>
            <ion-list>
              <ion-item>
                  <ion-label>
                    Sandbox
                    <p>&lt;account id&gt;</p>
                  </ion-label>
                <div  class="item-end">
                  <ion-button color="warning" fill="outline" size="small">{{ "verify" }}</ion-button>
                  <ion-icon :icon=trashOutline size="large" aria-hidden="true" color="medium"></ion-icon>
                </div>
              </ion-item>
              <ion-item>
                  <ion-label>
                    Sandbox
                    <p>&lt;account id&gt;</p>
                  </ion-label>
                <div slot="end" class="item-end">
                  <ion-note color="success">{{ "verified" }}</ion-note>
                  <ion-icon :icon=trashOutline size="large" aria-hidden="true" color="medium"></ion-icon>
                </div>
              </ion-item>
              <ion-item>
                  <ion-label>
                    Sandbox
                    <p>&lt;account id&gt;</p>
                  </ion-label>
                <div slot="end" class="item-end">
                  <ion-chip color="danger" :outline="true"><ion-icon :icon="readerOutline"></ion-icon><ion-label>verification failed</ion-label></ion-chip>
                  <ion-icon :icon=trashOutline size="large" aria-hidden="true" color="medium"></ion-icon>
                </div>
              </ion-item>
            </ion-list>
          </ion-card>
          <ion-card>
            <ion-card-header>
              <ion-item lines="none">
                <ion-thumbnail slot="start">
                  <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                </ion-thumbnail>
                <ion-card-title>{{"Loop Credentials"}}</ion-card-title>
              </ion-item>
              <ion-item lines="none">
                <ion-chip @click="openLoopModal('Sandbox')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{"Sandbox"}}</ion-label></ion-chip>
                <ion-chip @click="openLoopModal('Producation')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{"Producation"}}</ion-label></ion-chip>
              </ion-item>
            </ion-card-header>
            <ion-list>
              <ion-item>
                <ion-label>
                  {{"Sandbox"}}
                  <p>&lt;account id&gt;</p>
                </ion-label>
                <div slot="end" class="item-end">
                  <ion-button color="warning" fill="outline" size="small">{{ "Subscribe" }}</ion-button>
                  <ion-icon :icon=trashOutline size="large" aria-hidden="true" color="medium"></ion-icon>
                </div>
              </ion-item>
              <ion-item>
                <ion-label>
                  {{"Sandbox"}}
                  <p>&lt;account id&gt;</p>
                </ion-label>
                <div slot="end" class="item-end">
                  <ion-note color="success">{{ "Active" }}</ion-note>
                  <ion-icon :icon=trashOutline size="large" aria-hidden="true" color="medium"></ion-icon>
                </div>
              </ion-item>
              <ion-item>
                <ion-label>
                  {{"Sandbox"}}
                  <p>&lt;account id&gt;</p>
                </ion-label>
                <div slot="end" class="item-end">
                  <ion-chip color="danger" :outline="true"><ion-icon :icon="readerOutline"></ion-icon><ion-label>subscription failed</ion-label></ion-chip>
                  <ion-icon :icon=trashOutline size="large" aria-hidden="true" color="medium"></ion-icon>
                </div>
              </ion-item>
            </ion-list>
          </ion-card>
        </section>
        <h1>Mapping</h1>
        <section>
          <ion-card>
            <ion-card-header>
              <ion-card-title>NetSuite</ion-card-title>
            </ion-card-header>
            <ion-item lines="full">
              <ion-input  label-placement="floating" :label="(('Warehouse Location Id'))"  type="text" required />
            </ion-item>
            <ion-item lines="full">
              <ion-input  label-placement="floating" :label="(('Default Payment Method Id'))"  type="text" required />
            </ion-item>
            <ion-item lines="full">
              <ion-input  label-placement="floating" :label="(('Variance Item Id'))"  type="text" required />
            </ion-item>
            <ion-item lines="full">
              <ion-input  label-placement="floating" :label="(('Loop Exchange Item Id'))"  type="text" required />
            </ion-item>
            <ion-item lines="full">
              <ion-input  label-placement="floating" :label="(('Discount Item Id'))"  type="text" required />
            </ion-item>
            <ion-item lines="full">
              <ion-input  label-placement="floating" :label="(('Gift Card Item Id'))"  type="text" required />
            </ion-item>
            <ion-item lines="full">
              <ion-input  label-placement="floating" :label="(('Gift Card Payment Method Id'))"  type="text" required />
            </ion-item>
            <ion-button fill="clear">Save Mappings</ion-button>
         </ion-card>
        </section>
      </div>
      <div v-if="segmentSelected === 'account'">
      </div>
      <div v-if="segmentSelected === 'SyncStatus'">
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonThumbnail,
  IonToolbar,
  IonButton,
  IonNote,
  IonInput,
  modalController
} from "@ionic/vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { showToast } from "@/utils";
import { addOutline, readerOutline, trashOutline } from "ionicons/icons";
import NetSuiteModal from "@/components/NetSuiteModal.vue";
import LoopModal from "@/components/LoopModal.vue";
// router and store setup
const router = useRouter();
const store = useStore();

// reactive state
const segmentSelected = ref('Configuration');

const credentials = ref([
  { env: 'Sandbox', status: 'verify' },
  { env: 'Sandbox', status: 'verified' },
  { env: 'Sandbox', status: 'failed' }
]);

// segment change handler
function segmentChanged(e: CustomEvent) {
  segmentSelected.value = e.detail.value;

  if (segmentSelected.value === 'Configuration') {
    // configuration()
  } else if (segmentSelected.value === 'account') {
    // account()
  } else {
    // syncStatus()
  }
}

async function openNetsuiteModal(accountType: string ) {
  const modal = await modalController.create({
      component: NetSuiteModal,
      componentProps: { accountType },

    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    // if (role === 'confirm') {
    //   message.value = `Hello, ${data}!`;
    // }
} 

async function openLoopModal(accountType: string ) {
  const modal = await modalController.create({
      component: LoopModal,
      componentProps: { accountType },

    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    // if (role === 'confirm') {
    //   message.value = `Hello, ${data}!`;
    // }
}
</script>
<style scoped>
@media (min-width: 431px) {
  section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(431px, 1fr));
  }
}

h1 {
  margin: 24px 24px 0;
}

.item-end {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
