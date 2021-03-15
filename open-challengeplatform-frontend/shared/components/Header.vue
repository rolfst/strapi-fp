<template>
  <div class="header-wrapper">
    <div class="gradient-line" />
    <div class="top-header">
      <div class="flex-container">
        <div>
          <a href="https://www.kvk.nl" target="_blank" class="go-to-kvk">
            <img
              src="~assets/images/launch.svg"
              alt=""
              title=""
            >
            {{ $t('header--kvk-link') }}
          </a>
        </div>
        <div class="service-link">
          <img
            src="~assets/images/forum.svg"
            alt=""
          >
          Service & contact
        </div>
        <div class="language-switcher">
          <span
            :class="'language-switcher--lang ' + [this.$i18n.locale == 'en' ? 'active' : '']"
            @click="handleClick_locale('en')"
          >EN</span>
          <span class="language-switcher--lang">/</span>
          <span
            :class="'language-switcher--lang ' + [this.$i18n.locale == 'nl' ? 'active' : '']"
            @click="handleClick_locale('nl')"
          >NL</span>
        </div>
      </div>
    </div>
    <div class="header-sub flex-container">
      <div class="header-sub--logo-container">
        <router-link to="/">
          <img
            src="../../assets/images/kvk_logo_mail.svg"
            class="logo"
            alt=""
            title=""
          >
          <div class="subsite">
            Business Challenge
          </div>
        </router-link>
      </div>
      <div class="header-sub--links-container">
        <router-link class="link--challenges" to="/challenges">
          {{ $t('header--challenges') }}
        </router-link>
        <router-link class="link--about" to="/about">
          {{ $t('header--about') }}
        </router-link>
      </div>
      <div class="header-sub--user-actions">
        <button class="button menu" @click="handleClick_toggleMenu()">
          <img
            v-if="!menuOpen"
            src="~assets/images/menu.svg"
            class="icon"
            alt=""
            title=""
          >
          <img
            v-if="menuOpen"
            src="~assets/images/close.svg"
            class="icon"
            alt=""
            title=""
          >
          Menu
        </button>
        <div class="search" @click="showSearchBar">
          <img
            src="../../assets/images/search-icon.svg"
            class="search--icon icon"
          >
          <p class="search--label">
            {{ $t('header--search') }}
          </p>
        </div>
        <router-link class="link--login" to="/login">
          {{ $t('header--login') }}
        </router-link>
        <button class="button secondary link--sign-up">
          {{ $t('header--sign-up') }}
        </button>
      </div>
    </div>
    <div :class="`dropdown flex-container ` + [menuOpen ? '' : 'hidden']">
      <ul>
        <li>
          <button @click="handleClick_route('/challenges')">
            {{ $t('header--challenges') }}
          </button>
        </li>
        <li>
          <button @click="handleClick_route('/about')">
            {{ $t('header--about') }}
          </button>
        </li>
      </ul>
      <hr>
      <ul>
        <li>
          {{ $t('header--login') }}
        </li>
        <li>
          {{ $t('header--sign-up') }}
        </li>
        <li>
          <div class="language-switcher">
            <span
              :class="'language-switcher--lang ' + [this.$i18n.locale == 'en' ? 'active' : '']"
              @click="handleClick_locale('en')"
            >EN</span>
            <span class="language-switcher--lang">/</span>
            <span
              :class="'language-switcher--lang ' + [this.$i18n.locale == 'nl' ? 'active' : '']"
              @click="handleClick_locale('nl')"
            >NL</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      menuOpen: false
    };
  },
  created () {
    if (process.browser) {
      if (localStorage.getItem('locale')) {
        this.$i18n.locale = localStorage.getItem('locale');
      }
    }
  },
  methods: {
    handleClick_locale (locale) {
      this.$i18n.locale = locale;
      localStorage.setItem('locale', locale);
    },
    showSearchBar () {
      this.$emit('toggle-search-bar', true);
    },
    handleClick_toggleMenu () {
      this.menuOpen = !this.menuOpen;
    },
    handleClick_route (path) {
      this.menuOpen = false;
      this.$router.push(path);
    }
  }
};
</script>

<style scoped lang="scss">
$top-header-height: 25px;
$sub-header-height: 56px;

.header-wrapper {
  height: ($sub-header-height + $top-header-height + 5px);
  box-shadow: 0 2px 4px 0 rgba(190,190,190,0.6);
  width: 100%;
  padding-bottom: 12px;

  .menu {
    border: unset;
    box-shadow: unset;
    font-display: $font-roboto-light;
  }

  .subsite {
    align-self: center;
    padding-left: 16px;
    padding-right: 16px;
    border-right: 1px solid $color-gray-30;
    color: $color-secondary-turquoise;
    font-family: $font-roboto-light;
    font-size: 18px;
  }

  .go-to-kvk {
    display: flex;
    font-family: $font-roboto-light;
    color: $color-gray-80;
    font-size: 14px;
    line-height: 1;

    img {
      height: 14px;
      margin-right: 5px;
      align-self: center;
    }
  }

  .service-link {
    margin-left: auto;
    display: flex;
    align-items: center;
    font-family: $font-roboto-light;
    color: $color-gray-80;
    font-size: 14px;
    line-height: 1;

    img {
      height: 14px;
      margin-right: 5px;
    }
  }

  .language-switcher {
    font-family: $font-roboto-light;
    margin-left: 32px;

    &--lang {
      color: $color-gray-50;
      cursor: pointer;
    }

    .active {
      color: $color-primary-petrol;
      font-weight: bold;
    }
  }

  .top-header {
    background-color: $color-gray-10;
    height: $top-header-height;

    .flex-container {
      margin-top: 0;
      margin-bottom: 0;
      height: 100%;
      align-items: center;
    }
  }

  .header-sub {
    height: $sub-header-height;

    &.flex-container {
      margin-top: 0;
      margin-bottom: 0;
    }

    &--logo-container {
      display: flex;

      a {
        align-self: center;
        display: flex;
      }

      .logo {
        height: 1.6em;
        align-self: center;
      }
    }

    &--links-container {
      display: flex;
      justify-self: start;
      margin-left: 16px;

      a {
        align-self: center;
        margin-right: 16px;
        color: $color-gray-80;
        font-size: 18px;
      }
    }

    &--user-actions {
      display: flex;
      margin-left: auto;

      .search {
        cursor: pointer;
        display: flex;
        margin-right: 25px;
        align-items: center;

        &--icon {
          margin-right: 10px;
        }
      }

      a {
        align-self: center;
        margin-right: 25px;
      }

      button {
        align-self: center;
      }
    }
  }

  &--logo-container {
    display: flex;

    a {
      align-self: center;
      display: flex;
    }

    .logo {
      height: 1.6em;
      align-self: center;
    }
  }

  &--links-container {
    display: flex;
    justify-self: start;
    margin-left: 81px;

    a {
      align-self: center;
      margin-right: 48px;
      color: $color-gray-50;
      font-size: 18px;
    }
  }

  &--user-actions {
    display: flex;
    margin-left: auto;

    a {
      align-self: center;
      margin-right: 25px;
    }

    button {
      align-self: center;
    }

    .flex-container {
      margin-top: 0;
      margin-bottom: 0;
      height: 100%;
      justify-content: unset;
    }

    .user {
      height: 2.5em;
      width: 2.5em;
      justify-self: center;
    }
  }

  a {
    text-decoration: none;
    color: $color-primary-purple;
  }

  .button {
    margin-right: 0;
  }

  .menu {
    display: none;
  }

  .dropdown {
    display: none;
  }

  .hidden {
    display: none !important;
  }
}

@media only screen and (max-width: 959px) {
  .header-wrapper {
    height: unset;

    .icon {
      width: 16px;
    }

    .language-switcher {
      color: black;
      font-family: $font-roboto-light;

      &--lang {
        color: $color-gray-50;
      }
    }

    .active {
      color: unset;
      font-family: $font-roboto-regular;
      color: black !important;
    }

    .menu {
      display: flex;
      border: none;
      align-items: center;
      margin-left: auto;
      color: $color-gray-80;
      font-size: 16px;
      font-family: $font-roboto-regular;
      padding: 0px 24px;

      img {
        margin-right: 6px;
      }
    }

    .link {
      &--challenges {
        display: none;
      }

      &--about {
        display: none;
      }

      &--login {
        display: none;
      }

      &--sign-up {
        display: none;
      }
    }

    .header-sub {
      &--user-actions {
        margin-left: 0;
      }
    }

    .top-header {
      display: none;
    }

    .dropdown {
      display: block;
      width: 100%;
      background: white;
      padding: 16px;
      padding-bottom: 0;
      margin-bottom: 0;

      ul {
        margin: 0;
        list-style: none;
        padding-left: 0;

        li {
          font-family: $font-roboto-regular;
          margin: 16px 0;

          a, button {
            font-family: $font-roboto-regular;
            color: black;
            font-size: 16px;
            line-height: 5px;
            border: unset;
            padding-left: 0;
          }
        }
      }

      &.flex-container {
        margin-top: 0;
        padding-top: 1em;
      }
    }
  }
}

@media only screen and (max-width: 515px) {
  .header-wrapper {
    .logo {
      display: none;
    }

    .search--label {
      display: none;
    }
  }
}
</style>
