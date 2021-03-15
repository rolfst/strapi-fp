<template>
  <div class="hero" :style="{backgroundColor: bgcolor}">
    <div class="flex-container">
      <div class="content">
        <h2 :style="{color: textcolor}">
          {{ title }}
        </h2>
        <p :style="{color: textcolor}">
          {{ description }}
        </p>
        <br>
        <div v-if="buttonone" class="link">
          {{ buttonone }}
          <img
            src="~/assets/images/chevron_right.svg"
            class="icon chevron-right"
            :alt="buttonOneIconAltText"
            :title="buttonOneIconAltText"
          >
        </div>
        <br>
        <div v-if="buttontwo" class="link">
          {{ buttontwo }}
          <img
            src="~/assets/images/chevron_right.svg"
            class="icon chevron-right"
            :alt="buttonTwoIconAltText"
            :title="buttonTwoIconAltText"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    buttonone: {
      type: String,
      default: null
    },
    buttontwo: {
      type: String,
      default: null
    },
    bgcolor: {
      type: String,
      default: 'white'
    },
    textcolor: {
      type: String,
      default: 'black'
    }
  },
  data () {
    return {
      buttonOneIconAltText: '',
      buttonTwoIconAltText: ''
    };
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.buttonOneIconAltText = this.$i18n.t('call-to-action--button-one-icon--alt-text');
      this.buttonTwoIconAltText = this.$i18n.t('call-to-action--button-two-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.hero {
  .link {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-roboto-light;
    text-transform: uppercase;
  }

  .flex-container {
    margin-bottom: 0;
    margin-top: 0;
  }

  .content {
      padding: 8em 0;
      margin: auto;
      text-align: center;
  }
}
</style>
