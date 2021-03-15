<template>
  <div class="challenge-hero">
    <div class="challenge-hero--hero-image--container">
      <img
        :src="getImageUrl"
        class="challenge-hero--hero-image--image"
        :alt="heroImageAltText"
        :title="heroImageAltText"
      >
    </div>
    <div class="challenge-hero--content flex-container">
      <div class="row">
        <div class="logo">
          <img
            :src="getCompanyImageUrl"
            class="logo"
            :alt="companyImageAltText"
            :title="companyImageAltText"
          >
        </div>
        <div class="challenge-hero--social">
          <div class="social-item">
            <button>
              <img
                src="~assets/images/chat_bubble.svg"
                class="icon purple _comment"
                :alt="commentsIconAltText"
                :title="commentsIconAltText"
              >
            </button>
            <span class="icon-label">{{ details.child_count }}</span>
          </div>
          <div class="social-item">
            <button @click="likeChallenge()">
              <img
                src="~assets/images/thumb_up.svg"
                :class="'icon ' + [details.likedByUser ? 'purple' : ''] + ' _like'"
                :alt="likesIconAltText"
                :title="likesIconAltText"
              >
            </button>
            <span class="icon-label">{{ details.likes }}</span>
          </div>
          <div class="social-item">
            <button @click="favoriteChallenge()">
              <img
                src="~assets/images/favorite.svg"
                :class="'icon ' + [details.favoritedByUser ? 'purple' : ''] + ' _favorite'"
                :alt="favoritesIconAltText"
                :title="favoritesIconAltText"
              >
            </button>
            <span class="icon-label">{{ details.favorites }}</span>
          </div>
          <div class="social-item">
            <share :endpoint="'/challenges/' + details.slug" />
          </div>
        </div>
      </div>
      <h1>{{ details.title }}</h1>
      <div class="tag-container">
        <tag v-for="tag in details.tags" :key="tag" color="blue">
          {{ tag }}
        </tag>
      </div>
    </div>
  </div>
</template>

<script>
import Tag from '~/shared/components/Tag';
import Share from '~/shared/components/Share';
export default {
  components: {
    'tag': Tag,
    'share': Share
  },
  props: {
    details: {
      type: Object,
      default: null
    },
    updateDetailService: {
      type: Function,
      default: null
    },
    likeChallenge: {
      type: Function,
      default: null
    },
    favoriteChallenge: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      commentsIconAltText: '',
      companyImageAltText: '',
      favoritesIconAltText: '',
      heroImageAltText: '',
      heroUrl: '/images/banner_default.jpg',
      likesIconAltText: ''
    };
  },
  computed: {
    getImageUrl () {
      if (this.$props.details.hero) {
        return process.env.restApi + this.$props.details.hero.url.toString();
      } else {
        return this.heroUrl;
      }
    },
    getCompanyImageUrl () {
      if (this.$props.details.company) {
        if (this.$props.details.company.logo) {
          return process.env.restApi + this.$props.details.company.logo.url.toString();
        }
      }
      return '';
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    updateChallengeDetails (attr) {
      this.$props.details.favourite = !this.$props.details.favourite;
      const patchObject = {
        type: attr
      };
      this.$props.updateDetailService(patchObject);
    },
    translate () {
      this.commentsIconAltText = this.$i18n.t('challenge-hero--comments-icon--alt-text');
      this.companyImageAltText = this.$i18n.t('challenge-hero--company-image--alt-text');
      this.favoritesIconAltText = this.$i18n.t('challenge-hero--favorites-icon--alt-text');
      this.heroImageAltText = this.$i18n.t('challenge-hero--image--alt-text');
      this.likesIconAltText = this.$i18n.t('challenge-hero--likes-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}

.challenge-hero {
  width: 100%;
  background-color: white;

  &--hero-image {
    &--container {
      position: relative;
      z-index: 0;
      height: 500px;
      width: 100%;
      overflow: hidden;
    }

    &--image {
      width: 100%;
      margin-top: -10%;
    }
  }

  &--content {
    position: relative;
    z-index: 2;
    background: white;
    padding: 54px 85px;
    margin-top: -200px !important;
    min-height: 250px;

    &.flex-container {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  .logo {
    height: 44px;
  }

  .tag-container {
    display: inline-flex;
    flex-wrap: wrap;
    margin-top: 36px;
    width: 100%;
  }

  &--social {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    height: 100%;

    .social-item {
      display: flex;
    }

    .icon-label {
      font-family: $font-roboto-light;
      font-size: 18px;
      line-height: 29px;
      margin-left: 12px;
      margin-right: 35px;
    }
  }

  .icon {
    height: 28px;
    width: 28px;
    margin-bottom: -5px;
    &.white {
      filter: invert(89%) sepia(100%) saturate(0%) hue-rotate(78deg)
        brightness(105%) contrast(102%);
    }
    &.purple {
      filter: invert(36%) sepia(8%) saturate(6440%) hue-rotate(272deg)
        brightness(91%) contrast(86%);
      --webkit-filter: invert(36%) sepia(8%) saturate(6440%) hue-rotate(272deg)
        brightness(91%) contrast(86%);
    }
  }

  &--social-side {
    position: absolute;
    right: 0;
    top: 60px;
    display: flex;
    flex-direction: column;

    .social-button {
      padding: 8px 12px;
      margin-bottom: 24px;
      border: 1px solid white;
      border-radius: 4px;
      box-shadow: 0 4px 6px 0 rgba(190, 190, 190, 0.2),
        0 1px 3px 0 rgba(190, 190, 190, 0.2);
    }

    .social-button:hover {
      background-color: white;
      border: 1px solid $color-primary-purple;
      .icon {
        filter: invert(36%) sepia(8%) saturate(6440%) hue-rotate(272deg)
          brightness(91%) contrast(86%);
        --webkit-filter: invert(36%) sepia(8%) saturate(6440%)
          hue-rotate(272deg) brightness(91%) contrast(86%);
      }
    }
  }

  h1 {
    margin-top: 42px;
  }

  .container {
    height: 500px;
    width: 1000px;
    position: absolute;
  }
}

button {
  background: unset;
  border: unset;
}
</style>
