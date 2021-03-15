<template>
  <div class="reaction-header">
    <img
      v-if="getImageUrl !== ''"
      :src="getImageUrl"
      :alt="reactionHeaderImageAltText"
      :title="reactionHeaderImageAltText"
    >
    <h3>{{ title }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    details: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      reactionHeaderImageAltText: ''
    };
  },
  computed: {
    getImageUrl () {
      if (this.details.company) {
        if (this.details.company.logo) {
          return process.env.restApi + this.details.company.logo.url;
        }
        return '';
      }
      return '';
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.reactionHeaderImageAltText = this.$i18n.t('reaction--header-image--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.reaction-header {
  display: flex;
  width: 100%;
  margin: 32px 0 24px 0;
  align-items: center;

  img {
    height: 50px;
    margin-right: 24px;
  }
}
</style>
