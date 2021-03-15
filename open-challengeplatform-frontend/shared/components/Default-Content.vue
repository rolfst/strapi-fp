<template>
  <div class="default-content">
    <div class="default-content--header-image">
      <img
        :src="bannerUrl"
        class="default-content--header-image--image"
        :alt="headerImageAltText"
        :title="headerImageAltText"
      >
    </div>
    <div class="default-content--content flex-container">
      <challenge-details-service v-if="type === 'challenge_news'" :endpoint="`challenges/${challengeSlug}`">
        <div slot-scope="{ challengeDetails: challenge, companyLogoUrl: logoUrl }" class="news--company-logo">
          <img
            :src="logoUrl"
            class="default-content--company-logo"
            :alt="companyLogoAltText"
            :title="companyLogoAltText"
          >
        </div>
      </challenge-details-service>
      <h1>{{ content.title }}</h1>
      <p class="intro">
        {{ content.summary }}
      </p>
      <div v-html="content.body" />
    </div>
  </div>
</template>

<script>
import ChallengeDetailsService from '~/shared/services/ChallengeDetails-Service';

export default {
  components: {
    'challenge-details-service': ChallengeDetailsService
  },
  props: {
    content: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: 'news',
      required: true
    },
    challengeSlug: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      companyLogoAltText: '',
      headerImageAltText: ''
    };
  },
  computed: {
    bannerUrl () {
      if (this.$props.content.banner) {
        return (this.$props.content.banner) ? process.env.restApi + this.$props.content.banner.url : '/images/banner_default.jpg';
      }
      return '/images/banner_default.jpg';
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.companyLogoAltText = this.$i18n.t('default-content--company-logo--alt-text');
      this.headerImageAltText = this.$i18n.t('default-content--header-image--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.default-content {
  &--header {
    &-image {
      height: 500px;
      overflow: hidden;
      background-size: cover;

      &--image {
        width: 100%;
      }
    }
  }

  &--company-logo {
    height: 68px;
  }

  &--content {
    position: relative;
    padding: 40px 90px;
    margin-top: -150px;
    background-color: white;
    min-height: 100px;

    &--sections {
      display: flex;
      flex-direction: column;

      &--section {
        margin-top: 30px;
      }
    }

    .intro {
      width: 100%;
      font-size: 22px;
    }

    .small {
      font-family: $font-roboto-light;
      color: $color-gray-30;
      font-size: 14px;
      margin-right: 40px;
    }

    h1 {
      width: 100%;
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .tags {
      .tag {
        display: inline-block;
      }
    }

  &.flex-container {
      justify-content: unset;
    }
  }
}
</style>
