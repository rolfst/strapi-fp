<template>
  <div class="spinner">
    <img
      src="../../assets/images/spinner.svg"
      :alt="spinnerIconAltText"
      :title="spinnerIconAltText"
    >
  </div>
</template>

<script>
export default {
  data () {
    return {
      spinnerIconAltText: ''
    };
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.spinnerIconAltText = this.$i18n.t('spinner--spinner-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.spinner {
  text-align: center;
  width: 100%;

  img {
    width: 45px;
  }
}
</style>
