<template>
  <testimonials-service :endpoint="`/articles`">
    <div slot-scope="{ data: testimonials }" class="testimonials-overview">
      <div class="news-overview--header flex-container">
        <h1>Testemonials</h1>
      </div>
      <div class="news-overview--content">
        <div class="flex-container">
          <news-card v-for="testimonial in testimonials" :key="testimonial.slug" :newsItem="testimonial" :testimonial="true" class="news-card" />
        </div>
      </div>
    </div>
  </testimonials-service>
</template>

<script>
import NewsCard from '~/shared/components/News-Card';
import TestimonialsService from '~/shared/services/Testimonials-Service';

export default {
  components: {
    'news-card': NewsCard,
    'testimonials-service': TestimonialsService
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
