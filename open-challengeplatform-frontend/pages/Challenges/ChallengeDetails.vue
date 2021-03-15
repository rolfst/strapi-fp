<template>
  <div class="challenge">
    <challenge-details-service :endpoint="`challenges/${slugId}`">
      <div slot-scope="{ challengeDetails: challengeDetails, getChallengeDetails: getChallengeDetails, likeChallenge: likeChallenge, favoriteChallenge: favoriteChallenge}">
        <challenge-edit-bar
          :slug="slugId"
          :challengeDetails="challengeDetails"
          :refresh="getChallengeDetails"
        />
        <update-challenge-service :endpoint="`challenges/${slugId}`">
          <div slot-scope="{ updateChallenge: updateChallenge }">
            <challenge-hero
              :company="challengeDetails.company"
              :like-challenge="likeChallenge"
              :favorite-challenge="favoriteChallenge"
              :details="challengeDetails"
              :update-detail-service="updateChallenge"
            />
          </div>
        </update-challenge-service>
        <div class="timeline">
          <div class="flex-container section-timeline">
            <challenge-timeline
              class="timeline--item"
              :stages="challengeDetails.stages"
              :time-elapsed="challengeDetails.timeElapsed"
              :start-date="challengeDetails.start_date"
              :end-date="challengeDetails.end_date"
            />
          </div>
        </div>
        <div class="challenge-intro flex-container">
          <div class="challenge-intro--content">
            <h2>{{ $t('challenge-detail--the-challenge') }}: {{ challengeDetails.title }}</h2>
            <div class="challenge-intro--content--vhtml" v-html="challengeDetails.body" />
            <h3>{{ $t('team') }}</h3>
            <contact-card class="contact" />
            <contact-card class="contact" />
            <contact-card class="contact" />
          </div>
          <div class="challenge-intro--company-card">
            <company-card :company="challengeDetails.company" />
            <button class="button secondary big" @click="scrollTo_comments">
              {{ $t('challenge-detail--go-to-comments') }}
            </button>
          </div>
        </div>
        <div class="challenge-intro--attachments">
          <div class="flex-container">
            <h2>{{ $t('attachments') }}</h2>
            <div v-if="challengeDetails.attachments">
              <attachment
                v-for="attachment in challengeDetails.attachments"
                :key="attachment._id"
                mode="download"
                :attachment="attachment"
              />
            </div>
            <div v-if="!challengeDetails.attachments">
              <p>{{ $t('challenge-detail--no-attachments') }}</p>
            </div>
          </div>
        </div>
        <div class="timeline">
          <div class="flex-container">
            <challenge-timeline
              class="timeline--item"
              :stages="challengeDetails.stages"
              :time-elapsed="challengeDetails.timeElapsed"
              :start-date="challengeDetails.start_date"
              :end-date="challengeDetails.end_date"
            />
          </div>
        </div>
      </div>
    </challenge-details-service>
    <reaction-service
      :scroll-to="scrollTo"
      :initial-reaction="$route.query.reaction"
      :endpoint="`/challenges/${slugId}/reactions`">
      <div
        slot-scope="{reactions: reactions, loadSubReactions: loadSubReactions, postReaction: postReaction, loadHighlightedReaction: loadHighlightedReaction, favoriteReaction: favoriteReaction, likeReaction: likeReaction, highlightReaction: highlightReaction, deleteReaction: deleteReaction, loading: loading}"
      >
        <reaction-service :endpoint="`/challenges/${slugId}/highlights`" :highlights="true">
          <div slot-scope="{reactions: highlightedReactions, loading: highlightedLoading}" class="flex-container highlighted-comments">
            <h2>{{ $t('challenge-detail--highlighted-comments') }}</h2>
            <spinner v-show="highlightedLoading" />
            <reaction-top
              v-for="reaction in highlightedReactions"
              :key="reaction._id"
              :reaction="reaction"
              class="margin-bottom"
              @click.native="handleClick_highlightedReaction(loadHighlightedReaction, reaction.full_slug, reaction._id)"
            />
          </div>
        </reaction-service>
        <div class="flex-container comments--header">
          <h2>{{ $t('challenge-detail--comments') }}</h2>
        </div>
        <div class="flex-container">
          <comment-input type="comment" :top="true" :post-reaction="postReaction" />
        </div>
        <spinner v-show="loading" />
        <reaction-top
          v-for="(reaction, key) in reactions"
          :id="reaction._id"
          :key="key"
          :reaction="reaction"
          :load-sub-reactions="loadSubReactions"
          :post-reaction="postReaction"
          :challenge-slug="slugId"
          :favorite-reaction="favoriteReaction"
          :like-reaction="likeReaction"
          :highlight-reaction="highlightReaction"
          :delete-reaction="deleteReaction"
          class="margin-bottom"
        />
        <div class="flex-container comments--load-more">
          <button class="button secondary">
            {{ $t('challenge-detail--comments--show-more') }}
          </button>
        </div>
      </div>
    </reaction-service>
    <news-service :endpoint="`/challenges/${slugId}/articles`">
      <div slot-scope="{ data: news }" class="news">
        <div class="flex-container">
          <h2>{{ $t('challenge-detail--news--header') }}</h2>
          <news-card
            v-for="(newsItem, key) in news"
            :key="key"
            :newsItem="newsItem"
          />
          <div class="news--more">
            <router-link :to="`${slugId}/news`">
              {{ $t('challenge-detail--news--more') }}
              <img
                src="~/assets/images/chevron_right.svg"
                class="icon"
                :alt="moreNewsImageAltText"
                :title="moreNewsImageAltText"
              >
            </router-link>
          </div>
        </div>
      </div>
    </news-service>
    <call-to-action
      :title="$t('home--call-to-action--header')"
      :description="$t('home--call-to-action--content')"
      :buttonone="$t('challenge-detail--call-to-action--button1')"
    />
  </div>
</template>

<script>
import ChallengeTimeline from './components/Challenge-Timeline';
import ChallengeHero from './components/Challenge-Hero';
import ChallengeEditBar from './components/Challenge-Edit-Bar';
import ContactCard from '~/shared/components/Contact-Card';
import ReactionTop from '~/shared/components/Reaction-Top';
import ReactionService from '~/shared/services/Reaction-Service';
import CompanyCard from '~/shared/components/Company-Card';
import NewsCard from '~/shared/components/News-Card';
import CallToAction from '~/shared/components/Call-To-Action';
import ChallengeDetailsService from '~/shared/services/ChallengeDetails-Service';
import CommentInput from '~/shared/components/Comment-Input';
import UpdateChallengeService from '~/shared/services/UpdateChallenge-Service';
import AttachmentChallenge from '~/shared/components/Attachment-Challenge';
import NewsService from '~/shared/services/News-Service';
import Spinner from '~/shared/components/Spinner';

export default {
  components: {
    'contact-card': ContactCard,
    'challenge-timeline': ChallengeTimeline,
    'challenge-hero': ChallengeHero,
    'reaction-top': ReactionTop,
    'reaction-service': ReactionService,
    'company-card': CompanyCard,
    'news-card': NewsCard,
    'call-to-action': CallToAction,
    'challenge-details-service': ChallengeDetailsService,
    'comment-input': CommentInput,
    'update-challenge-service': UpdateChallengeService,
    'attachment': AttachmentChallenge,
    'news-service': NewsService,
    'spinner': Spinner,
    'challenge-edit-bar': ChallengeEditBar
  },
  props: [
    'id'
  ],
  data () {
    return {
      showContent: false,
      // TODO: Validate if this code still works after removing the following line
      // challengeDetails: {},
      metaDetails: {},
      info: this.$store.getters.metaDetails,
      archiveChallengeButtonAltText: '',
      editChallengeButtonAltText: '',
      meetingIconAltText: '',
      moreNewsImageAltText: '',
      slugId: ''
    };
  },
  mounted () {
    this.translate();
  },
  created: function () {
    this.slugId = this.getSlugFromUrl();
  },
  methods: {
    toggleShow () {
      this.showContent = !this.showContent;
    },
    getSlugFromUrl () {
      return this.$route.params.id;
    },
    scrollTo_comments () {
      const el = document.querySelector('.highlighted-comments');
      el.scrollIntoView({ block: 'center' });
    },
    scrollTo (id) {
      const el = document.getElementById(id);
      setTimeout(() => {
        el.scrollIntoView({ block: 'center' });
      }, 500);
    },
    handleClick_highlightedReaction (func, fullSlug, scrollTo) {
      func(fullSlug, scrollTo).then((res) => {
        setTimeout(() => {
          this.scrollTo(scrollTo);
        }, 1000);
      });
    },
    editChallenge () {
      this.$store.commit('setEventSlug', this.slugId);
      this.$router.push('/editChallenge');
    },
    translate () {
      this.archiveChallengeButtonAltText = this.$i18n.t('challenge-detail--archive-challenge-button--alt-text');
      this.editChallengeButtonAltText = this.$i18n.t('challenge-detail--edit-challenge-button--alt-text');
      this.meetingIconAltText = this.$i18n.t('challenge-detail--meeting-icon--alt-text');
      this.moreNewsImageAltText = this.$i18n.t('challenge-detail--more-news-link--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.challenge {
  background-color: #f2f4f5;

  .margin-bottom {
    margin-bottom: 24px;
  }

  &-intro {
    &--attachments {
      .flex-container {
        flex-direction: column;
        margin-bottom: 0;
        margin-top: 0;
        padding-top: 0;
        padding-bottom: 1em;
      }
    }
  }

  .news {
    margin-top: 60px;
    padding-bottom: 60px;

    &--more {
      width: 100%;
      a {
        margin-top: 30px;
        text-align: center;
        text-transform: uppercase;
        color: #343434;
        font-family: $font-roboto-light;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    h2 {
      width: 100%;
    }
  }

  .big-timeline {
    padding-top: 60px;
    background-color: white;
    padding-bottom: 60px;
    &--timeline {
      margin-top: 40px;
    }
  }

  h2 {
    margin-left: 0;
  }

  &-intro {
    &--content {
      flex: 8;
      margin-right: 20px;

      &--vhtml {
        font-family: $font-roboto-light;
        font-size: 18px;
        color: $color-gray-80;
        line-height: 32px;
        font-weight: 300;
      }
    }

    &--company-card {
      flex: 4;
    }
  }

  .comments {
    &--header {
      margin-top: 60px;
      .button {
        width: auto;
        display: block;
        margin-top: 0.5em;
      }
    }

    &--load-more {
      &.flex-container {
        margin-bottom: 60px;
        justify-content: center;
        .button {
          width: auto;
        }
      }
    }
  }
  .icon {
    margin-right: 10px;
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
  .contact {
    display: inline-flex;
  }

  ul {
    li {
      font-size: 18px;
      color: $color-gray-80;
      line-height: 32px;
    }
  }

  .timeline {
    padding-top: 50px;
    background-color: white;
    align-items: center;
    margin-bottom: 60px;

    .flex-container .section-timeline{
        justify-content: flex-start;
      }
    &--item {
      align-self: center;
    }
    div {
      margin: 0 auto;
    }
  }
  .challenge-intro--company-card {
    .button {
    width: 100%;
    margin-top: 24px;
  }
  }
}
</style>
