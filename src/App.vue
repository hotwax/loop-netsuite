<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, loadingController } from '@ionic/vue';
import { defineComponent, ref, computed, onMounted, onUnmounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import emitter from "@/event-bus";
import { initialise, resetConfig } from '@/adapter';

export default defineComponent({
  name: 'App',
  components: { IonApp, IonRouterOutlet },
  setup() {
    const store = useStore();
    const router = useRouter();

    const loader = ref<any>(null);
    const maxAge = process.env.VUE_APP_CACHE_MAX_AGE ? parseInt(process.env.VUE_APP_CACHE_MAX_AGE) : 0;

    // Vuex getters converted:
    const userToken = computed(() => store.getters['user/getUserToken']);
    const instanceUrl = computed(() => store.getters['user/getInstanceUrl']);
    const userProfile = computed(() => store.getters['user/getUserProfile']);

    async function presentLoader(options = { message: "Click the backdrop to dismiss.", backdropDismiss: true }) {
      // When having a custom message remove already existing loader, if not removed it takes into account the already existing loader
      if(options.message && loader.value) dismissLoader();

      if (!loader.value) {
        loader.value = await loadingController
          .create({
            message: options.message,
            translucent: true,
            backdropDismiss: options.backdropDismiss
          });
      }
      loader.value.present();
    }

    function dismissLoader() {
      if (loader.value) {
        loader.value.dismiss();
        loader.value = null as any;
      }
    }

    const unauthorised = async () => {
      store.dispatch("user/logout");
      router.push("/login");
    };

    // initialise call moved to setup() because Composition API does not use created()
    initialise({
      token: userToken.value,
      instanceUrl: instanceUrl.value,
      cacheMaxAge: maxAge,
      events: {
        unauthorised,
        responseError: () => setTimeout(() => dismissLoader(), 100),
        queueTask: (payload: any) => emitter.emit("queueTask", payload)
      },
      systemType: "MOQUI"
    });

    onMounted(() => {
      emitter.on('presentLoader', presentLoader);
      emitter.on('dismissLoader', dismissLoader);
    });

    onUnmounted(() => {
      emitter.off('presentLoader', presentLoader);
      emitter.off('dismissLoader', dismissLoader);
      resetConfig();
    });

    return {
      router,
      store,
      presentLoader,
      dismissLoader,
      userToken,
      instanceUrl,
      userProfile
    };
  }
});
</script>

<style scoped>
ion-split-pane {
  --side-width: 304px;
}
</style>