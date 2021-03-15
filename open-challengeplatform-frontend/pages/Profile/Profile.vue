<template>
  <profile-service endpoint="users">
    <div slot-scope="{ data: user, addTag: addTag, removeTag: removeTag, uploadProfilePicture: uploadProfilePicture, profilePictureUrl: profilePictureUrl }" class="profile-page">
      <div class="name flex-container">
        <h1 class="profile-page--name">
          {{ user.name }}
        </h1>
      </div>
      <div class="profile-page--personal-data">
        <div class="flex-container">
          <img
            :src="profilePictureUrl"
            class="profile-page--personal-data--profile-picture"
            :alt="profilePictureAltText"
            :title="profilePictureAltText"
            @click="handleClick_uploadProfile($event, uploadProfilePicture)"
          >
          <h3>{{ $t('profile-page--email-address') }}</h3>
          <p>{{ user.email }}</p>
          <h3>{{ $t('profile-page--phone-number') }}</h3>
          <p>{{ user.phonenumber }}</p>
          <h3>{{ $t('profile-page--subjects') }}</h3>
          <tags-filter :profile="true" :initial="user.tags" @add-tag="addTag" @remove-tag="removeTag" />
        </div>
      </div>
      <reaction-service :favorites="true" endpoint="">
        <div slot-scope="{reactions: reactions}" class="profile-page--favorited-reactions flex-container">
          <h1>{{ $t('profile-page--favorite-comments') }}</h1>
          <div v-for="reaction in reactions" :key="reaction.slug" class="profile-page--favorited-reactions--reaction-container">
            <challenge-details-service :endpoint="'challenges/' + reaction.challenge_slug">
              <div slot-scope="{ challengeDetails: challengeDetails }">
                <reaction-header :title="challengeDetails.title" :details="challengeDetails" />
              </div>
            </challenge-details-service>
            <reaction-top :reaction="reaction" class="profile-page--favorited-reactions--reaction" />
          </div>
        </div>
      </reaction-service>
    </div>
  </profile-service>
</template>

<script>
import TagsFilter from '../Challenges/components/Tags-Filter';
import ProfileService from '~/shared/services/Profile-Service';
import ReactionService from '~/shared/services/Reaction-Service';
import ReactionTop from '~/shared/components/Reaction-Top';
import ChallengeDetailsService from '~/shared/services/ChallengeDetails-Service';
import ReactionHeader from '~/pages/Home/components/Reaction-Header';

export default {
  components: {
    'tags-filter': TagsFilter,
    'profile-service': ProfileService,
    'reaction-service': ReactionService,
    'reaction-top': ReactionTop,
    'challenge-details-service': ChallengeDetailsService,
    'reaction-header': ReactionHeader
  },
  data () {
    return {
      challengeFilters: [],
      reactionFilters: [],
      profilePictureAltText: ''
    };
  },
  mounted () {
    this.translate();
  },
  methods: {
    handleClick_uploadProfile (ev, uploadProfilePicture) {
      let el = window._protected_reference = document.createElement('INPUT');
      el.type = 'file';
      el.accept = 'image/*';
      // cancel will not trigger 'change'
      el.addEventListener('change', function (ev2) {
        // access el.files[] to do something with it (test its length!)
        new Promise(function (resolve) {
          if (el.files[0]) {
            uploadProfilePicture(el.files[0]);
          }
        }).then(function () {
          // clear / free reference
          el = window._protected_reference = undefined;
        });
      });
      el.click(); // open
    },
    translate () {
      this.profilePictureAltText = this.$i18n.t('profile--picture--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-page {
  margin-top: 100px;

  &--favorited-reactions {
    h1 {
      margin: 60px 0;
    }

    &.flex-container {
      margin: 0 auto;
    }

    &--reaction {
      margin-bottom: 30px;
    }

    &--reaction-container {
      width: 100%;
    }
  }

  &--name {
    margin-top: 90px;
    width: 100%;
  }

  &--personal-data {
    width: 100%;
    margin-top: 96px;
    background-color: #f2f4f5;

    .flex-container {
      justify-content: flex-start;
      margin-bottom: 0;
      margin-top: 0;
      flex-direction: column;
    }

    &--profile-picture {
      margin-top: -75px;
      margin-bottom: 60px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-color: #F2F4F5;
    }
  }

  &--my-challenges {
    h1 {
      width: 100%;
    }
  }

  &--my-reactions {
    h1 {
      width: 100%;
    }
  }

  .status-filter {
    margin: unset;
  }
}
</style>
