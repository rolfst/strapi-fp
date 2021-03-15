<template>
  <div>
    <img
      :src="profilePictureUrl"
      :class="'profile-picture ' + [big ? 'big ' : 'small '] + [isMod ? 'moderator' : 'user']"
      :alt="profilePictureAltText"
      :title="profilePictureAltText"
    >
  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: Object,
      default: null
    },
    big: {
      type: Boolean,
      default: true
    },
    isMod: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      profilePictureAltText: ''
    };
  },
  computed: {
    profilePictureUrl () {
      return (this.$props.img) ? process.env.restApi + this.$props.img.url : '/images/avatar_default.svg';
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.profilePictureAltText = this.$i18n.t('profile--picture--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-picture {
  border-radius: 50%;

  &.user {
    border: 4px solid white;
  }

  &.moderator {
    border: 4px solid $color-primary-purple;
  }

  &.small {
    height: 40px;
    width: 40px;
  }

  &.big {
    height: 66px;
    width: 66px;
  }
}
</style>
