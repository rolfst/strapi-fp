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
    loading: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    profilePictureUrl () {
      if (this.data.profilePicture) {
        return process.env.restApi + this.data.profilePicture.url;
      } else {
        return '/images/avatar_default.svg';
      }
    }
  },
  data () {
    return {
      api: axios.create({ baseURL: this.baseUrl }),
      data: {},
      error: null,
      params: {
        params: {
        }
      },
      headers: {
        headers: {
          'kvkmasterid': '09501717-87b1-48fe-adaa-a2d4040325f1'
        }
      }
    };
  },
  mounted () {
    this.getParticipants();
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
      this.$emit('success', response);
      return response.data;
    },
    async getParticipants () {
      const res = await this.query('get', this.endpoint, this.headers);
      this.data = res;
    },
    selectParticipant (participant) {
      // TODO: Implement select functionality. Waiting for backend...
    },
    nominateParticipant (participant) {
      // TODO: Implement nominate functionality. Waiting for backend...
    }
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
