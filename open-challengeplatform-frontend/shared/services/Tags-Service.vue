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
    params: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: null
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
      this.data = response.data.tags;
      this.$emit('success', response);
      return this.data;
    },
    getTags (limit = 0) {
      const params = {
        params: {
          title_contains: this.$props.params,
          '_limit': limit
        }
      };
      return this.query('get', this.endpoint, params);
    }
  },
  mounted () {
    this.getTags(this.$props.limit);
  },
  render () {
    return this.$scopedSlots.default({
      tags: this.data,
      error: this.error,
      getTags: this.getTags,
      loading: this.loading
    });
  }
};
</script>
