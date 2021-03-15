<template>
  <div>
    <div class="error-message">
      <div class="flex-container">
        <div class="notfound-image svg-blue">
          <img
            src="~/assets/images/sad.svg"
            class="image"
            :alt="notFoundImageAltText"
            :title="notFoundImageAltText"
          >
        </div>
        <div class="notfound-description">
          <h1>{{ $t('error--not-found--title') }}</h1>
          <h2>{{ $t('error--not-found--subtitle') }}</h2>
          <button class="button primary" @click="handleClick_navigateHome()">
            {{ $t('error--not-found--back-button') }}
          </button>
        </div>
      </div>
    </div>
    <div class="helpful-links">
      <div class="flex-container">
        <div>
          <h2>{{ $t('error--helpful-links--title') }}</h2>
          <div class="links">
            <h3>{{ $t('error--helpful-links--subtitle') }}</h3>
            <ul>
              <li>
                <router-link to="/home">
                  {{ $t('error--helpful-links--home') }}
                </router-link>
              </li>
              <li>
                <router-link to="/search">
                  {{ $t('error--helpful-links--search') }}
                </router-link>
              </li>
              <li>
                <router-link to="/challenges">
                  {{ $t('error--helpful-links--challenges') }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      notFoundImageAltText: ''
    };
  },
  mounted () {
    this.translate();
  },
  methods: {
    handleClick_navigateHome () {
      this.$router.push('/home');
    },
    translate () {
      this.notFoundImageAltText = this.$i18n.t('error--not-found--image');
    }
  }
};
</script>

<style lang="scss" scoped>
.error-message {
  padding: 120px 0 120px 0;
}

.helpful-links {
  background-color: #f2f4f5;
  padding: 120px 0 120px 0;

  &.flex-container {
    & h3 {
      padding-top: 24px;
    }
  }
}

.links {
  padding-top: 24px;

  ul {
    list-style: none;
    padding-left: 0;
  }
}

.notfound-image {
  flex: 3;
}

.notfound-description {
  flex: 7;
}

.image {
  width: 235px;
  height: 235px;
}

.svg-blue {
  filter: invert(21%) sepia(39%) saturate(2584%) hue-rotate(166deg)
    brightness(99%) contrast(102%);
}
</style>
