<template>
  <div class="challenge-card">
    <div>
      <img
        :src="getImageUrl"
        class="challenge-card--image-container--image"
        :alt="uploadImageIconAltText"
        :title="uploadImageIconAltText"
      >
    </div>
    <div v-if="timeline" class="challenge-card--timeline">
      <span class="challenge-card--timeline--elapsed" :style="setTimeElapsedStyle(challenge.timeElapsed)" />
    </div>
    <div class="challenge-card--logo">
      <img
        src="../../assets/images/kvk_logo_mail.svg"
        class="logo"
        :alt="logoAltText"
        :title="logoAltText"
      >
    </div>
    <div class="challenge-card--title">
      <h3>{{ challenge.title | limitText(51) }}</h3>
    </div>
    <div class="challenge-card--description">
      <p v-if="challenge.summary" class="small">
        {{ challenge.summary | limitText(110) }}
      </p>
    </div>
    <div class="challenge-card--footer">
      <Tag v-for="(tag, index) in challenge.tags.slice(0,2)" :key="index" :title="tag" />
      <Tag v-if="challenge.tags.length > 2" :title="challenge.tags.length - 2 + ' ' + $t('more').toLowerCase()" />
    </div>
    <div v-if="stats" class="challenge-card--stats">
      <div class="social-item">
        <img
          src="~assets/images/forum.svg"
          class="icon grey"
          :alt="forumIconAltText"
          :title="forumIconAltText"
        >
        <span class="icon-label">{{ challenge.reactions }}</span>
      </div>
      <div class="social-item">
        <img
          src="~assets/images/favorite.svg"
          class="icon grey"
          :alt="favoriteIconAltText"
          :title="favoriteIconAltText"
        >
        <span class="icon-label">{{ challenge.favorites }}</span>
      </div>
      <div class="social-item">
        <img
          src="~assets/images/thumb_up.svg"
          class="icon grey"
          :alt="thumbUpIconAltText"
          :title="thumbUpIconAltText"
        >
        <span class="icon-label">{{ challenge.likes }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Tag from '../../shared/components/Tag';

export default {
  components: {
    Tag
  },
  props: [
    'challenge',
    'stats',
    'timeline'
  ],
  data () {
    return {
      favoriteIconAltText: '',
      forumIconAltText: '',
      logoAltText: '',
      thumbUpIconAltText: '',
      uploadImageIconAltText: ''
    };
  },
  computed: {
    getImageUrl () {
      if (this.$props.challenge.hero) {
        return process.env.restApi + this.$props.challenge.hero.url.toString();
      } else {
        return this.heroUrl;
      }
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    setTimeElapsedStyle: (percent) => {
      return 'width: ' + percent + '%';
    },
    translate () {
      this.favoriteIconAltText = this.$i18n.t('challenge-card--favorite-icon--alt-text');
      this.forumIconAltText = this.$i18n.t('challenge-card--forum-icon--alt-text');
      this.logoAltText = this.$i18n.t('challenge-card--logo--alt-text');
      this.thumbUpIconAltText = this.$i18n.t('challenge-card--thumb-up-icon--alt-text');
      this.uploadImageIconAltText = this.$i18n.t('challenge-card--upload-image-icon--alt-text');
    }
  }
};
</script>

<style scoped lang="scss">
.challenge-card {
  margin-bottom: 20px;
  background-color: white;
  width: 320px;
  transition: transform .2s;

  &:hover {
    transform: scale(1.05);
  }

  .challenge-card--image-container--image {
    width: 100%;
    height: 169px;
    overflow: hidden;
    background-color: grey;

    .challenge-card--image-container--image {
      width: 100%;
      overflow: hidden;
    }
  }

  .challenge-card--timeline {
    margin-top: -4px;
    height: 6px;
    background: $color-gray-30;

    .challenge-card--timeline--elapsed {
      display: block;
      height: 100%;
      background-color: #377f95;
      overflow: hidden;
    }
  }

  .challenge-card--logo {
    padding: 24px 130px 4px 130px;

    .logo {
      width: 60px;
    }
  }

  .challenge-card--title {
    padding: 20px;
    height: 60px;
  }

  .challenge-card--description {
    padding: 0 20px 0 20px;
    height: 80px;
  }

  .challenge-card--footer {
    padding: 20px;
    min-height: 34px;
    display: flex;
    flex-wrap: wrap;
  }

  .challenge-card--stats {
    height: 70px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #bebebe;

    .social-item {
      display: flex;
      align-items: center;
      font-family: $font-roboto-light;

    .icon {
      height: 28px;
      width: 28px;

        &.grey {
          filter: invert(82%);
        }

        &-label {
          padding-left: 12px;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
