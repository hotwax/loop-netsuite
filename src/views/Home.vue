<template>
  <ion-page>
    <ion-header :translucent="true" >
      <ion-toolbar>
        <ion-item lines="none" slot="start">
          <h3>{{ profile.organizationName }}</h3>
        </ion-item>
          <ion-segment v-model="segmentSelected">
            <ion-segment-button value="configuration">
              <ion-label>{{ translate("Configuration") }}</ion-label>
            </ion-segment-button>
            <ion-segment-button value="account">
              <ion-label>{{ translate("Account") }}</ion-label>
            </ion-segment-button>
            <ion-segment-button value="syncStatus">
              <ion-label>{{ translate("Sync Status") }}</ion-label>
            </ion-segment-button>
          </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content ref="contentRef" :scroll-events="true" >
      <div v-if="segmentSelected === 'configuration'">
        <h1>{{ translate("Connect") }}</h1>
        <section class="ion-padding-horizontal">
          <div>
            <ion-card>
              <ion-card-header>
                <ion-item lines="none">
                  <ion-thumbnail slot="start">
                    <img alt="Silhouette of mountains" src="../assets/images/defaultImage.png" />
                  </ion-thumbnail>
                  <ion-card-title>{{ translate("NetSuite Credentials") }}</ion-card-title>
                </ion-item>
                <ion-item lines="none">
                  <ion-chip :disabled="isChipDisabled('sandbox' , 'NetSuite')" @click="openNetsuiteModal('sandbox')" :outline="true">
                    <ion-icon :icon=addOutline /> 
                    <ion-label>{{ translate("sandbox") }}</ion-label>
                  </ion-chip>
                  <ion-chip :disabled="isChipDisabled('production', 'NetSuite')" @click="openNetsuiteModal('production')" :outline="true">
                    <ion-icon :icon=addOutline />
                    <ion-label>{{ translate("production") }}</ion-label>
                  </ion-chip>
                </ion-item>
              </ion-card-header>
              <ion-list>
                <ion-item v-for="(credentials, index) in nsCredentialsList" :key="index" :lines="index === nsCredentialsList.length - 1 ? 'none' : ''">
                  <div class="item-grid">
                    <ion-label>
                      {{ translate(credentials.accountType) }}
                      <p>{{ credentials.remoteId }}</p>
                    </ion-label>
                    <ion-button class="ion-text-center ion-text-nowrap" fill="outline" size="small" @click="getAPIKey(credentials)">
                      {{ translate("Generate API Key")}}
                    </ion-button>
                    <ion-note class="ion-text-center" v-if="credentials.verified === 'Y'" color="success">
                      {{ translate("Verified") }}
                    </ion-note>
                    <ion-button class="ion-text-center" v-else-if="credentials.verified === 'N'" color="warning" fill="outline" size="small" @click="verifyNetsuiteCredential(credentials.systemMessageRemoteId)">
                      {{ translate("Verify")}}
                    </ion-button>
                    <ion-button size="default" fill="clear" color="medium" @click="deleteNetsuiteCredential(credentials)">
                      <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
                    </ion-button>
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
                    <img alt="Silhouette of mountains" src="../assets/images/defaultImage.png" />
                  </ion-thumbnail>
                  <ion-card-title>{{ translate("Loop Credentials") }}</ion-card-title>
                </ion-item>
                <ion-item lines="none">
                  <ion-chip :disabled="isChipDisabled('sandbox', 'Loop')" @click="openLoopModal('sandbox')" :outline="true">
                    <ion-icon :icon=addOutline /> 
                    <ion-label>{{ translate("sandbox")}}</ion-label>
                  </ion-chip>
                  <ion-chip :disabled="isChipDisabled('production','Loop')" @click="openLoopModal('production')" :outline="true">
                    <ion-icon :icon=addOutline /> 
                  <ion-label>{{ translate("production")}}</ion-label>
                  </ion-chip>
                </ion-item>
              </ion-card-header>
              <ion-list>
                <ion-item v-for="(loopCredentials, index) in loopCredentialsList" :key="index" :lines="index === loopCredentialsList.length - 1 ? 'none' : ''">
                  <div class="item-grid-loop">
                    <ion-label>
                      {{ translate(loopCredentials.accountType) }}
                      <p>{{ loopCredentials.remoteId }}</p>
                    </ion-label>
                    <ion-note class="ion-text-center" v-if="loopCredentials.verified === 'Y'" color="success">
                      {{ translate("Active") }}
                    </ion-note>
                    <ion-button class="ion-text-center" v-else-if="loopCredentials.verified === 'N'" :disabled="loopWebhookVerified.webhookSubscriptionMap[loopCredentials.systemMessageRemoteId] == 'Y' ? false : true" color="warning" fill="outline" size="small" @click="verifyloopCredential(loopCredentials)">
                      {{ translate("Subscribe") }}
                    </ion-button>
                    <ion-button fill="clear" size="default" color="medium" @click="deleteLoopCredential(loopCredentials)">
                      <ion-icon slot="icon-only" :icon="trashOutline" ></ion-icon>
                    </ion-button>
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
                  <ion-card-title>{{ translate("NetSuite integration mapping") }}</ion-card-title>
                </ion-item>
                <ion-item lines="none">
                  <ion-chip v-for="(credentials, index) in nsCredentialsList" :key="index" @click="openNetSuiteMappingModal(credentials.accountType, credentials.systemMessageRemoteId)" :outline="true">
                    <ion-icon :icon=addOutline /> 
                    <ion-label>{{ translate(credentials.accountType) }}</ion-label>
                  </ion-chip>
                </ion-item>
              </ion-card-header>
            </ion-card>
          </div>
        </section>
        <section class="ion-padding-horizontal" >
          <div v-for="(credentials, index) in nsCredentialsList" :key="index">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ translate(`NetSuite ${credentials.accountType} Mapping`)}}</ion-card-title>
                <ion-card-subtitle>{{ credentials.remoteId }}</ion-card-subtitle>
              </ion-card-header>
              <ion-list v-if="netSuiteMapping[credentials.systemMessageRemoteId] && netSuiteMapping[credentials.systemMessageRemoteId].length > 0">
                <ion-item>
                  <div class="item-grid">
                    <ion-label> {{ translate("Mapping Key") }}</ion-label>
                    <ion-label class="ion-text-center"> {{ translate("Value") }}</ion-label>
                    <ion-label class="ion-text-center"> {{ translate("Status") }}</ion-label>
                    <ion-label class="ion-text-center"> {{ translate("Action") }} </ion-label>
                  </div>
                </ion-item>
                <ion-item  v-for="(mapping, index) in netSuiteMapping[credentials.systemMessageRemoteId]" :key="index" :lines="index === netSuiteMapping[credentials.systemMessageRemoteId].length - 1 ? 'none' : ''">
                  <div class="item-grid">
                    <ion-label>
                      {{ mapping.mappingKey }}
                    </ion-label>
                    <ion-label class="ion-text-center">{{ mapping.mappingValue }}</ion-label>
                    <ion-note class="ion-text-center" v-if="mapping.synced == 'Y'" color="success">{{ translate("Synced") }}</ion-note>
                    <ion-button class="ion-text-center" v-else-if="mapping.synced == 'N'" color="warning" fill="outline" size="small" @click="syncNetsuiteMapping(mapping.integrationMappingId)" >
                      {{ translate("Sync") }}
                    </ion-button>
                    <ion-button fill="clear" size="default" color="medium" @click="deleteIntegrationTypeMappings(mapping)">
                      <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
                    </ion-button>
                  </div>
                </ion-item>
              </ion-list>
            </ion-card>
          </div>
        </section>
      </div>
      <div v-if="segmentSelected === 'account'" class="user-profile">
        <ion-card class="ion-card-width">
          <ion-card-header>
            <ion-card-title>{{translate("User Account Information")}}</ion-card-title>
            <ion-card-subtitle>{{ profile.organizationName }}</ion-card-subtitle>
          </ion-card-header>
          <ion-list lines="full">
            <ion-item>
              <ion-label>{{translate("User Id")}}</ion-label>
              <ion-label slot="end">{{ profile.userId }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>{{translate("Full Name")}} </ion-label>
              <ion-label slot="end">{{ profile.userFullName }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>{{translate("Email")}}</ion-label>
              <ion-label slot="end">{{ profile.emailAddress }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>{{translate("Username")}}</ion-label>
              <ion-label slot="end">{{ profile.username }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>{{translate("Organization Name")}}</ion-label>
              <ion-label slot="end">{{ profile.organizationName }}</ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-button slot="end" color="warning" fill="outline" @click="updatePassword(profile)">
                {{ translate("Change Password") }}
              </ion-button>
              <ion-button slot="end" fill="outline" @click="updateProfile(profile)">
                {{ translate("Update Profile") }}
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-card>
      </div>
      <div v-if="segmentSelected === 'syncStatus'">
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
import { hasError } from "@hotwax/oms-api";
import logger from "@/logger";
import { UserService } from "@/services/UserService";

const store = useStore();

const segmentSelected = ref('configuration');
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
    showToast(translate("Verified NetSuite Credentials successfully."));
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
    showToast(translate("Verified Loop Credentials successfully."));
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
      const response = await UserService.updateUserProfile(data)
      if (!hasError(response)) {
        fetchUserProfile()
        showToast(translate("User profile updated successfully."));
      } else {
        throw response.data
      }
    } catch (err) {
      logger.error(err)
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
  if (role === 'save') {
    try {
      const resp = await UserService.updatePassword(data)
      if (!hasError(resp)) {
        showToast(translate("New password updated successfully."));
      } else {
        throw resp.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Failed to update password."));
    }
  }
}
</script>
<style scoped>
@media (min-width: 531px) {
  section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(531px, 1fr));
  }
}

.ion-card-width {
  width: 100%;
  max-width: 500px;
  margin: 10px auto
}
h1 {
  margin: 24px 24px 0;
}

.item-end {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 6fr 2fr 2fr 2fr;
  align-items: center;
}

.item-grid-loop {
  width: 100%;
  display: grid;
  grid-template-columns: 8fr 2fr 2fr;
  align-items: center;

}

.ion-text-center {
  text-align: center;
}
</style>