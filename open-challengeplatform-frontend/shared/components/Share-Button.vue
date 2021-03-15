<template>
  <div class="share-button">
    <img
      class="share-icon"
      :alt="shareIconAltText"
      :title="shareIconAltText"
    >
  </div>
</template>

<script>
export default {
  data () {
    return {
      shareIconAltText: ''
    };
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.shareIconAltText = this.$i18n.t('share-button--share-icon--alt-text');
    }
  }
};
</script>
