<template>
  <div class="share _share">
    <div class="more-options" tabindex="0">
      <img
        src="~assets/images/reply.svg"
        class="more-options icon share--icon"
        :alt="moreOptionsIconAltText"
        :title="moreOptionsIconAltText"
      >
      <div class="more-options--options">
        <ul>
          <li>
            <button @click="openWindow('https://www.facebook.com/sharer/sharer.php?u=#url&t=Checkerinometeenlangestringzonderspaties', 'Facebook')">
              <img
                src="~assets/images/share/Facebook.svg"
                :alt="facebookIconAltText"
                :title="facebookIconAltText"
              >Facebook
            </button>
          </li>
          <li>
            <button @click="openWindow('https://twitter.com/intent/tweet?text=Creating+social+sharing+links+without+third-party+JavaScript&url=' + baseUrl + endpoint, 'Twitter')">
              <img
                src="~assets/images/share/Twitter.svg"
                :alt="twitterIconAltText"
                :title="twitterIconAltText"
              >Twitter
            </button>
          </li>
          <li>
            <a :href="`whatsapp://send?text=Share the link! ${baseUrl}${endpoint}`" data-action="share/whatsapp/share">
              <img
                src="~assets/images/share/Whatsapp.svg"
                :alt="whatsappIconAltText"
                :title="whatsappIconAltText"
              >Whatsapp
            </a>
          </li>
          <li>
            <a :href="`mailto:?body=Check out this link! ${baseUrl}${endpoint} &subject=thisbethesubject!`">
              <img
                src="~assets/images/share/Email.svg"
                :alt="emailIconAltText"
                :title="emailIconAltText"
              >Email
            </a>
          </li>
          <li>
            <button @click="copyToClipboard(baseUrl + endpoint)">
              <img
                src="~assets/images/share/Link.svg"
                :alt="linkIconAltText"
                :link="linkIconAltText"
              >{{ link }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    endpoint: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    summary: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      baseUrl: process.env.domain,
      facebookIconAltText: '',
      link: this.$i18n.t('link'),
      linkIconAltText: '',
      moreOptionsIconAltText: '',
      twitterIconAltText: '',
      whatsappIconAltText: ''
    };
  },
  mounted () {
    this.translate();
  },
  methods: {
    openWindow (url, title) {
      window.open(url, title, 'width=600,height=300');
    },
    copyToClipboard (text) {
      const dummy = document.createElement('textarea');
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      this.link = `${this.$i18n.t('copied-to-clipboard')}!`;
    },
    translate () {
      this.emailIconAltText = this.$i18n.t('share--email-icon--alt-text');
      this.facebookIconAltText = this.$i18n.t('share--facebook-icon--alt-text');
      this.linkIconAltText = this.$i18n.t('share--link-icon--alt-text');
      this.moreOptionsIconAltText = this.$i18n.t('share--more-options-icon--alt-text');
      this.twitterIconAltText = this.$i18n.t('share--twitter-icon--alt-text');
      this.whatsappIconAltText = this.$i18n.t('share--whatsapp-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.share {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;

  &--icon {
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
  }

  ul {
    li {
      display: flex;
      align-items: center;
      font-family: $font-roboto-regular;

      img {
        margin-right: 15px;
        height: 20px;
      }

      a, button {
        background: none;
        border: none;
        margin: 0;
        padding: 0;
        text-decoration: none;
        color: $color-gray-80;
        font-family: $font-roboto-regular;
        font-size: 18px;
        line-height: 32px;
        cursor: pointer;
      }
    }
  }
}
</style>
