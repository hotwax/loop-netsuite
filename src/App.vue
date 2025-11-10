<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, loadingController } from '@ionic/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import emitter from '@/event-bus'
import { initialise, resetConfig } from '@/adapter'

const store = useStore()
const router = useRouter()
const loader = ref<any>(null)
const maxAge = process.env.VUE_APP_CACHE_MAX_AGE ? parseInt(process.env.VUE_APP_CACHE_MAX_AGE) : 0

const userToken = computed(() => store.getters['user/getUserToken'])
const instanceUrl = computed(() => store.getters['user/getInstanceUrl'])


async function presentLoader(options = { message: 'Click the backdrop to dismiss.', backdropDismiss: true }) {
  // Remove existing loader if a custom message is provided
  if (options.message && loader.value) dismissLoader()

  if (!loader.value) {
    loader.value = await loadingController.create({
      message: options.message,
      translucent: true,
      backdropDismiss: options.backdropDismiss
    })
  }

  await loader.value.present()
}

function dismissLoader() {
  if (loader.value) {
    loader.value.dismiss()
    loader.value = null
  }
}


const unauthorised = async () => {
  await store.dispatch('user/logout')
  router.push('/login')
}

initialise({
  token: userToken.value,
  instanceUrl: instanceUrl.value,
  cacheMaxAge: maxAge,
  events: {
    unauthorised,
    responseError: () => setTimeout(() => dismissLoader(), 100),
    queueTask: (payload: any) => emitter.emit('queueTask', payload)
  },
  systemType: 'MOQUI'
})

onMounted(() => {
  emitter.on('presentLoader', presentLoader)
  emitter.on('dismissLoader', dismissLoader)
})

onUnmounted(() => {
  emitter.off('presentLoader', presentLoader)
  emitter.off('dismissLoader', dismissLoader)
  resetConfig()
})
</script>

<style scoped>
ion-split-pane {
  --side-width: 304px;
}
</style>
