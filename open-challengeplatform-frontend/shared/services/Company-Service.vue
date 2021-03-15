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
      error: null,
      loading: false
    };
  },
  methods: {
    async query (type, ...params) {
      this.loading = true;
      const response = await this.api[type](...params)
        .catch((err) => {
          this.error = err.response;
          return this.error;
        });
      this.data = response;
      this.loading = false;
      return this.data;
    },
    getCompanies (limit = 6) {
      // TODO: code to be uncommented when connecting the real backend when the route is exposed. Also add 'async' in front of this funciton.
      // TODO: Also change the rendering on the homepage to final format of company route.

      // const params = {
      //   '_limit': limit
      // };
      // const result = await this.query('get', this.endpoint, { headers: this.headers.headers, params: params });
      const result = [
        {
          name: 'klm'
        },
        {
          name: 'appie'
        },
        {
          name: 'sogeti'
        }
      ];
      this.data = result;
    }
  },
  created () {
    this.getCompanies(this.$props.limit);
  },
  render () {
    return this.$scopedSlots.default({
      data: this.data,
      error: this.error,
      loading: this.loading
    });
  }
};
</script>
