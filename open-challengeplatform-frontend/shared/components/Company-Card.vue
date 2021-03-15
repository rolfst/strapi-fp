<template>
  <div class="company-card">
    <div class="company-card--logo">
      <img
        :src="companyLogo"
        :alt="companyLogoAltText"
        :title="companyLogoAltText"
      >
    </div>
    <div class="company-card--content">
      <h3 id="_corporate-title">
        {{ companyName }}
      </h3>
      <p id="_corporate-description">
        {{ companyDescription }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    company: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      companyLogoAltText: ''
    };
  },
  computed: {
    companyName () {
      if (this.company) {
        return this.company.name;
      }
      return 'Company name';
    },
    companyDescription () {
      if (this.company) {
        return this.company.description;
      }
      return 'Company Description';
    },
    companyLogo () {
      if (this.company && this.company.logo) {
        return process.env.restApi + this.company.logo.url;
      }
      return 'logo';
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.companyLogoAltText = this.$i18n.t('company-card--logo--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.company-card {
  box-shadow: 0 2px 4px 0 rgba(226,226,226,0.5);
  border-radius: 2px;
  background-color: white;

  &--header {
    img {
      width: 100%;
      border-radius: 2px 2px 0 0;
    }
  }

  &--logo {
    padding-top: 32px;
    display: flex;

    img {
      width: 50%;
      opacity: 0.6;
      align-self: center;
      margin: auto;
    }
  }

  &--content {
    padding: 20px;

    h3 {
      text-align: center;
    }
  }
}
</style>
