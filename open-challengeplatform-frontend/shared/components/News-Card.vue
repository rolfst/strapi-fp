<template>
  <div class="news-card">
    <div class="news-card--header">
      <img
        :src="imageUrl"
        class="news-card--header--image"
        :alt="headerImageAltText"
        :title="headerImageAltText"
      >
    </div>
    <div class="news-card--content">
      <h3>{{ newsItem.title }}</h3><br>
      <span class="sub">{{ datetime }}</span>
      <p>{{ newsItem.summary }}</p>
      <button class="button primary" @click="handleClick_ReadMore()">
        {{ $t('read-more') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    newsItem: {
      type: Object,
      required: true,
      default: () => {
        return {
          title: 'title',
          summary: 'summary'
        };
      }
    },
    testimonial: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      headerImageAltText: ''
    };
  },
  computed: {
    imageUrl () {
      if (this.newsItem) {
        if (this.newsItem.banner) {
          return process.env.restApi + this.newsItem.banner.url;
        } else {
          return '/images/banner_default.jpg';
        }
      } else {
        return '/images/banner_default.jpg';
      }
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    handleClick_ReadMore () {
      if (this.$props.testimonial) {
        this.$router.push(`/testimonials/${this.$props.newsItem.slug}`);
      } else {
        this.$router.push(`/challenges/${this.$props.newsItem.challenge_id}/news/${this.$props.newsItem.slug}`);
      }
    },
    translate () {
      this.headerImageAltText = this.$i18n.t('news-card--header-image--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.news-card {
  width: 490px;

  .news-card--header {
    width: 100%;
    height: 320px;
    overflow: hidden;
  }

  .news-card--header--image {
    position: relative;
    width: 100%;
    z-index: 0;
    box-shadow: 0 1px 3px 0 rgba(190,190,190,0.2), 0 4px 6px 0 rgba(190,190,190,0.2);
  }

  .news-card--content {
    border-top: 4px solid #FF9200;
    position: relative;
    padding: 20px;
    width: 80%;
    min-height: 200px;
    margin-top: -90px;
    z-index: 2;
    background-color: white;
    box-shadow: 0 1px 3px 0 rgba(190,190,190,0.2), 0 4px 6px 0 rgba(190,190,190,0.2);
  }
}
</style>
