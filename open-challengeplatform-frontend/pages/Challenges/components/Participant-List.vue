<template>
  <div class="overlay">
    <participant-service :endpoint="`/challenges/${challengeSlug}/participants`">
      <div slot-scope="{ data: participants }" class="participant-list">
        <button class="participant-list--close-button" @click="toggle()">
          <img src="~/assets/images/close.svg" alt="" class="icon close">
        </button>
        <h1>
          {{ $t('challenge-detail--moderation--participant-list--header') }}
        </h1>
        <p>
          {{ $t('challenge-detail--moderation--participant-list--paragraph-1') }}
        </p>
        <div class="participants">
          <div v-for="participant in participants" :key="participant._id" class="participant">
            <profile-picture :img="participant.profilePicture" />
            <p class="participant--name">
              {{ participant.name }}
            </p>
            <button class="button secondary participant--button">
              {{ $t('select') }}
            </button>
          </div>
        </div>
      </div>
    </participant-service>
  </div>
</template>

<script>
import ParticipantService from '~/shared/services/Participant-Service';
import ProfilePicture from '~/shared/components/Profile-Picture';

export default {
  components: {
    'participant-service': ParticipantService,
    'profile-picture': ProfilePicture
  },
  props: {
    toggle: {
      type: Function,
      default: null
    },
    challengeSlug: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.3);

  .participant-list {
    position: relative;
    height: 80%;
    width: calc(1000px - 170px);
    border-radius: 4px;
    background-color: $color-white;
    padding: 60px 85px;

    &--close-button {
      position: absolute;
      right: 30px;
      top: 30px;
      background: unset;
      border: unset;
    }

    .participants {
      .participant {
        display: flex;
        flex-direction: row;
        align-items: center;

        &--name {
          margin-left: 60px;
        }

        &--button {
          margin-left: auto;
        }
      }
    }
  }
}
</style>
