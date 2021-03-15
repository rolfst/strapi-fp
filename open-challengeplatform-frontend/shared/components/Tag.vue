<template>
  <div :class="tagClass + ' _tag'">
    <div>{{ title }}</div>
    <slot />
    <div v-if="$props.closable">
      <img
        src="../../assets/images/cancel-circle.svg"
        class="icon remove"
        :alt="closeIconAltText"
        :title="closeIconAltText"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'title',
    'color',
    'closable'],
  data () {
    return {
      closeIconAltText: ''
    };
  },
  computed: {
    tagClass: function () {
      if (this.color === 'blue') {
        return 'tag-blue';
      } else if (this.color === 'outline') {
        return 'tag-outline';
      } else {
        return 'tag';
      }
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.closeIconAltText = this.$i18n.t('tag--close-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.tag {
  display: flex;
  height: 30px;
  padding: 2px 15px;
  line-height: 30px;
  text-align: center;
  border-radius: 20.5px;
  background-color: #f5f5f5;
  margin-right: 10px;
  font-size: 12px;
  font-family: $font-roboto-light;
  align-items: center;
  color: $color-gray-50;
}

.tag-blue {
  @extend .tag;
  background-color: #00526e;
  color: white;
}

.tag-outline {
  @extend .tag;
  border: 1px solid #00526E
}

.remove {
  margin-top: 10px;
  margin-left: 10px;
  filter: invert(100%) sepia(1%) saturate(158%) hue-rotate(29deg) brightness(114%) contrast(87%);
}
</style>
