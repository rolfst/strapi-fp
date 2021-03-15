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
      data: {},
      error: null
    };
  },
  methods: {
    async query (type, ...params) {
      const response = await this.api[type](...params)
        .catch((err) => {
          this.error = err.response;
          // this.$router.push('/404');
          return this.$nuxt.error({ statusCode: 404, message: err.response });
        });
      this.data = response;
      return this.data;
    },
    async getTestimonial () {
      // query with news slug
      const res = await this.query('get', this.endpoint, this.headers);
      this.data = res.data;
    }
  },
  created () {
    this.getTestimonial();
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
