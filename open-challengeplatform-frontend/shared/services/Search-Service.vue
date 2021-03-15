<script>
import axios from 'axios';
export default {
  props: {
    baseUrl: {
      type: String,
      default: process.env.restApi
    },
    endpoint: {
      type: String,
      required: true
    },
    searchString: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      api: axios.create({ baseURL: this.baseUrl }),
      data: [],
      error: null
    };
  },
  watch: {
    searchString: function (newVal, oldVal) {
      this.getSearchResult();
    }
  },
  methods: {
    async query (type, ...params) {
      this.loading = true;
      const response = await this.api[type](...params)
        .catch((err) => {
          this.error = err.response;
          this.$emit('error', err);
          return this.error;
        });
      this.loading = false;
      this.data = response.data.challenges;
      this.$emit('success', response);
      return this.data;
    },
    getSearchResult () {
      return this.query('post', this.endpoint, { '_q': this.searchString });
    }
  },
  mounted () {
    this.getSearchResult();
  },
  render () {
    return this.$scopedSlots.default({
      searchResult: this.data,
      error: this.error,
      loading: this.loading
    });
  }
};
</script>
