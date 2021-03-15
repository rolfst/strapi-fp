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
    limit: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      api: axios.create({ baseURL: this.baseUrl }),
      headers: {
        headers: {
          'Content-Type': 'application/json',
          'kvkmasterid': '09501717-87b1-48fe-adaa-a2d4040325f1'
        }
      },
      data: [],
      error: null
    };
  },
  methods: {
    async query (type, ...params) {
      const response = await this.api[type](...params)
        .catch((err) => {
          this.error = err.response;
          return this.error;
        });
      this.data = response;
      return this.data;
    },
    async getChallengeNews (limit = 0) {
      // query with challenge slug this.$props.challengeSlug
      const params = {
        '_limit': limit
      };
      const result = await this.query('get', this.endpoint, { headers: this.headers.headers, params: params });
      this.data = result.data;
    }
  },
  created () {
    this.getChallengeNews(this.$props.limit);
  },
  render () {
    return this.$scopedSlots.default({
      data: this.data,
      error: this.error,
      load: this.load
    });
  }
};
</script>
