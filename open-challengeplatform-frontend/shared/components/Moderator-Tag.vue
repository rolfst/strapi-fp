<template>
  <div class="moderator-tag">
    <div>
      <img
        src="../../assets/images/person_placeholder.jpg"
        class="moderator-tag--image"
        :alt="personPlaceholderAltText"
        :title="personPlaceholderAltText"
      >
    </div>
    <div class="moderator-tag--name">
      {{ $t('moderator-tag--moderator-name') }}
    </div>
    <div>
      <img
        src="../../assets/images/cancel-circle.svg"
        class="icon moderator-tag--remove"
        :alt="cancelIconAltText"
        :title="cancelIconAltText"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'moderator'
  ],
  data () {
    return {
      cancelIconAltText: '',
      personPlaceholderAltText: ''
    };
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.cancelIconAltText = this.$i18n.t('moderator-tag--cancel-icon--alt-text');
      this.personPlaceholderAltText = this.$i18n.t('moderator-tag--person-placeholder--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.moderator-tag {
  display: flex;
  width: fit-content;
  padding-top: 3px;
  padding-left: 5px;
  justify-content: flex-start;
  border-radius: 20.5px;
  background-color: #efefef;
  margin-right: 10px;
  font-size: 12px;
  font-family: $font-roboto-regular;
  color: black;
  border: 1px solid $color-gray-30;
}

.moderator-tag--image {
  width: 24px;
  border-radius: 50%;
}

.moderator-tag--name {
  margin-top: 6px;
  margin-left: 8px;
}

.moderator-tag--remove {
  margin-left: 8px;
  padding-right: 4px;
}
</style>
