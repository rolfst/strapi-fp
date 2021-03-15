<template>
  <div class="success-story">
    <div class="success-story--header">
      <img
        :src="imageUrl"
        class="success-story--header--image"
        :alt="headerImageAltText"
        :title="headerImageAltText"
      >
    </div>
    <div class="flex-container">
      <div class="success-story--content">
        <div class="success-story--card">
          <h2>{{ $t('success-story--header') }}</h2>
          <h3>{{ content.title }}</h3>
          <span class="sub">12 January 2019</span>
          <p>{{ content.summary }}</p>
          <button class="button primary" @click="handleClick_toTestimonial()">
            {{ $t('success-story--button') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      headerImageAltText: ''
    };
  },
  computed: {
    imageUrl () {
      return (this.$props.content.banner) ? process.env.restApi + this.$props.content.banner.url : '/images/banner_default.jpg';
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    handleClick_toTestimonial () {
      this.$router.push('/testimonials/' + this.$props.content.slug);
    },
    translate () {
      this.headerImageAltText = this.$i18n.t('success-story--header-image--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.success-story {
  &--header {
    width: 100%;
    max-height: 650px;
    overflow: hidden;

    &--image {
      width: 100%;
    }
  }

  &--content {
    margin-top: -265px;
  }

  &--card {
    border-top: 4px solid #ff9200;
    position: relative;
    padding: 20px;
    width: 75%;
    z-index: 2;
    background-color: white;
    box-shadow: 0 1px 3px 0 rgba(190, 190, 190, 0.2),
      0 4px 6px 0 rgba(190, 190, 190, 0.2);
  }
}
</style>
