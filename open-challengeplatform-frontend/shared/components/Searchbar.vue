<template>
  <div class="searchpage">
    <div class="searchpage-content">
      <div class="search-header">
        <h2>{{ $t('what-are-you-looking-for') }}</h2>
        <img
          v-if="$props.closable"
          src="../../assets/images/clear.svg"
          :alt="clearSearchIconAltText"
          :title="clearSearchIconAltText"
          @click="close()"
        >
      </div>
      <div class="search-field">
        <div class="form-control">
          <input v-model="searchQuery" type="text" required>
        </div>
        <button class="button primary" @click="goToSearch()">
          {{ $t('search') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    closable: {
      type: Boolean,
      default: true
    },
    inputValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      clearSearchIconAltText: '',
      searchQuery: ''
    };
  },
  beforeMount () {
    if (this.$props.inputValue) {
      this.searchQuery = this.$props.inputValue;
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    close () {
      this.$emit('toggle-search-bar', true);
    },
    goToSearch () {
      if (!this.searchQuery) {
        return;
      }
      this.close();
      this.$router.push({ path: '/search', query: { q: this.searchQuery } });
    },
    translate () {
      this.clearSearchIconAltText = this.$i18n.t('search-bar--clear-search-icon--alt-text');
    }
  }
};
</script>

<style scoped lang="scss">
.searchpage {
  background-color: white;
  min-height: 167px;

  h2 {
    margin: 0;
    padding: 0;
    padding: 30px 0px 30px 0px;
  }

  .searchpage-content {
    max-width: 1000px;
    margin: 0 auto;

    .search-header {
      display: flex;
      justify-content: space-between;
    }
  }

  .search-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -10px;
  }

  .form-control {
    margin-bottom: 0;
    flex: 7;

    input {
      width: 95%;
    }

    .bar {
      width: 97%;
    }
  }

  button {
    flex: 1;
    margin-top: 4px;
    margin-right: 0px;
    height: 50px;
    margin-bottom: 20px;
  }
}
</style>
