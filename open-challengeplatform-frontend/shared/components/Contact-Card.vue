<template>
  <div class="contact-card">
    <div class="contact-card--image">
      <img
        src="~assets/images/profile_img_contact.jpeg"
        :alt="profileImageAltText"
        :title="profileImageAltText"
      >
      <div :class="'contact-card--image--kvk-banner' + [isKvk ? '' : 'hide']">
        KVK
      </div>
    </div>
    <div class="contact-card--content">
      <div class="contact-card--content--contact-info">
        <h3>{{ $t('contact-card--contact-name') }}</h3>
        <span class="contact-title">{{ $t('contact-card--contact-title') }}</span>
      </div>
      <div class="contact-card--content--contact-actions">
        <div class="call">
          <img
            src="~assets/images/phone.svg"
            class="icon"
            :alt="phoneIconAltText"
            :title="phoneIconAltText"
          >
        </div>
        <div class="mail">
          <img
            src="~assets/images/email.svg"
            class="icon"
            :alt="emailIconAltText"
            :title="emailIconAltText"
          >
        </div>
        <div class="message">
          <img
            src="~assets/images/chat_bubble.svg"
            class="icon"
            :alt="chatIconAltText"
            :title="chatIconAltText"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'isKvk'
  ],
  data () {
    return {
      chatIconAltText: '',
      emailIconAltText: '',
      phoneIconAltText: '',
      profileImageAltText: ''
    };
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.chatIconAltText = this.$i18n.t('contact-card--chat-icon--alt-text');
      this.emailIconAltText = this.$i18n.t('contact-card--email-icon--alt-text');
      this.phoneIconAltText = this.$i18n.t('contact-card--phone-icon--alt-text');
      this.profileImageAltText = this.$i18n.t('contact-card--profile-image--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
  .contact-card {
    display: flex;
    width: 320px;
    height: 126px;
    margin-top: 20px;
    box-shadow: 0 1px 3px 0 rgba(190,190,190,0.2), 0 4px 6px 0 rgba(190,190,190,0.2);
    margin-right: 9px;
    border-radius: 4px;

    &:nth-child(even) {
        margin-right: 0;
    }

    &--image {
      height: 100%;
      flex: 1;
      width: 85px;
      overflow: hidden;
      border-radius: 4px 0 0 4px;

      img {
        margin-left: -25px;
        align-self: center;
        height: 100%;
      }

      &--kvk-banner {
        position: relative;
        bottom: 0;
        height: 24px;
        margin-top: -28px;
        text-align: center;
        color: white;
        font-family: $font-roboto-light;
        font-size: 12px;
        line-height: 24px;
        background-color: $color-primary-purple;
      }
    }

    &--content {
      display: flex;
      flex-direction: column;
      flex: 3;
      justify-content: space-between;
      background-color: white;
      border-radius: 0 4px 4px 0;

      &--contact-info {
        flex: 1;
        padding: 18px 18px 0 18px;
      }

      &--contact-actions {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex: 1;
      }

      img {
        margin: 15px 21px;
        filter: invert(16%) sepia(0%) saturate(0%) hue-rotate(141deg) brightness(108%) contrast(90%);
      }
    }

    .contact-title {
      font-family: $font-roboto-light;
      color: $color-gray-80;
      font-size: 13px;
    }

    .hide {
      display: none;
    }
  }
</style>
