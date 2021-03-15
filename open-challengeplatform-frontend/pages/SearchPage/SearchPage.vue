<template>
  <div class="search-page">
    <h1 class="page-title">Search results</h1>
    <search-bar :closable="false" :inputValue="query" @set-search-string="setSearchQuery" />
    <search-service endpoint="/challenges/search" :searchString="query">
      <div slot-scope="{ searchResult: searchResult}">
        <status-filter :filters="filters" />
        <div class="result-list">
          <div class="result-list--content">
            <div v-if="searchResult.length === 0">
              <h3>No results found for the term '{{ query }}'</h3>
            </div>
            <div v-if="searchResult.length !== 0">
              <h3>Found {{ searchResult.length }} results on '{{ query }}'</h3>
              <div v-for="result in searchResult" :key="result.id">
                <challenge-search-result @click.native="handleCardClick(result.slug)" :challenge="result" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </search-service>
  </div>
</template>

<script>
import SearchService from '../../shared/services/Search-Service';
import SearchBar from '../../shared/components/Searchbar';
import StatusFilter from '../../shared/components/Status-Filter';
import { SEARCH_FILTERS } from '../../plugins/filters-types';
import ChallengeSearchResult from './components/ChallengeSearchResult';
export default {
  components: {
    'search-service': SearchService,
    'search-bar': SearchBar,
    'status-filter': StatusFilter,
    'challenge-search-result': ChallengeSearchResult
  },
  data () {
    return {
      query: '',
      filters: []
    };
  },
  methods: {
    getSearchQueryFromUrl () {
      const searchQuery = this.$route.query.q;
      if (searchQuery) {
        this.query = searchQuery;
      }
    },
    handleCardClick (slug) {
      this.$router.push(`/challenges/${slug}`);
    },
    setSearchQuery (value) {
      this.query = value;
    }
  },
  beforeMount () {
    this.filters = SEARCH_FILTERS;
    this.getSearchQueryFromUrl();
  }
};
</script>

<style lang="scss" scoped>
.page-title {
    padding-top: 156px;
    max-width: 1000px;
    margin: 0 auto;
    padding-bottom: 38px;
  }

.result-list {
    background-color: $color-custom-gray-1;
    padding-bottom: 120px;
    padding-top: 60px;

    .result-list--content {
      max-width: 1000px;
      margin: 0 auto;
    }
}

.flex-container {
  .result {
    justify-content: flex-start;
  }
}
</style>
