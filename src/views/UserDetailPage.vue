<template>
  <ion-page>
    <ion-header :translucent="true" >
      <ion-toolbar>
        <ion-item lines="none" slot="start">
          <h3>{{ profile.organizationName }}</h3>
        </ion-item>
          <ion-segment v-model="segmentSelected" @ionChange="segmentChanged">
            <ion-segment-button value="Configuration">
              <ion-label>{{ translate("Configuration") }}</ion-label>
            </ion-segment-button>
            <ion-segment-button value="account">
              <ion-label>{{ translate("Account") }}</ion-label>
            </ion-segment-button>
            <ion-segment-button value="SyncStatus">
              <ion-label>{{ translate("Sync Status") }}</ion-label>
            </ion-segment-button>
          </ion-segment>
      </ion-toolbar>
    </ion-header>
   
    <ion-content ref="contentRef" :scroll-events="true" >
      <div v-if="segmentSelected === 'Configuration'">
        <h1>{{ translate("Connect") }}</h1>
        <section class="ion-padding-horizontal">
          <div>
            <ion-card>
              <ion-card-header>
                <ion-item lines="none">
                  <ion-thumbnail slot="start">
                    <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                  </ion-thumbnail>
                  <ion-card-title>{{ translate("NetSuite Credentials") }}</ion-card-title>
                </ion-item>
                <ion-item lines="none">
                  <ion-chip :disabled="isChipDisabled('Sandbox' , 'NetSuite')" @click="openNetsuiteModal('Sandbox')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{ translate("Sandbox") }}</ion-label></ion-chip>
                  <ion-chip :disabled="isChipDisabled('Production', 'NetSuite')" @click="openNetsuiteModal('Producation')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{ translate("Producation") }}</ion-label></ion-chip>
                </ion-item>
              </ion-card-header>
              <ion-list>
                <ion-item v-for="(credentials, index) in nsCredentialsList" :key="index">
                  <ion-label>
                    {{ credentials.accountType }}
                    <p>{{ credentials.remoteId }}</p>
                  </ion-label>
                  <div slot="end" class="item-end">
                    <ion-button fill="outline" size="small" @click="getAPIKey(credentials)">
                        {{ translate("Generate API Key")}}
                      </ion-button>
                    <template v-if="credentials.verified === 'Y'">
                      <ion-note color="success">{{ translate("verified") }}</ion-note>
                    </template>
                    <template v-else-if="credentials.verified === 'N'">
                      <ion-button color="warning" fill="outline" size="small" @click="verifyNetsuiteCredential(credentials.systemMessageRemoteId)">
                        {{ translate("Verify")}}
                      </ion-button>
                    </template>
                    <ion-icon :icon="trashOutline" size="large" aria-hidden="true" color="medium" class="pointer" @click="deleteNetsuiteCredential(credentials)"></ion-icon>
                  </div>
                </ion-item>
              </ion-list>
            </ion-card>
          </div>
          <div>
            <ion-card>
              <ion-card-header>
                <ion-item lines="none">
                  <ion-thumbnail slot="start">
                    <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                  </ion-thumbnail>
                  <ion-card-title>{{ translate("Loop Credentials") }}</ion-card-title>
                </ion-item>
                <ion-item lines="none">
                  <ion-chip :disabled="isChipDisabled('Sandbox', 'Loop')" @click="openLoopModal('Sandbox')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{ translate("Sandbox")}}</ion-label></ion-chip>
                  <ion-chip :disabled="isChipDisabled('Production','Loop')" @click="openLoopModal('Producation')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{ translate("Producation")}}</ion-label></ion-chip>
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
                      <ion-note color="success">{{ translate("Active") }}</ion-note>
                    </template>
                    <template v-else-if="loopCredentials.verified === 'N'">
                      <ion-button :disabled="loopWebhookVerified.webhookSubscriptionMap[loopCredentials.systemMessageRemoteId] == 'Y' ? false : true" color="warning" fill="outline" size="small" @click="verifyloopCredential(loopCredentials)">
                        {{ translate("Subscribe") }}
                      </ion-button>
                    </template>
                    <ion-icon :icon="trashOutline" size="large" aria-hidden="true" color="medium" class="pointer" @click="deleteLoopCredential(loopCredentials)"></ion-icon>
                  </div>
                </ion-item>
              </ion-list>
            </ion-card>
          </div>
        </section>
       
        <!-- NetSuite Integration Mapping Section -->
        <section class="ion-padding-horizontal">
          <div>
            <ion-card>
              <ion-card-header>
                <ion-item lines="none">
                  <ion-card-title>{{ translate("NetSuite Integartion Mapping") }}</ion-card-title>
                </ion-item>
                <ion-item lines="none">
                  <ion-chip v-for="(credentials, index) in nsCredentialsList" :key="index" @click="openNetSuiteMappingModal(credentials.accountType, credentials.systemMessageRemoteId)" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{ translate(credentials.accountType) }}</ion-label></ion-chip>
                </ion-item>
              </ion-card-header>
            </ion-card>
          </div>
        </section>
        <section class="ion-padding-horizontal" >
          <div v-for="(credentials, index) in nsCredentialsList" :key="index">
            <ion-card>
              <ion-card-header>
                  <ion-card-title>{{ `NetSuite ${credentials.accountType} Mapping `}}</ion-card-title>
                  <ion-card-subtitle>{{ credentials.remoteId }}</ion-card-subtitle>
              </ion-card-header>
              <ion-list v-if="netSuiteMapping[credentials.systemMessageRemoteId] && netSuiteMapping[credentials.systemMessageRemoteId].length > 0">
                <ion-item lines="none">
                  <ion-label>
                    {{ translate("Mapping Key") }}
                  </ion-label>
                  <div slot="end" class="item-end">
                    <ion-label>
                      {{ translate("Value") }}
                    </ion-label>
                    <ion-label>
                      {{ translate("Status") }}
                    </ion-label>
                    <ion-label>
                      {{ translate("Action") }}
                    </ion-label>
                  </div>
                </ion-item>
                <ion-item lines="none">
                  <ion-label>
                   <template v-if="mapping.synced === 'Y'">
                      <ion-note color="success">{{ translate("Synced") }}</ion-note>
                    </template>
                    <template v-else-if="mapping.synced === 'N'">
                      <ion-button color="warning" fill="outline" size="small" @click="verifyNetsuiteCredential(credentials.systemMessageRemoteId)" >
                        {{ translate("Sync") }}
                      </ion-button>
                    </template>
                  </ion-label>
                </ion-item>
<!-- 
                <ion-chip outline>
                  <ion-label>{{ getFacilityName(count?.facilityId) }}</ion-label>
                </ion-chip>

                <ion-label>
                  {{ getCycleCountStats(count.inventoryCountImportId, count.countTypeEnumId === "HARD_COUNT") }}
                  <p>{{ translate("products counted") }}</p>
                </ion-label>

                <ion-label>
                  {{ cycleCountStats(count.inventoryCountImportId)?.rejectedCount || 0 }}
                  <p>{{ translate("rejected counts") }}</p>
                </ion-label>

                <ion-label>
                  {{ cycleCountStats(count.inventoryCountImportId)?.totalVariance || 0 }}
                  <p>{{ translate("total variance") }}</p>
                </ion-label>

                <ion-label class="ion-padding">
                  {{ getClosedDate(count) }}
                  <p>{{ translate("closed") }}</p>
                </ion-label> -->
              <!-- <ion-grid>
                <ion-row class="ion-text-bold ion-padding-vertical">
                  <ion-col size="7">
                    <ion-label>{{ translate("Mapping Key") }}</ion-label>
                  </ion-col>
                  <ion-col size="2">
                    <ion-label>{{ translate("Value") }}</ion-label>
                  </ion-col>
                  <ion-col size="2">
                    <ion-label>{{ translate("Status") }}</ion-label>
                  </ion-col>
                </ion-row>
                <ion-row  v-for="(mapping, idx) in netSuiteMapping[credentials.systemMessageRemoteId]" :key="idx" class="ion-align-items-center">
                  <ion-col size="7">
                    <ion-label>
                      <p>{{ mapping.mappingKey }}</p>
                    </ion-label>
                  </ion-col>

                  <ion-col size="2">
                    <ion-note color="success">{{ mapping.mappingValue }}</ion-note>
                  </ion-col>

                  <ion-col size="2">
                    <template v-if="mapping.synced === 'Y'">
                      <ion-note color="success">{{ translate("Synced") }}</ion-note>
                    </template>
                    <template v-else-if="mapping.synced === 'N'">
                      <ion-button color="warning" fill="outline" size="small" @click="verifyNetsuiteCredential(credentials.systemMessageRemoteId)" >
                        {{ translate("Sync") }}
                      </ion-button>
                    </template>
                  </ion-col>

                  <ion-col size="1" class="ion-text-end">
                    <ion-icon
                      :icon="trashOutline"
                      size="large"
                      aria-hidden="true"
                      color="medium"
                      class="pointer"
                      @click="deleteNetsuiteCredential(credentials)"
                    ></ion-icon>
                  </ion-col>
                </ion-row>
              </ion-grid> -->
                <!-- <ion-item v-for="(mapping, idx) in netSuiteMapping[credentials.systemMessageRemoteId]" :key="idx">
                  <ion-label>
                    <p>{{ mapping.mappingKey }}</p>
                  </ion-label>
                  <div slot="end" class="item-end">
                    <ion-note color="success">{{ mapping.mappingValue }}</ion-note>
                    <template v-if="mapping.synced === 'Y'">
                      <ion-note color="success">{{ translate("Synced") }}</ion-note>
                    </template>
                    <template v-else-if="mapping.synced === 'N'">
                      <ion-button color="warning" fill="outline" size="small" @click="verifyNetsuiteCredential(credentials.systemMessageRemoteId)">
                        {{ translate("Sync")}}
                      </ion-button>
                    </template>
                    <ion-icon :icon="trashOutline" size="large" aria-hidden="true" color="medium" class="pointer" @click="deleteNetsuiteCredential(credentials)"></ion-icon>
                  </div>
                </ion-item> -->
              </ion-list>
            </ion-card>
          </div>
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
  IonCardSubtitle,
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
  modalController,
  onIonViewDidEnter,
  alertController
} from "@ionic/vue";

import { ref } from "vue";
import { useStore } from "@/store";
import { copyToClipboard, showToast } from "@/utils";
import { addOutline, trashOutline } from "ionicons/icons";
import NetSuiteModal from "@/components/NetSuiteModal.vue";
import LoopModal from "@/components/LoopModal.vue";
import logger from '@/logger';
import { translate } from '@/i18n';
import NetSuiteMappingModal from "@/components/NetSuiteMappingModal.vue";

const store = useStore();

const segmentSelected = ref('Configuration');
const nsCredentialsList = ref([]);
const loopCredentialsList = ref([]);
const profile = ref({})
const loopWebhookVerified = ref([]);
const netSuiteMapping = ref([]);

onIonViewDidEnter(async() => {
  await getVerifyLoopWebhook()
  await fetchUserNetSuiteDetails();
  await fetchUserLoopDetails();
  await fetchUserProfile()
  await getNetSuiteRMAMapping()
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
      showToast(translate("NetSuite credentials saved successfully."));
    } catch (error) {
      logger.error(error);
      showToast("Failed to save NetSuite credentials.");
    }
  }
}

async function openNetSuiteMappingModal(accountType: string , systemMessageRemoteId: string) {
  
  const modal = await modalController.create({
    component: NetSuiteMappingModal,
    componentProps: { accountType, systemMessageRemoteId },
  });
  modal.present();
  const { data, role } = await modal.onWillDismiss();
  console.log("data, role---", data);
  
  if (role === 'save') {
    try {
      const response = await store.dispatch('user/netSuiteCredentials', data);
      if (response) {
        fetchUserNetSuiteDetails()
      }
      showToast(translate("NetSuite credentials saved successfully."));
    } catch (error) {
      logger.error(error);
      showToast("Failed to save NetSuite credentials.");
    }
  }
} 

async function getNetSuiteRMAMapping() {
  try {
    const response = await store.dispatch('user/getNetSuiteRMAMapping');
    if (!response) {
      showToast("Unable to fetch NetSuite RMA Mapping");
    } else {
      netSuiteMapping.value = response.integrationTypeMappingMap
      console.log("netSuiteMapping---", response);
      
    }
  } catch (error) {
    logger.error(error);
    showToast("Unable to fetch NetSuite RMA Mapping List");
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
        logger.error(error);
        showToast("Failed to save NetSuite credentials.");
      }
    }
}

async function fetchUserProfile() {
  try {
    const response = await store.dispatch('user/getProfile');
    profile.value = response.data.organizationDetailList[0];
  } catch (error) {
    logger.error(error);
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
    logger.error(error);
    showToast("Failed to fetch user profile.");
  }
}

async function deleteNetsuiteCredential(data: any) {
  try {
    const response = await store.dispatch('user/deleteNetSuiteCredential', data);
    if (response) {
      nsCredentialsList.value = nsCredentialsList.value.filter(cred => cred.systemMessageRemoteId !== data.systemMessageRemoteId);
      showToast("NetSuite credential deleted successfully.");
    }
  } catch (error) {
    logger.error(error);
    showToast("Failed to fetch user profile.");
  }
}

const isChipDisabled = (type: string, cardType : string) => {
  if (cardType === 'NetSuite') {
    return nsCredentialsList?.value?.some(cred => cred.accountType === type);
  } else if (cardType === 'Loop') {
    return loopCredentialsList?.value?.some(cred => cred.accountType === type);
  }
}; 

async function fetchUserLoopDetails() {
  try {
    const response = await store.dispatch('user/getLoopDetails');
    if (response) {
      loopCredentialsList.value = response.loopRemoteList;
    } 
  } catch (error) {
    logger.error(error);
    showToast("Failed to fetch user profile.");
  }
}

async function deleteLoopCredential(data: any) {
  try {
    const response = await store.dispatch('user/deleteLoopCredential', data);
    if (response) {
      loopCredentialsList.value = loopCredentialsList.value.filter(cred => cred.systemMessageRemoteId !== data.systemMessageRemoteId);
      showToast("NetSuite credential deleted successfully.");
    }
  } catch (error) {
    logger.error(error);
    showToast("Failed to fetch user profile.");
  }
}

async function verifyNetsuiteCredential(systemMessageRemoteId: string) {
  try {
    const response = await store.dispatch('user/verifyNetsuiteCredential', systemMessageRemoteId);
    if (response) {
      fetchUserNetSuiteDetails()

    } else {
      showToast("Unable to verify NetSuite Credential Please try again either delete the credential and add it again.");
    }
  } catch (error) {
    logger.error(error);
    showToast("Unable to verify NetSuite Credential Please try again either delete the credential and add it again.");
  }
}

async function verifyloopCredential(loopCredentials: any) {
  try {
    const response = await store.dispatch('user/verifyloopCredential', loopCredentials);
    if (response) {
      fetchUserLoopDetails()
    } else {
      showToast("Unable to verify NetSuite Credential Please try again either delete the credential and add it again.");
    }
  } catch (error) {
    logger.error(error);
    showToast("Unable to verify NetSuite Credential Please try again either delete the credential and add it again.");
  }
}

async function getVerifyLoopWebhook() {
  try {
    const response = await store.dispatch('user/getVerifyLoopWebhook');
    if (!response) {
      showToast("Unable to verify NetSuite Credential Please try again either delete the credential and add it again.");
    }  else {
      loopWebhookVerified.value = response
    }
  } catch (error) {
    logger.error(error);
    showToast("Unable to verify NetSuite Credential Please try again either delete the credential and add it again.");
  }
}

async function getAPIKey(credentials: any) {
  try {
    const response = await store.dispatch('user/getAPIKey', credentials);
    if (response) {
      const alert = await alertController.create({
        header: 'Refresh API Key',
        subHeader: `An API Key has been generated for NetSuite Account ID ${credentials.remoteId}.
                    Please copy and save this key now — it will only be shown once.<br/>
                    Use this key to create an API Secret record in NetSuite.<br />

                    Your API Key is: ${response.loginKey}`,
        buttons: [
          {
            text: 'copy API Key',
            role: 'copy',
            handler: () => copyToClipboard(response?.loginKey)
          },
        ]
      });
      await alert.present();
    } else {
      showToast("Unable to verify NetSuite Credential Please try again either delete the credential and add it again.");
    }
  } catch (error) {
    logger.error(error);
    showToast("Unable to verify NetSuite Credential Please try again either delete the credential and add it again.");
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