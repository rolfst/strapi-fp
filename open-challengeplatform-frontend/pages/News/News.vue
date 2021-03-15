<template>
  <news-service :endpoint="`/challenges/${challengeId}/articles`">
    <div slot-scope="{ data: news }" class="news-overview">
      <div class="news-overview--header flex-container">
        <h1>{{ $t('news-overview--header') }}</h1>
      </div>
      <div class="news-overview--content">
        <div class="flex-container">
          <news-card v-for="newsItem in news" :key="newsItem.slug" :newsItem="newsItem" class="news-card" />
        </div>
      </div>
    </div>
  </news-service>
</template>

<script>
import NewsCard from '~/shared/components/News-Card';
import NewsService from '~/shared/services/News-Service';

export default {
  components: {
    'news-card': NewsCard,
    'news-service': NewsService
  },
  data () {
    return {
      tags: ['Social Media', 'Sand', 'Marine']
    };
  },
  computed: {
    challengeId () {
      return this.$route.params.id;
    }
  }
};
</script>

<style lang="scss" scoped>
.news-card {
  &:first-of-type {
    width: 100%;
  }
  margin-bottom: 50px;
}

.news-overview {
  &--header {
    display: flex;
    align-items: center;
    background-color: white;

    h1 {
      margin: 95px 0;
    }
  }

  &--content {
    position: relative;
    background-color: $color-gray-10;
    padding: 60px 0;

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
