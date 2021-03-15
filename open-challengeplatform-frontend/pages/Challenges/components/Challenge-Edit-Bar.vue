<template>
  <moderation-service :endpoint="`challenges/${slug}`">
    <div slot-scope="{ archiveChallenge: archiveChallenge, publishChallenge: publishChallenge, unpublishChallenge: unpublishChallenge}" class="edit-bar">
      <div class="edit-bar--content">
        <div class="edit-bar--content-left">
          <div>
            <button @click="toggleParticipantsList()" class="button">
              <img class="icon purple" src="~/assets/images/meeting.svg" :title="closeIconAltText" :alt="closeIconAltText">{{ $t('challenge-detail--moderation--participants') }}
            </button>
          </div>
        </div>
        <div class="edit-bar--content-right">
          <button class="button primary" @click="editChallenge()">
            <img class="icon white" src="~/assets/images/edit.svg">{{ $t('challenge-detail--moderation--edit') }}
          </button>
          <button v-if="!(challengeDetails.status === 'archived')" class="button primary" @click="(challengeDetails.status === 'published') ? unpublishChallenge(refresh) : publishChallenge(refresh)">
            <img class="icon white" src="~/assets/images/publish.svg"> {{ (challengeDetails.status === 'published') ? $t('challenge-detail--moderation--unpublish') : $t('challenge-detail--moderation--publish') }}
          </button>
          <button class="button primary" @click="archiveChallenge(refresh)">
            <img class="icon white" src="~/assets/images/archive.svg">{{ (challengeDetails.status === 'archived') ? $t('challenge-detail--moderation--archived') : $t('challenge-detail--moderation--archive') }}
          </button>
        </div>
      </div>
      <participant-list v-if="participantsVisible" :toggle="toggleParticipantsList" :challengeSlug="slug" />
    </div>
  </moderation-service>
</template>

<script>
import ParticipantList from './Participant-List';
import ModerationService from '~/shared/services/Moderation-Service';

export default {
  components: {
    'moderation-service': ModerationService,
    'participant-list': ParticipantList
  },
  props: {
    refresh: {
      type: Function,
      default: null
    },
    slug: {
      type: String,
      default: null
    },
    challengeDetails: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      participantsVisible: false,
      closeIconAltText: ''
    };
  },
  methods: {
    editChallenge () {
      this.$store.commit('setEventSlug', this.slug);
      this.$router.push('/editChallenge');
    },
    toggleParticipantsList () {
      this.participantsVisible = !this.participantsVisible;
    },
    translate () {
      this.closeIconAltText = this.$i18n.t('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  min-height: 67px;
  background-color: white;
  box-shadow: 0 -4px 6px 0 rgba(190,190,190,0.2), 0 -1px 3px 0 rgba(190,190,190,0.2);
  z-index: 100;
}

.edit-bar--content {
  max-width: 1000px;
  margin: 0 auto;
  justify-content: flex-start;
  display: flex;
  margin-top: 15px;

  .button {
    display: flex;
    align-items: center;
  }
}

.edit-bar--content-left{
  flex: 1;
  display: flex;
  justify-content: flex-start;
}
.edit-bar--content-right{
  flex: 1;
  display: flex;
  justify-content: flex-end;

  .button {
    margin-right: 0;
    margin-left: 16px;
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
</style>
