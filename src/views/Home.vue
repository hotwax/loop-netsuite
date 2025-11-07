<template>
  <ion-page>
    <ion-header :translucent="true" >
      <ion-toolbar>
        <ion-item lines="none" slot="start">
          <h3>{{ organizationDetails.organizationName }}</h3>
        </ion-item>
          <ion-segment v-model="segmentSelected" @ion-change="segmentChanged">
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
                    <ion-button class="ion-text-center ion-text-nowrap" fill="outline" size="small" @click="postAPIKey(credentials)">
                      {{ translate(credentials.systemMessageRemoteId in loginKeyMap ? "Refresh API Key" : "Generate API Key") }} 
                    </ion-button>
                    <ion-note class="ion-text-center" v-if="credentials.verified === 'Y'" color="success">
                      {{ translate("Verified") }}
                    </ion-note>
                    <ion-button class="ion-text-center" v-else-if="credentials.verified === 'N'" color="warning" fill="outline" size="small" @click="verifyNetsuiteCredential(credentials.systemMessageRemoteId)">
                      {{ translate("Verify")}}
                    </ion-button>
                    <ion-button size="default" fill="clear" color="medium" @click="confirmDelete(() => deleteNetsuiteCredential(credentials))">
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
                    </ion-label>
                    <ion-button class="ion-text-center" v-if="loopCredentials.verified === 'Y'" color="warning" fill="outline" size="small" @click="confirmDelete(() => deleteLoopWebHook(loopCredentials),'Do you want to unsubscribe Loop webhook?')">
                      {{ translate("Unsubscribe") }}
                    </ion-button>
                    <ion-button class="ion-text-center" v-else-if="loopCredentials.verified === 'N'" :disabled="loopWebhookVerified.webhookSubscriptionMap[loopCredentials.systemMessageRemoteId] == 'Y' ? false : true" color="warning" fill="outline" size="small" @click="verifyloopCredential(loopCredentials)">
                      {{ translate("Subscribe") }}
                    </ion-button>
                    <ion-button fill="clear" size="default" color="medium" @click="confirmDelete(() => deleteLoopCredential(loopCredentials))">
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
                  <ion-card-title>{{ translate("NetSuite Integration Mapping") }}</ion-card-title>
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
                <ion-item lines="none">
                  <ion-label>
                    {{ translate(`NetSuite ${credentials.accountType} Mapping`)}}
                    <p>{{ credentials.remoteId }}</p>
                  </ion-label>
                  <ion-button slot="end" fill="outline" :disabled="netSuiteMapping[credentials.systemMessageRemoteId]?.[0]?.scriptEndPoint != 'Y'" @click="syncAllNetsuiteMapping(credentials.systemMessageRemoteId)">
                    {{ translate('Sync All') }}
                  </ion-button>
                </ion-item>
              </ion-card-header>
              <ion-list v-if="netSuiteMapping[credentials.systemMessageRemoteId] && netSuiteMapping[credentials.systemMessageRemoteId].length > 0">
                <ion-item>
                  <div class="netsuite-mapping-grid">
                    <ion-label> {{ translate("Name") }}</ion-label>
                    <ion-label class="ion-text-center"> {{ translate("Value") }}</ion-label>
                    <ion-label class="ion-text-center"> {{ translate("Status") }}</ion-label>
                    <ion-label class="ion-text-center"> {{ translate("Action") }} </ion-label>
                  </div>
                </ion-item>
                <ion-item  v-for="(mapping, index) in netSuiteMapping[credentials.systemMessageRemoteId]" :key="index" :lines="index === netSuiteMapping[credentials.systemMessageRemoteId].length - 1 ? 'none' : ''">
                  <div class="netsuite-mapping-grid">
                    <ion-label>
                      {{ mapping.description }}
                    </ion-label>
                    <ion-label class="ion-text-center">{{ mapping.mappingValue }}</ion-label>
                    <ion-note class="ion-text-center" v-if="mapping.synced == 'Y'" color="success">{{ translate("Synced") }}</ion-note>
                    <ion-button class="ion-text-center" v-else-if="mapping.synced == 'N'" color="warning" fill="outline" size="small" :disabled="mapping.scriptEndPoint != 'Y'" @click="syncNetsuiteMapping(mapping.integrationMappingId)" >
                      {{ translate("Sync") }}
                    </ion-button>
                    <ion-button fill="clear" size="default" color="medium" @click="confirmDelete(() => deleteIntegrationTypeMappings(mapping))">
                      <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" size="default" color="medium" @click="updateIntegrationTypeMapping(mapping)">
                      <ion-icon slot="icon-only" :icon="pencilOutline"></ion-icon>
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
            <ion-card-subtitle>{{ organizationDetails.organizationName }}</ion-card-subtitle>
          </ion-card-header>
          <ion-list lines="full">
            <ion-item>
              <ion-label>{{translate("User Id")}}</ion-label>
              <ion-label slot="end">{{ organizationDetails.userId }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>{{translate("Full Name")}} </ion-label>
              <ion-label slot="end">{{ organizationDetails.userFullName }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>{{translate("Email")}}</ion-label>
              <ion-label slot="end">{{ organizationDetails.emailAddress }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>{{translate("User Name")}}</ion-label>
              <ion-label slot="end">{{ organizationDetails.username }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>{{translate("Organization Name")}}</ion-label>
              <ion-label slot="end">{{ organizationDetails.organizationName }}</ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-button slot="end" color="warning" fill="outline" @click="updatePassword(organizationDetails)">
                {{ translate("Change Password") }}
              </ion-button>
              <ion-button slot="end" fill="outline" @click="updateProfile(organizationDetails)">
                {{ translate("Update Profile") }}
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-card>
      </div>
      <div v-if="segmentSelected === 'syncStatus'">
        <div class="find">
          <aside>
            <ion-list>
              <ion-item lines="none">
                <h2>{{ translate("Loop Return Statistics") }}</h2>
              </ion-item>
              <ion-item lines="none">
                <ion-searchbar v-model="searchQuery" :placeholder="translate('Search Return')" @keyup.enter="searchQuery = $event.target.value"/>
              </ion-item>
              <ion-item button @click="getLoopReturnStatusList('ALL')">
                <ion-label>
                  {{ translate("All Returns") }}
                </ion-label>
                <ion-chip slot="end" outline="true" color="dark">{{ returnTotalCount }}</ion-chip>
              </ion-item>
              <ion-item button @click="getLoopReturnStatusList('RT_OPEN')">
                <ion-label>
                  {{ translate("Open") }}
                </ion-label>
                <ion-chip slot="end" outline="true" color="primary">{{ returnCount.open }}</ion-chip>
              </ion-item>
              <ion-item button @click="getLoopReturnStatusList('RT_REFUNDED')">
                <ion-label>
                  {{ translate("Closed") }}
                </ion-label>
                <ion-chip slot="end" outline="true" color="success">{{ returnCount.closed }}</ion-chip>
              </ion-item>
              <ion-item button @click="getLoopReturnStatusList('RT_ERROR')">
                <ion-label>
                  {{ translate("Failed") }}
                </ion-label>
                <ion-chip slot="end" outline="true" color="danger">{{ returnCount.failed }}</ion-chip>
              </ion-item>
            </ion-list>
          </aside>
          <main>
            <ion-item>
              <div class="section-header ion-text-center">
                <strong>{{translate("Loop Return Id")}}</strong>
                <strong>{{translate("Shopify Order Id")}}</strong>
                <strong>{{translate("Shopify Order Name")}}</strong>
                <strong>{{translate("NetSuite Return Id")}}</strong>
                <strong>{{translate("Status")}}</strong>
                <strong>{{translate("History")}}</strong>
              </div>
            </ion-item>
            <ion-item v-for="(item, i) in returnStatusList" :key="i" class="list-item">
              <div class="section-header ion-text-center">
                <ion-label>{{item.loopReturnId}}</ion-label>
                <ion-label>{{ item.shopifyOrderId }}</ion-label>
                <ion-label>
                  {{ item.shopifyOrderName }}
                </ion-label>
                <ion-label>{{item.netsuiteReturnId}}</ion-label>
                <div>
                  <ion-badge :color="item.status === 'Refunded' ? 'success' : item.status === 'Error' ? 'danger' : ''">{{ item.status }}</ion-badge>
                </div>
                <ion-button fill="clear" size="default" @click="openReturnStatusModal(item)">
                  <ion-icon slot="icon-only" :icon="openOutline"></ion-icon>
                </ion-button>
              </div>
            </ion-item>
          </main>
        </div>
      </div>
      <ion-infinite-scroll @ionInfinite="loadMoreReturns($event)" threshold="100px" v-show="(segmentSelected === 'syncStatus')" ref="infiniteScrollRef">
        <ion-infinite-scroll-content loading-spinner="crescent" :loading-text="translate('Loading')" />
      </ion-infinite-scroll>
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
  IonBadge,
  IonHeader,
  IonIcon,
  IonItem,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonThumbnail,
  IonToolbar,
  IonSearchbar,
  modalController,
  onIonViewDidEnter
} from "@ionic/vue";

import { computed, ref } from "vue";
import { useStore } from "@/store";
import { copyToClipboard, showToast } from "@/utils";
import { addOutline, openOutline, pencilOutline, trashOutline } from "ionicons/icons";
import NetSuiteModal from "@/components/NetSuiteModal.vue";
import LoopModal from "@/components/LoopModal.vue";
import { translate } from '@/i18n';
import NetSuiteMappingModal from "@/components/NetSuiteMappingModal.vue";
import UpdateUserLoginModal from "@/components/UpdateUserLoginModal.vue";
import ChangePasswordModal from "@/components/ChangePasswordModal.vue";
import ReturnStatusModal from "@/components/ReturnStatusModal.vue";
import { hasError } from "@hotwax/oms-api";
import logger from "@/logger";
import { UserService } from "@/services/UserService";
import { IonInfiniteScrollCustomEvent } from "@ionic/core";
import emitter from "@/event-bus";

const store = useStore();

const segmentSelected = ref('configuration');
const nsCredentialsList = ref([]);
const loopCredentialsList = ref([]);
const loopWebhookVerified = ref([]);
const netSuiteMapping = ref([]);
const searchQuery = ref('');
const returnStatusList = ref([]);
const returnCount = ref({});
const returnTotalCount = ref(0);
const currentStatus = ref("ALL");
const pageIndex = ref(0);
const loadMore = ref(true);
const loginKeyMap = ref({});

const organizationDetails = computed(() => store.getters['user/getOrganizationDetails']);


onIonViewDidEnter(async() => {
  emitter.emit("presentLoader", { message: "loading...", backdropDismiss: true });
  await getVerifyLoopWebhook()
  await fetchUserNetSuiteDetails();
  await fetchUserLoopDetails();
  await getNetSuiteRMAMapping();
  await getAPIKey()
  await fetchUserProfile();
  emitter.emit("dismissLoader");
})

const segmentChanged = async(event: any) => {
  segmentSelected.value = event.detail.value;
  if (segmentSelected.value === 'syncStatus') {
    emitter.emit("presentLoader", { message: "loading...", backdropDismiss: true });
    await getLoopReturnStatusCount()
    await getLoopReturnStatusList("ALL");
    emitter.emit("dismissLoader");
  } 
};

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
      showToast(response.messages);
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

async function deleteLoopWebHook(data: any) {
  try {
    const response = await UserService.deleteLoopWebHook(data);
    if (!hasError(response)) {
      showToast(translate("Loop Webhook Unscrible successfully."));
      getVerifyLoopWebhook()
    } else {
      throw response.data
    }
  } catch (err) {
    logger.error(err)
    showToast(translate("Failed to Unscrible Loop webhook."));
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
  emitter.emit("presentLoader", { message: "Syncing...", backdropDismiss: true });
  const response = await store.dispatch('user/syncNetsuiteMapping', systemMessageRemoteId);
  if (response) {
    await getNetSuiteRMAMapping()
    emitter.emit("dismissLoader");
    showToast(translate("NetSuite mapping synced successfully."));
  } 
}

async function syncAllNetsuiteMapping(systemMessageRemoteId: string) {
  try {
    emitter.emit("presentLoader", { message: "Syncing...", backdropDismiss: true });
    const response = await UserService.syncAllNetsuiteMapping(systemMessageRemoteId);
    if (response) {
      await getNetSuiteRMAMapping()
      emitter.emit("dismissLoader");
      showToast(translate("NetSuite mapping synced successfully."));
    }
  } catch (error) {
    logger.error(error)
    showToast(translate("Unable to sync NetSuite mapping. Please try again."));
  } 
}

async function deleteIntegrationTypeMappings(payload: any) {
  const response = await store.dispatch('user/deleteIntegrationTypeMappings', payload);
  if (response) {
    getNetSuiteRMAMapping()
    showToast(translate("NetSuite mapping deleted successfully."));
  } 
}

async function updateIntegrationTypeMapping(mapping: any) {
  
  const alert = await alertController.create({
    header: 'Enter Mapping Value',
    inputs: [
      {
        name: 'mappingValue',
        type: 'number',
        placeholder: 'Mapping value'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Save',
        handler: async (data) => {
          if (!data.mappingValue.trim()) {
            showToast(translate("Please provide a value."));
            return false;
          }
          const payload = { 
            integrationMappingId: mapping.integrationMappingId,
            mappingValue: data.mappingValue 
          };
          try {
            emitter.emit("presentLoader", { message: "Updating...", backdropDismiss: true });
            const response = await UserService.updateIntegrationTypeMapping(payload);
            if (!hasError(response)) {
              await getNetSuiteRMAMapping()
              emitter.emit("dismissLoader");
              showToast(translate("NetSuite mapping updated successfully."));
            } else {
              throw response.data
            }
          } catch (err) {
            logger.error(err)
            showToast(translate("Failed to update NetSuite mapping."));
          }
        }
      }
    ]
  });
  await alert.present();
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

async function getAPIKey() {
  try {
    const response = await UserService.getAPIKey();
    if (response) {
      loginKeyMap.value = response.data.loginKeyMap;
    }
  } catch (error) {
    logger.error(error)
    showToast(translate("Failed to get apiKey."));
  }
}

async function postAPIKey(credentials: any) {
  const response = await store.dispatch('user/postAPIKey', credentials);
  if (response) {
    const alert = await alertController.create({
      header: 'Refresh API Key',
       message: `
        An API Key has been generated for NetSuite Account ID <b>${credentials.remoteId}</b>.<br/><br/>
        Please copy and save this key now — it will only be shown once.<br/>
        Use this key to create an API Secret record in NetSuite.<br/><br/>
        <b>Your API Key is:</b> ${response.loginKey}
      `,
      buttons: [
        {
          text: 'copy API Key',
          role: 'copy',
          handler: () => copyToClipboard(response?.loginKey)
        },
      ]
    });
    getAPIKey()
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

async function openReturnStatusModal(returnMap: any) {
  try {
    const response = await UserService.getLoopReturnStatusDetails(returnMap.loopReturnId);
    if (!hasError(response)) {
      const modal = await modalController.create({
        component: ReturnStatusModal,
        componentProps: { response: response.data, returnMap },
      });
      modal.present();
      await modal.onWillDismiss();
    } else {
      throw response.data
    }
  } catch (error) {
    logger.error(error)
    showToast(translate("Failed to get Loop return details."));
  }
}

async function getLoopReturnStatusCount() {
  try {
      const response = await UserService.getLoopReturnStatusCount()
      if (!hasError(response)) {
        returnCount.value = response.data.returnCountMap
        returnTotalCount.value = response.data.returnCountMap.open + response.data.returnCountMap.closed + response.data.returnCountMap.failed
      } else {
        throw response.data
      }
    } catch (err) {
      logger.error(err)
      showToast(translate("Failed to fetch return count."));
    }
}

async function getLoopReturnStatusList(statusId: string, reset = true ,pageSize = 50) {
  try {
    emitter.emit("presentLoader", { message: "loading...", backdropDismiss: true });
    if (reset) {
      pageIndex.value = 0;
      loadMore.value = true;
      currentStatus.value = statusId;
    }

    const params: any = { pageIndex: pageIndex.value, pageSize };
    if (statusId && statusId !== "ALL") {
      params.statusId = statusId;
    }

    const response = await UserService.getLoopReturnStatusList(params);
    if (!hasError(response)) {
      const data = response.data?.returnList || [];
      if (data.length < pageSize) loadMore.value = false;
      returnStatusList.value = reset ? data : [...returnStatusList.value, ...data];
      emitter.emit("dismissLoader");
    } else {
      throw response.data;
    }
  } catch (err) {
    logger.error(err);
    emitter.emit("dismissLoader");
    showToast(translate("Failed to fetch return list."));
  }
}

async function loadMoreReturns(ev: IonInfiniteScrollCustomEvent<void>) {
  if (!loadMore.value) {
    ev.target.complete();
    return;
  }
  pageIndex.value++;
  await getLoopReturnStatusList(currentStatus.value, false);
  ev.target.complete();
}

const confirmDelete = async (onConfirm: any, message?: string) => {
  const alert = await alertController.create({
      subHeader:  message ? message : 'Do you really want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: onConfirm
        }
      ]
    });
    await alert.present();
}

</script>
<style scoped>
aside {
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.ion-card-width {
  width: 100%;
  max-width: 500px;
  margin: 10px auto
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

.netsuite-mapping-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 5fr 2fr 2fr 2fr 1fr;
  align-items: center;
}

.item-grid-loop {
  width: 100%;
  display: grid;
  grid-template-columns: 7fr 3fr 2fr;
  align-items: center;

}

.ion-text-center {
  text-align: center;
}

.section-header {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 2fr); 
  align-items: center;
  padding: 14px;
  transition: background-color 0.3s; 
}

ion-item.list-item:hover .section-header {
  background-color: #f0f0f0; 
  cursor: pointer;
}

@media (min-width: 531px) {
  section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(531px, 1fr));
  }
}
</style>