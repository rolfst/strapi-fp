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
      error: null
    };
  },
  methods: {
    async query (type, ...params) {
      const response = await this.api[type](...params)
        .catch((err) => {
          this.error += err;
          return this.error;
        });
      return response;
    },
    updateChallenge (patchObject) {
      return this.query('patch', this.endpoint, patchObject);
    }
  },
  render () {
    return this.$scopedSlots.default({
      updateChallenge: this.updateChallenge
    });
  }
};
</script>
