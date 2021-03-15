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
    challengeObject: {
      default: () => ({
        moderators: [],
        company: {
          name: '',
          logo: ''
        }
      })
    }
  },
  data () {
    return {
      api: axios.create({ baseURL: this.baseUrl }),
      data: [],
      error: null,
      challengeForm: this.challengeObject
    };
  },
  methods: {
    async query (type, ...params) {
      const response = await this.api[type](...params)
        .catch((err) => {
          this.error = err.response;
          this.$emit('error', err);
          return this.error;
        });
      this.data = response.data;
      this.$emit('success', response);
      return this.data;
    },
    createChallenge (formData) {
      return this.query('post', this.endpoint, formData, { headers: { 'kvkmasterid': '09501717-87b1-48fe-adaa-a2d4040325f1' } });
    },
    editChallenge (formData, slug) {
      return this.query('put', this.endpoint + '/' + slug, formData, { headers: { 'kvkmasterid': '09501717-87b1-48fe-adaa-a2d4040325f1' } });
    }
  },
  render () {
    return this.$scopedSlots.default({
      response: this.data,
      createChallenge: this.createChallenge,
      error: this.error,
      challengeForm: this.challengeForm,
      editChallenge: this.editChallenge
    });
  }
};
</script>
