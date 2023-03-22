<template>
  <div class="wrapper">
    <span
      v-if="!isCameraOpen"
      class="material-icons md-48"
      @click="toggleCamera()"
    >
      photo_camera
    </span>
    <span v-else>Close Camera</span>
    <div class="video-container">
      <video v-show="isCameraOpen" class="camera-video" ref="camera" :width="450" :height="337" autoplay playsinline ></video>
      <canvas id="photoTaken" v-show="isPhotoTaken" class="canvas-photo" ref="canvas" :width="450" :height="337"></canvas>
    </div>
      <button v-if="!isPhotoTaken && isCameraOpen" class="button-snap" @click="takePhoto">
      <span>Snap!</span>
    </button>
    <button v-show="isPhotoTaken && isCameraOpen" class="camera-download">
      <button role="button" @click="sendImage">
        send
      </button>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCameraOpen: false,
      isPhotoTaken: false
    }
  },
  methods: {
    createCameraElement: function () {
      const constraints = (window.constraints = {
        audio: false,
        video: true
      })

      navigator.mediaDevices
        ?.getUserMedia(constraints)
        ?.then(stream => {
          this.$refs.camera.srcObject = stream
        })
    },
    stopCameraStream: function () {
      const tracks = this.$refs.camera.srcObject.getTracks()

      tracks.forEach(track => {
        track.stop()
      })
      console.log('CameraClosed')
    },
    toggleCamera: function () {
      if (this.isCameraOpen) {
        this.isCameraOpen = false
        this.isPhotoTaken = false
        this.stopCameraStream()
      } else {
        this.isCameraOpen = true
        this.createCameraElement()
      }
    },
    takePhoto: function () {
      this.isPhotoTaken = !this.isPhotoTaken

      const context = this.$refs.canvas.getContext('2d')
      const videoRef = this.$refs.camera

      context.drawImage(videoRef, 0, 0, 450, 337)
    }
  }
}
</script>
