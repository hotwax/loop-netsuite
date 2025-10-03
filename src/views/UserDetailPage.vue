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
                  <ion-chip :disabled="isChipDisabled('sandbox' , 'NetSuite')" @click="openNetsuiteModal('sandbox')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{ translate("Sandbox") }}</ion-label></ion-chip>
                  <ion-chip :disabled="isChipDisabled('production', 'NetSuite')" @click="openNetsuiteModal('production')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{ translate("Production") }}</ion-label></ion-chip>
                </ion-item>
              </ion-card-header>
              <ion-list>
                <ion-item v-for="(credentials, index) in nsCredentialsList" :key="index" :lines="index === nsCredentialsList.length - 1 ? 'none' : ''">
                  <ion-label>
                    {{ credentials.accountType }}
                    <p>{{ credentials.remoteId }}</p>
                  </ion-label>
                  <div slot="end" class="item-end">
                    <ion-button fill="outline" size="small" @click="getAPIKey(credentials)">
                        {{ translate("Generate API Key")}}
                      </ion-button>
                    <template v-if="credentials.verified === 'Y'">
                      <ion-note color="success">{{ translate("Verified") }}</ion-note>
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
                  <ion-chip :disabled="isChipDisabled('sandbox', 'Loop')" @click="openLoopModal('sandbox')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{ translate("Sandbox")}}</ion-label></ion-chip>
                  <ion-chip :disabled="isChipDisabled('production','Loop')" @click="openLoopModal('production')" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{ translate("Production")}}</ion-label></ion-chip>
                </ion-item>
              </ion-card-header>
              <ion-list>
                <ion-item v-for="(loopCredentials, index) in loopCredentialsList" :key="index" :lines="index === loopCredentialsList.length - 1 ? 'none' : ''">
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
                  <ion-card-title>{{ translate("NetSuite Integration mapping") }}</ion-card-title>
                </ion-item>
                <ion-item lines="none">
                  <ion-chip v-for="(credentials, index) in nsCredentialsList" :key="index" @click="openNetSuiteMappingModal(credentials.accountType, credentials.systemMessageRemoteId)" :outline="true"><ion-icon :icon=addOutline /> <ion-label>{{ (credentials.accountType == "sandbox" ? "Sandbox" : "Production") }}</ion-label></ion-chip>
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
                <ion-item>
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
                <ion-item v-for="(mapping, index) in netSuiteMapping[credentials.systemMessageRemoteId]" :key="index" :lines="index === netSuiteMapping[credentials.systemMessageRemoteId].length - 1 ? 'none' : ''">
                  <ion-label>
                    {{ mapping.mappingKey }}
                  </ion-label>
                  <div slot="end" class="item-end">
                    <ion-note color="success">{{ mapping.mappingValue }}</ion-note>
                    <template v-if="mapping.synced == 'Y'">
                      <ion-note color="success">{{ translate("Synced") }}</ion-note>
                    </template>
                    <template v-else-if="mapping.synced == 'N'">
                      <ion-button color="warning" fill="outline" size="small" @click="syncNetsuiteMapping(mapping.integrationMappingId)" >
                        {{ translate("Sync") }}
                      </ion-button>
                    </template>
                    <ion-icon :icon="trashOutline" size="large" aria-hidden="true" color="medium" class="pointer" @click="deleteIntegrationTypeMappings(mapping)"></ion-icon>
                  </div>
                </ion-item>                 
              </ion-list>
            </ion-card>
          </div>
        </section>
      </div>
      <div v-if="segmentSelected === 'account'">
        <div class="user-profile">
          <ion-card class="ion-card-width ion-padding">
            <ion-card-header>
              <ion-card-title>User Account Information</ion-card-title>
              <ion-card-subtitle>{{ profile.organizationName }}</ion-card-subtitle>
            </ion-card-header>
            <ion-list lines="full">
              <ion-item>
                <ion-label>User ID</ion-label>
                <ion-text color="dark"><p>{{ profile.userId }}</p></ion-text>
              </ion-item>
              <ion-item>
                <ion-label>Full Name </ion-label>
                <ion-text color="dark"><p>{{ profile.userFullName }}</p></ion-text>
              </ion-item>
              <ion-item>
                <ion-label>Email </ion-label>
                <ion-text color="dark"><p>{{ profile.emailAddress }}</p></ion-text>
              </ion-item>
              <ion-item>
                <ion-label>Username</ion-label>
                <ion-text color="dark"><p>{{ profile.username }}</p></ion-text>
              </ion-item>
              <ion-item>
                <ion-label>Organization Name </ion-label>
                <ion-text color="dark"><p>{{ profile.organizationName }}</p></ion-text>
              </ion-item>
              <ion-item lines="none" >
                <div slot="end" class="ion-margin-top">
                  <ion-button color="warning" fill="outline" @click="updatePassword(profile)">
                    {{ translate("Change Password") }}
                  </ion-button>
                  <ion-button fill="outline" @click="updateProfile(profile)">
                    {{ translate("Update Profile") }}
                  </ion-button>
                </div>
              </ion-item>
           </ion-list>
          </ion-card>
        </div>
      </div>
      <div v-if="segmentSelected === 'SyncStatus'">
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  alertController,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonThumbnail,
  IonToolbar,
  modalController,
  onIonViewDidEnter
} from "@ionic/vue";

import { ref } from "vue";
import { useStore } from "@/store";
import { copyToClipboard, showToast } from "@/utils";
import { addOutline, trashOutline } from "ionicons/icons";
import NetSuiteModal from "@/components/NetSuiteModal.vue";
import LoopModal from "@/components/LoopModal.vue";
import { translate } from '@/i18n';
import NetSuiteMappingModal from "@/components/NetSuiteMappingModal.vue";
import UpdateUserLoginModal from "@/components/UpdateUserLoginModal.vue";
import ChangePasswordModal from "@/components/ChangePasswordModal.vue";

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
    const response = await store.dispatch('user/netSuiteCredentials', data);
    if (response) {
      fetchUserNetSuiteDetails()
      showToast(translate("NetSuite credentials saved successfully."));
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
  if (role === 'save') {
    const response = await store.dispatch('user/netsuiteMapping', data);
    if (response) {
      getNetSuiteRMAMapping()
      showToast(translate("NetSuite Mapping saved successfully."));
    }
  }
} 

async function getNetSuiteRMAMapping() {
  const response = await store.dispatch('user/getNetSuiteRMAMapping');
  if (response) {
    netSuiteMapping.value = response.integrationTypeMappingMap
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
    const response = await store.dispatch('user/loopCredentials', data);
    if (response) {
      fetchUserLoopDetails()
      showToast(translate("Loop credentials saved successfully."));
    }
  }
}

async function fetchUserProfile() {
  const response = await store.dispatch('user/getProfile');
  profile.value = response.data.organizationDetailList[0];
}

async function fetchUserNetSuiteDetails() {
  const response = await store.dispatch('user/getNetSuiteDetails');
  if (response) {
    nsCredentialsList.value = response.netsuiteRemoteList;
  } 
}

async function deleteNetsuiteCredential(data: any) {
  const response = await store.dispatch('user/deleteNetSuiteCredential', data);
  if (response) {
    nsCredentialsList.value = nsCredentialsList.value.filter(cred => cred.systemMessageRemoteId !== data.systemMessageRemoteId);
    showToast(translate("NetSuite credential deleted successfully."));
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
  const response = await store.dispatch('user/getLoopDetails');
  if (response) {
    loopCredentialsList.value = response.loopRemoteList;
  } 
}

async function deleteLoopCredential(data: any) {
  const response = await store.dispatch('user/deleteLoopCredential', data);
  if (response) {
    loopCredentialsList.value = loopCredentialsList.value.filter(cred => cred.systemMessageRemoteId !== data.systemMessageRemoteId);
    showToast(translate("Loop credential deleted successfully."));
  }
}

async function verifyNetsuiteCredential(systemMessageRemoteId: string) {
  const response = await store.dispatch('user/verifyNetsuiteCredential', systemMessageRemoteId);
  if (response) {
    fetchUserNetSuiteDetails()
    showToast(translate("Verify NetSuite Credential successfully."));
  } 
}

async function syncNetsuiteMapping(systemMessageRemoteId: string) {
  const response = await store.dispatch('user/syncNetsuiteMapping', systemMessageRemoteId);
  if (response) {
    getNetSuiteRMAMapping()
    showToast(translate("NetSuite mapping synced successfully."));
  } 
}

async function deleteIntegrationTypeMappings(payload: any) {
  const response = await store.dispatch('user/deleteIntegrationTypeMappings', payload);
  if (response) {
    getNetSuiteRMAMapping()
    showToast(translate("NetSuite mapping deleted successfully."));
  } 
}

async function verifyloopCredential(loopCredentials: any) {
  const response = await store.dispatch('user/verifyloopCredential', loopCredentials);
  if (response) {
    fetchUserLoopDetails()
    showToast(translate("Verify Loop Credential successfully."));
  }
}

async function getVerifyLoopWebhook() {
  const response = await store.dispatch('user/getVerifyLoopWebhook');
  if (response) {
    loopWebhookVerified.value = response
  }
}

async function getAPIKey(credentials: any) {
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
    showToast(translate("Unable to get NetSuite apiKey. Please try again."));
  }
}

async function updateProfile(profile: any ) {
  
  const modal = await modalController.create({
    component: UpdateUserLoginModal,
    componentProps: { profile },
  });
  modal.present();
  const { data, role } = await modal.onWillDismiss();
  if (role === 'save') {
    try {
      const response = await store.dispatch('user/updateUserProfile', data);
      if (response) {
        fetchUserProfile()
        showToast(translate("User Profile Updated saved successfully."));
      }
    } catch (error) {
      logger.error(error);
      showToast(translate("Failed to update user profile."));
    }
  }
} 

async function updatePassword(profile: any ) {
  
  const modal = await modalController.create({
    component: ChangePasswordModal,
    componentProps: { profile },
  });
  modal.present();
  const { data, role } = await modal.onWillDismiss();
  console.log("data--",data);
  if (data.newPassword !== data.newPasswordVerify) {
    showToast(translate("New Password and Confirm Password do not match."));
    return;
  }
  if (role === 'save') {
    try {
      const response = await store.dispatch('user/updatePassword', data);
      if (response) {
        fetchUserProfile()
        showToast(translate("New Password Updated Successfully."));
      }
    } catch (error) {
      logger.error(error);
      showToast(translate("Failed to update password."));
    }
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
.user-profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.ion-card-width {
  width: 100%;
  max-width: 500px;
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