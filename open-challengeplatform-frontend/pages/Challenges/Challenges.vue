<template>
  <div class="challenges-page">
    <h1 class="page-title">
      {{ $t('challenges') }}
    </h1>
    <div class="flex-container filter-button" @click="toggleShowFilter()">
      <img
        src="../../assets/images/filter-icon.svg"
        class="icon"
        :alt="showFilterImageAltText"
        :title="showFilterImageAltText"
      >
    </div>
    <div class="flex-container filter-bar">
      <div :class="['hide-filter', showFilter ? 'show-filter' : '']">
        <ChallengeFilter @challenge-status-filter="setStatusFilter" @challenge-type-filter="setTypeFilter" />
      </div>
      <button id="new-challenge" class="button primary" @click="openNewChallenge()">
        {{ $t('challenges--new-challenge') }}
      </button>
    </div>
    <div class="challenge-list">
      <div>
        <ChallengeService endpoint="challenges" :challenge-status="statusCriteria" :challenge-type="typeCriteria" :subject-filter="tags">
          <div slot-scope="{ data: challenges, loadAllChallenges: loadAllChallenges }">
            <div class="flex-container result-details">
              <h4>
                {{ challenges.size || challenges.length }} {{ ( challenges.length === 1 || challenges.size === 1) ? $t('challenge') : $t('challenges') }}
              </h4>
            </div>
            <div class="flex-container tags-filter">
              <TagsFilter @subject-filter-array="setSubjectFilter" />
            </div>
            <div class="flex-container">
              <div v-for="challenge in challenges" :key="challenge.id">
                <ChallengeCard :stats="true" :timeline="true" :challenge="challenge" @click.native="handleCardClick(challenge.slug)" />
              </div>
              <InfiniteScroll @trigger="loadAllChallenges" />
            </div>
          </div>
        </ChallengeService>
      </div>
    </div>
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
import ChallengeCard from '../../shared/components/Challenge-Card';
import ChallengeService from '../../shared/services/Challenge-Service';
import InfiniteScroll from '../../shared/utils/Infinite-Scroll';
import ChallengeFilter from './components/Challenge-Filter';
import TagsFilter from './components/Tags-Filter';
import CallToAction from '~/shared/components/Call-To-Action';

export default {
  components: {
    ChallengeCard,
    ChallengeService,
    InfiniteScroll,
    TagsFilter,
    ChallengeFilter,
    'call-to-action': CallToAction
  },
  data () {
    return {
      tags: [],
      showFilter: false,
      showFilterImageAltText: '',
      statusCriteria: 'current',
      typeCriteria: 'all'
    };
  },
  mounted () {
    this.translate();
  },
  methods: {
    setStatusFilter (data) {
      this.statusCriteria = data;
    },
    setTypeFilter (data) {
      this.typeCriteria = data;
    },
    setSubjectFilter (data) {
      let tags = '';
      this.tags = data;
      tags = data.join(',');
      this.$router.push({ path: '/challenges', query: { tags: tags } });
    },
    toggleSubjectFilter () {
      this.subjectFilterHidden = !this.subjectFilterHidden;
    },
    toggleCreateChallengeModal () {
      this.challengeModalHidden = !this.challengeModalHidden;
    },
    handleCardClick (slug) {
      this.$router.push(`/challenges/${slug}`);
    },
    openNewChallenge () {
      if (process.env.secureEnvironment) {
        this.$router.push('/createChallenge');
      } else {
        window.open(process.env.redirectUrl, '_self');
      }
    },
    toggleShowFilter () {
      this.showFilter = !this.showFilter;
    },
    translate () {
      this.showFilterImageAltText = this.$i18n.t('challenges--show-filter-image--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.page-title {
  padding-top: 156px;
  max-width: 1000px;
  margin: 0 auto;
}

.challenge-list {
  background-color: $color-custom-gray-1;
  padding-bottom: 120px;
}

.call-to-action {
  text-align: center;
  padding: 120px 0 136px 0px;
}

.challenges {
  display: flex;
  flex-wrap: wrap;
}

.result-details {
  margin-bottom: 0;
  padding-top: 10px;
}

.filter-bar {
  flex-direction: space-between;
  align-items: center;
  margin-top: 27px;
  margin-bottom: 27px;
}

@media screen and (max-width:960px) {
  #new-challenge {
    display: none;
  }

  .filter-bar {
    flex-direction: column;
  }

  .hide-filter {
    display: none;
  }

  .filter-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 100%;
    box-shadow: 0 2px 4px 0 #bebebe;
    cursor: pointer;
  }
  .tags-filter {
    justify-content: center;
  }
}

@media (min-width:961px) {
  .filter-button {
    display: none;
  }
}

.show-filter {
  display: flex;
}
</style>
