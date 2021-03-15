<template>
  <div class="likes">
    <div class="profile-container">
      <profile-picture v-if="likeAmount > 0" :big="false" class="profile-picture z-4" />
      <profile-picture v-if="likeAmount > 1" :big="false" class="profile-picture z-3" />
      <profile-picture v-if="likeAmount > 2" :big="false" class="profile-picture z-2" />
      <p v-if="likeAmount > 3">
        and <span class="_comment-other-like-count">{{ likeAmount - 3 }}</span> others
      </p>
    </div>
  </div>
</template>

<script>
import ProfilePicture from '~/shared/components/Profile-Picture';

export default {
  components: {
    'profile-picture': ProfilePicture
  },
  props: {
    likeAmount: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-container {
  margin-left: 8px;
  margin-top: 4px;
  display: flex;

  .profile-picture {
    margin-left: -20px;

    &:first-child {
      margin-left: 0;
    }
  }

  p {
    line-height: 15px;
  }

  .extra-count {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: $color-gray-30;
    border: 4px solid white;
    top: 0;
    text-align: center;
    line-height: 40px;
    font-family: $font-roboto-light;
    color: white;
  }

  .z-1 {
    z-index: 1 !important;
  }

  .z-2 {
    z-index: 2 !important;
  }

  .z-3 {
    z-index: 3 !important;
  }

  .z-4 {
    z-index: 4 !important;
  }
}
</style>
