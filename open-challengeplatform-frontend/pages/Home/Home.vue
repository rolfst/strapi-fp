<template>
  <div class="home">
    <hero :title="$t('home--hero--title')" :description="$t('home--hero--subtitle')" />
    <div class="scrolling-challenges flex-container">
      <challenge-service endpoint="challenges" :amount="3">
        <div slot-scope="{ data: challenges, loading: loading }" class="fullwidth">
          <h2>{{ $t('home--showcase--challenges') }}</h2>
          <div class="challenge-container">
            <div v-for="challenge in challenges" :key="challenge.id">
              <challenge-card :challenge="challenge" :stats="true" @click.native="handleCardClick(challenge.slug)" />
            </div>
          </div>
          <spinner v-if="loading" />
          <div class="call-to-action">
            <router-link to="/challenges" class="call-to-action--chevron">
              {{ $t('home--showcase--see-all') }}
              <img
                src="~assets/images/chevron_right.svg"
                class="icon chevron-right"
                :alt="showcaseSeeAllIconAltText"
                :title="showcaseSeeAllIconAltText"
              >
            </router-link>
          </div>
        </div>
      </challenge-service>
    </div>
    <div class="story">
      <div class="flex-container">
        <h2>
          {{ $t('home--story--header') }}
        </h2>
        <h3>{{ $t('home--story--subheader-1') }}</h3>
        <p>{{ $t('home--story--subheader-1--description') }}</p>
        <h3>{{ $t('home--story--subheader-2') }}</h3>
        <p>{{ $t('home--story--subheader-2--description') }}</p>
      </div>
    </div>
    <div class="what-for-you flex-container">
      <h2>
        {{ $t('home--what-for-you--header') }}
      </h2>
      <div class="what-for-you--item">
        <img
          src="~/assets/images/search_content.svg"
          :alt="searchContentIconAltText"
          :title="searchContentIconAltText"
        >
        <h3>{{ $t('home--what-for-you--item-1--header') }}</h3>
        <p>{{ $t('home--what-for-you--item-1--content') }}</p>
      </div>
      <div class="what-for-you--item">
        <img
          src="~/assets/images/handshake.svg"
          :alt="handshakeIconAltText"
          :title="handshakeIconAltText"
        >
        <h3>{{ $t('home--what-for-you--item-2--header') }}</h3>
        <p>{{ $t('home--what-for-you--item-2--content') }}</p>
      </div>
      <div class="what-for-you--item">
        <img
          src="~/assets/images/talk.svg"
          :alt="talkIconAltText"
          :title="talkIconAltText"
        >
        <h3>{{ $t('home--what-for-you--item-3--header') }}</h3>
        <p>{{ $t('home--what-for-you--item-3--content') }}</p>
      </div>
    </div>
    <div class="interesting-tags">
      <div class="flex-container">
        <h2>{{ $t('home--tags--header') }}</h2>
        <tags-service endpoint="tags" :limit="20">
          <div slot-scope="{ tags: tags, loading: loading }">
            <spinner v-if="loading" />
            <div class="tag-container">
              <tag v-for="tag in tags" :key="tag._id" class="tag">
                {{ tag.title }}
              </tag>
            </div>
          </div>
        </tags-service>
      </div>
    </div>
    <reaction-service endpoint="reactions" :amount="2">
      <div slot-scope="{reactions: reactions, loading: loading}" class="latest-comments flex-container">
        <h2>{{ $t('home--latest-comments--header') }}</h2>
        <spinner v-show="loading" />
        <div v-if="reactions" class="fullwidth">
          <div v-for="(reaction, key) in reactions" :key="key">
            <challenge-details-service :endpoint="'challenges/' + reaction.challenge_slug">
              <div slot-scope="{ challengeDetails: challengeDetails }">
                <reaction-header :title="challengeDetails.title" :details="challengeDetails" />
              </div>
            </challenge-details-service>
            <reaction-top :reaction="reaction" />
          </div>
        </div>
      </div>
    </reaction-service>
    <testimonials-service endpoint="/articles" :limit="1">
      <div slot-scope="{ data: testimonials }">
        <success-story v-for="testimonial in testimonials" :key="testimonial.slug" :content="testimonial" class="success-story" />
        <div class="call-to-action success">
          <router-link to="/testimonials" class="call-to-action--chevron">
            {{ $t('home--see-more-success-stories') }}
            <img
              src="~assets/images/chevron_right.svg"
              class="icon chevron-right"
              :alt="moreSuccessStoriesIconAltText"
              :title="moreSuccessStoriesIconAltText"
            >
          </router-link>
        </div>
      </div>
    </testimonials-service>
    <company-service endpoint="/companies" limit="6">
      <div slot-scope="{data: companies, loading: loading}" class="company-showcase">
        <div class="flex-container">
          <h2>
            {{ $t('home--participating-corporates') }}
          </h2>
          <spinner v-show="loading" />
          <div v-for="(company, key) in companies" :key="key" class="company-showcase--item">
            <img
              src="~assets/images/KLM.svg"
              class="svg-gray"
              :alt="klmIconAltText"
              :title="klmIconAltText"
            >
          </div>
        </div>
      </div>
    </company-service>
    <call-to-action
      class="call-to-action-bottom"
      :title="$t('home--call-to-action--header')"
      :description="$t('home--call-to-action--content')"
      :buttonone="$t('home--call-to-action--button1')"
      :buttontwo="$t('home--call-to-action--button2')"
      bgcolor="white"
      textcolor="#323232"
    />
  </div>
</template>

<script>
import Hero from '../../shared/components/Hero';
import Tag from '../../shared/components/Tag';
import ChallengeCard from '../../shared/components/Challenge-Card';
import ReactionHeader from './components/Reaction-Header';
import ReactionTop from '~/shared/components/Reaction-Top';
import SuccessStory from '~/shared/components/Success-Story';
import CallToAction from '~/shared/components/Call-To-Action';
import TagsService from '~/shared/services/Tags-Service';
import ChallengeService from '~/shared/services/Challenge-Service';
import ReactionService from '~/shared/services/Reaction-Service';
import ChallengeDetailsService from '~/shared/services/ChallengeDetails-Service';
import Spinner from '~/shared/components/Spinner';
import TestimonialsService from '~/shared/services/Testimonials-Service';
import CompanyService from '~/shared/services/Company-Service';

export default {
  components: {
    'hero': Hero,
    'tag': Tag,
    'reaction-top': ReactionTop,
    'success-story': SuccessStory,
    'call-to-action': CallToAction,
    'tags-service': TagsService,
    'challenge-service': ChallengeService,
    'challenge-card': ChallengeCard,
    'reaction-service': ReactionService,
    'challenge-details-service': ChallengeDetailsService,
    'reaction-header': ReactionHeader,
    'spinner': Spinner,
    'testimonials-service': TestimonialsService,
    'company-service': CompanyService
  },
  data () {
    return {
      newsItems: [
        {
          title: 'How can we entertain people during their flight',
          datetime: '10/02/2019 16:30',
          summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lacinia enim urna, vitae luctus elit consectetur maximus. Ut sagittis interdum orci, non volutpat ligula finibus a. Proin tortor magna, accumsan vel quam ac, ullamcorper rutrum magna. Phasellus pharetra volutpat ex, non tincidunt dui. Donec eu faucibus dolor, eget vulputate massa. Proin nec interdum enim, nonada…'
        },
        {
          title: 'Loyalty points for being eco-friendly',
          datetime: '10/02/2019 16:30',
          summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lacinia enim urna, vitae luctus elit consectetur maximus. Ut sagittis interdum orci, non volutpat ligula finibus a. Proin tortor magna, accumsan vel quam ac, ullamcorper rutrum magna. Phasellus pharetra volutpat ex, non tincidunt dui. Donec eu faucibus dolor, eget vulputate massa. Proin nec interdum enim, nonada…'
        }
      ],
      tags: ['3D printing', 'Action chip', 'CRM', 'Cybersecurity', 'Data', 'E-commerce', 'ERP', 'IoT', 'Platforms', 'Social Media'],
      handshakeIconAltText: '',
      klmIconAltText: '',
      moreSuccessStoriesIconAltText: '',
      searchContentIconAltText: '',
      showcaseSeeAllIconAltText: '',
      talkIconAltText: ''
    };
  },
  beforeMount () {
    if (process.browser) {
      if (localStorage.getItem('firstTime')) {
        this.firstTime = (localStorage.getItem('firstTime'));
      }
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    handleCardClick (slug) {
      this.$router.push(`/challenges/${slug}`);
    },
    translate () {
      this.handshakeIconAltText = this.$i18n.t('home--handshake-icon--alt-text');
      this.klmIconAltText = this.$i18n.t('home--klm-icon--alt-text');
      this.moreSuccessStoriesIconAltText = this.$i18n.t('home--more-success-stories-icon--alt-text');
      this.searchContentIconAltText = this.$i18n.t('home--search-content-icon--alt-text');
      this.showcaseSeeAllIconAltText = this.$i18n.t('home--showcase--see-all-icon--alt-text');
      this.talkIconAltText = this.$i18n.t('home--talk-icon--alt-text');
    }
  }
};
</script>

<style scoped lang="scss">
.fullwidth {
  width: 100%;
}

.scrolling-challenges {
  margin-top: 60px;

  .challenge-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    margin-top: 30px;
  }
}

.call-to-action {
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
  justify-items: center;

  a {
    display: flex;
    align-items: center;
    font-family: $font-roboto-regular;
    color: $color-gray-80;
    text-decoration: none;

    .icon {
      margin-left: 16px;
    }
  }
}

::-webkit-scrollbar {
  display: none;
}

.success {
  margin-bottom: 60px;
}

.home {
  background-color: #f2f4f5;

  h2 {
    width: 100%;
  }

  .story {
    background: white;
    padding: 60px 0;
  }

  .interesting-tags {
    background: $color-primary-petrol;
    margin-top: 120px;

    h2 {
      color: white;
      width: 100%;
      margin-top: 120px;
      margin-bottom: 32px;
    }

    .tag-container {
      margin-bottom: 120px;

      .tag {
        display: inline-block;
        margin-bottom: 16px;
        margin-right: 16px;
      }
    }
  }

  .latest-comments {
    margin-top: 120px;

    h2 {
      width: 100%;
    }
  }

  .success-story {
    margin-top: 120px;
  }

  .what-for-you {
    margin-bottom: 60px;
    margin-top: 60px;

    &--item {
      flex: 1;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .company-showcase {
    width: 100%;
    background-color: white;

    h2 {
      margin-top: 120px;
      margin-bottom: 30px;
    }

    .flex-container {
      padding-bottom: 120px;
      margin-bottom: 0;
    }

    &--item {
      flex: 1;
      margin-right: 20px;
      height: 150px;
      width: 150px;
      text-align: center;

      img {
        padding: 50px;
        height: 50px;
        width: 50px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .svg-gray {
    opacity: 0.6;
  }
}
</style>
