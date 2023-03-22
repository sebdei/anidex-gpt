<template>
  <div>
    <Cropper
      ref="cropper"
      :src="imageDataUrl"
      :stencil-props="{ aspectRatio: 12/12 }"
      class="cropper"
    />

    <button
      @click="crop"
    >
      Apply
    </button>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'

import 'vue-advanced-cropper/dist/style.css'

export default {
  components: {
    Cropper
  },
  props: {
    imageDataUrl: String
  },
  methods: {
    crop: function () {
      const { canvas } = this.$refs.cropper.getResult();
      const dataUrl = canvas.toDataURL("image/jpeg")

      this.$emit('crop', dataUrl)
    }
  }
}
</script>
