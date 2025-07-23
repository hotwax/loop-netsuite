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
        <section class="ion-padding-horizontal">
          <ion-card>
            <ion-card-header>
              <ion-item lines="none">
                <ion-thumbnail slot="start">
                  <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                </ion-thumbnail>
                <ion-card-title>NetSuite Credentials</ion-card-title>
              </ion-item>
              <ion-item lines="none">
                <ion-chip :disabled="isChipDisabled('Sandbox' , 'NetSuite')" @click="openNetsuiteModal('Sandbox')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>Sandbox</ion-label></ion-chip>
                <ion-chip :disabled="isChipDisabled('Production', 'NetSuite')" @click="openNetsuiteModal('Producation')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>Producation</ion-label></ion-chip>
              </ion-item>
            </ion-card-header>
            <ion-list>
              <ion-item v-for="(credentials, index) in nsCredentialsList" :key="index">
                <ion-label>
                  {{ credentials.accountType }}
                  <p>{{ credentials.remoteId }}</p>
                </ion-label>
                <div slot="end" class="item-end">
                  <template v-if="credentials.verified === 'Y'">
                    <ion-note color="success">verified</ion-note>
                  </template>
                  <template v-else-if="credentials.verified === 'F'">
                    <ion-chip color="danger" :outline="true">
                      <ion-icon :icon="readerOutline"></ion-icon>
                      <ion-label>verification failed</ion-label>
                    </ion-chip>
                  </template>
                  <template v-else>
                    <ion-button color="warning" fill="outline" size="small" @click="verifyNetsuiteCredential(credentials.systemMessageRemoteId)">
                      Verify
                    </ion-button>
                  </template>
                  <ion-icon :icon="trashOutline" size="large" aria-hidden="true" color="medium" class="pointer" @click="deleteNetsuiteCredential(credentials)"></ion-icon>
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
                <ion-chip :disabled="isChipDisabled('Sandbox', 'Loop')" @click="openLoopModal('Sandbox')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{"Sandbox"}}</ion-label></ion-chip>
                <ion-chip :disabled="isChipDisabled('Production','Loop')" @click="openLoopModal('Producation')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{"Producation"}}</ion-label></ion-chip>
              </ion-item>
            </ion-card-header>
            <ion-list>
              <ion-item v-for="(loopCredentials, index) in loopCredentialsList" :key="index">
                <ion-label>
                  {{ loopCredentials.accountType }}
                  <p>{{ loopCredentials.remoteId }}</p>
                </ion-label>
                <div slot="end" class="item-end">
                  <template v-if="loopCredentials.verified === 'Y'">
                    <ion-note color="success">Active</ion-note>
                  </template>
                  <template v-else-if="loopCredentials.verified === 'F'">
                    <ion-chip color="danger" :outline="true">
                      <ion-icon :icon="readerOutline"></ion-icon>
                      <ion-label>Subscribe failed</ion-label>
                    </ion-chip>
                  </template>
                  <template v-else>
                    <ion-button color="warning" fill="outline" size="small" @click="verifyloopCredential(loopCredentials.systemMessageRemoteId)">
                      {{"Subscribe"}}
                    </ion-button>
                  </template>
                  <ion-icon :icon="trashOutline" size="large" aria-hidden="true" color="medium" class="pointer" @click="deleteLoopCredential(loopCredentials)"></ion-icon>
                </div>
              </ion-item>
            </ion-list>
          </ion-card>
        </section>
        <h1>Mapping</h1>
        <section class="ion-padding-horizontal">
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
  modalController,
  onIonViewDidEnter
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

const nsCredentialsList = ref([]);
const loopCredentialsList = ref([]);
 
onIonViewDidEnter(async() => {
  await fetchUserNetSuiteDetails();
  await fetchUserLoopDetails();
  await fetchUserProfile()
})

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
  if (role === 'save') {
    try {
      const response = await store.dispatch('user/netSuiteCredentials', data);
      if (response) {
        fetchUserNetSuiteDetails()
      }
      showToast("NetSuite credentials saved successfully.");
    } catch (error) {
      console.error("Error saving NetSuite credentials:", error);
      showToast("Failed to save NetSuite credentials.");
    }
  }
} 

async function openLoopModal(accountType: string ) {
  const modal = await modalController.create({
      component: LoopModal,
      componentProps: { accountType },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save') {
      try {
      const response = await store.dispatch('user/loopCredentials', data);
      if (response) {
        fetchUserLoopDetails()
      }
      showToast("NetSuite credentials saved successfully.");
    } catch (error) {
      console.error("Error saving NetSuite credentials:", error);
      showToast("Failed to save NetSuite credentials.");
    }
    }
}

async function fetchUserProfile() {
  try {
    const response = await store.dispatch('user/getProfile');
  } catch (error) {
    console.error("Error fetching user profile:", error);
    showToast("Failed to fetch user profile.");
  }
}

async function fetchUserNetSuiteDetails() {
  try {
    const response = await store.dispatch('user/getNetSuiteDetails');
    if (response) {
      nsCredentialsList.value = response.netsuiteRemoteList;
    } 
  } catch (error) {
    console.error("Error fetching user profile:", error);
    showToast("Failed to fetch user profile.");
  }
}

async function deleteNetsuiteCredential(data: string) {
  try {
    const response = await store.dispatch('user/deleteNetSuiteCredential', data);
    if (response) {
      nsCredentialsList.value = nsCredentialsList.value.filter(cred => cred.systemMessageRemoteId !== data.systemMessageRemoteId);
      showToast("NetSuite credential deleted successfully.");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    showToast("Failed to fetch user profile.");
  }
}

const isChipDisabled = (type: string, cardType : string) => {
  if (cardType === 'NetSuite') {
    return nsCredentialsList.value.some(cred => cred.accountType === type);
  } else if (cardType === 'Loop') {
    return loopCredentialsList.value.some(cred => cred.accountType === type);
  }
}; 

async function fetchUserLoopDetails() {
  try {
    const response = await store.dispatch('user/getLoopDetails');
    if (response) {
      loopCredentialsList.value = response.loopRemoteList;
    } 
  } catch (error) {
    console.error("Error fetching user profile:", error);
    showToast("Failed to fetch user profile.");
  }
}

async function deleteLoopCredential(data: string) {
  try {
    const response = await store.dispatch('user/deleteLoopCredential', data);
    if (response) {
      loopCredentialsList.value = loopCredentialsList.value.filter(cred => cred.systemMessageRemoteId !== data.systemMessageRemoteId);
      showToast("NetSuite credential deleted successfully.");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    showToast("Failed to fetch user profile.");
  }
}

async function verifyNetsuiteCredential(systemMessageRemoteId: string) {
  try {
    const response = await store.dispatch('user/verifyNetsuiteCredential');
    if (response) {
      loopCredentialsList.value = response.loopRemoteList;
    } 
  } catch (error) {
    console.error("Error fetching user profile:", error);
    showToast("Failed to fetch user profile.");
  }
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