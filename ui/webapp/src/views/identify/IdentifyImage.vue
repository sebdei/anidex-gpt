<template>
  <div class="container">
    <div class="d-flex align-items-center justify-content-around image-selection">
      <ImageDataUrlLoader @change="setImageDataUrl" />
    </div>

    <div v-if="imageDataUrl">
      <Cropper
        v-if="imageDataUrl"
        ref="cropper"
        :src="imageDataUrl"
        :stencil-props="{ aspectRatio: 12/12 }"
        class="cropper mb-3"
      />

      <button
        v-if="showIdentifyButton"
        @click="sendCroppedImage"
        class="btn btn-secondary btn-lg btn-block"
        >
          Identifizieren
      </button>

      <div
        v-else-if="isFetching"
        class="spinner-border"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>

      <div
        v-if="responseText"
        class="mt-3"
      >
        <p>{{ responseText }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { IDENTIFY_IMAGE_URL } from '@/urls'
import { synthesisText } from '@/service/speechsynthesis'
import api from '@/service/api'

import { Cropper } from 'vue-advanced-cropper'
import ImageDataUrlLoader from '@/components/input/ImageDataUrlLoader.vue'

import 'vue-advanced-cropper/dist/style.css'

export default {
  components: {
    Cropper,
    ImageDataUrlLoader
  },
  data () {
    return {
      imageDataUrl: null,
      isFetching: false,
      showIdentifyButton: false,
      responseText: null
    }
  },
  methods: {
    sendCroppedImage: async function () {
      // !sic Initializing speech synthesis here, because it is not possible to use the WebSpeech API after async behavior
      synthesisText('Bitte einen Moment!')

      this.showIdentifyButton = false
      this.isFetching = true

      const { canvas } = this.$refs.cropper.getResult();
      const croppedImageDataUrl = canvas.toDataURL('image/jpeg')

      const data = { image_data_url: croppedImageDataUrl }
      const { text } = await api.post(IDENTIFY_IMAGE_URL, data)

      this.isFetching = false
      this.responseText = text

      synthesisText(text)
    },
    setImageDataUrl: function (imageDataUrl) {
      this.showIdentifyButton = true
      this.imageDataUrl = imageDataUrl
    }
  }
}
</script>

<style scoped>
.image-selection {
  height: 120px;
}

:deep(.vue-advanced-cropper__background),
:deep(.vue-advanced-cropper__cropper-wrapper),
:deep(.vue-advanced-cropper__foreground),
:deep(.vue-advanced-cropper__image-wrapper) {
  border-radius: .25rem!important;
}
</style>
