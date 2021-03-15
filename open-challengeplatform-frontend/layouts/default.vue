<template>
  <div>
    <Header class="header" @toggle-search-bar="toggleSearchBar()" />
    <Searchbar v-if="showSearchBar" class="searchbar" @toggle-search-bar="toggleSearchBar()" />
    <modal v-show="firstTime" :toggle-modal="toggleModal" />
    <notification />
    <nuxt class="nuxt-body" />
    <Footer />
  </div>
</template>

<script>
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import Modal from '~/shared/components/Modal';
import Searchbar from '~/shared/components/Searchbar';
import Notification from '~/shared/components/Notification';

export default {
  components: {
    Header,
    Footer,
    Searchbar,
    'modal': Modal,
    'notification': Notification
  },
  data () {
    return {
      firstTime: false,
      showSearchBar: false
    };
  },
  mounted () {
    if (process.browser) {
      if (!localStorage.getItem('firstTime')) {
        this.firstTime = true;
      }
    }
  },
  methods: {
    // method to call /me and check if store user information in store
    toggleModal () {
      this.firstTime = false;
      localStorage.setItem('firstTime', 'false');
    },
    toggleSearchBar (value) {
      this.showSearchBar = !this.showSearchBar;
    }
  }
};
</script>

<style>
body {
  margin: 0 !important;
}

.nuxt-body {
  margin-top: 95px;
}

.searchbar {
  z-index: 10;
  position: fixed;
  width: 100%;
  animation: slide-down 0.4s;
}

.searchbar-hidden {
  animation: slide-up 0.4s;
}

@keyframes slide-down {
  from {
    transform: translateY(-167px);
  }
  to {
    transform: translateY(0px);
  }
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: white;
  z-index: 100;
}
</style>
