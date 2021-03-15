<template>
  <news-details-service :endpoint="`challenges/${challengeSlug}/articles/${newsSlug}`">
    <div slot-scope="{ data: news }" class="news">
      <default-content :content="news" :challengeSlug="challengeSlug" type="challenge_news" />
    </div>
  </news-details-service>
</template>

<script>
import NewsDetailsService from '~/shared/services/NewsDetails-Service';
import DefaultContent from '~/shared/components/Default-Content';

export default {
  components: {
    'news-details-service': NewsDetailsService,
    'default-content': DefaultContent
  },
  computed: {
    challengeSlug () {
      return this.$route.params.id;
    },
    newsSlug () {
      return this.$route.params.news_id;
    }
  },
  data () {
    return {
      tags: ['Social Media', 'Sand', 'Marine']
    };
  }
};
</script>

<style lang="scss" scoped>
  .news {
    &--header {
      &-image {
        height: 500px;
        overflow: hidden;

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

      &--sections {
        display: flex;
        flex-direction: column;

        &--section {
          margin-top: 30px;
        }
      }

      .intro {
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
