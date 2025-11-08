<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ translate("Settings") }}</ion-title>
      </ion-toolbar>
    </ion-header> 
    <ion-content>
      <div class="user-profile">
        <ion-card>
          <ion-item lines="full">
            <ion-card-header class="ion-no-padding ion-padding-vertical">
              <ion-card-subtitle>{{ organizationDetails?.username }}</ion-card-subtitle>
              <ion-card-title>{{ organizationDetails?.userFullName }}</ion-card-title>
            </ion-card-header>
          </ion-item>
          <ion-button color="danger" @click="logout()">{{ translate("Logout") }}</ion-button>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter } from "@ionic/vue";
import { useStore } from "vuex";
import { translate } from "@/i18n";
import { computed, ref } from "vue";

onIonViewDidEnter(async() => {
  await fetchUserProfile()
})
const store = useStore()
const organizationDetails = computed(() => store.getters['user/getOrganizationDetails']);


async function fetchUserProfile() {
  if (organizationDetails.value) return
  await store.dispatch('user/getProfile');
}

function logout() {
  store.dispatch('user/logout').then(() => {
    const redirectUrl = window.location.origin + '/login'
    window.location.href = redirectUrl
  })
}

</script>
<style scoped>
  ion-card > ion-button {
    margin: var(--spacer-xs);
  }
  .user-profile {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
</style>