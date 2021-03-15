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
    async archiveChallenge (refresh) {
      const payload = {
        'op': 'status'
      };
      await this.query('patch', this.endpoint + '/status/archived', payload, this.headers);
      refresh();
    },
    async publishChallenge (refresh) {
      const payload = {
        'op': 'status'
      };
      await this.query('patch', this.endpoint + '/status/published', payload, this.headers);
      refresh();
    },
    async unpublishChallenge (refresh) {
      const payload = {
        'op': 'status'
      };
      await this.query('patch', this.endpoint + '/status/unpublished', payload, this.headers);
      refresh();
    }
  },
  render () {
    return this.$scopedSlots.default({
      data: this.data,
      error: this.error,
      loading: this.loading,
      publishChallenge: this.publishChallenge,
      unpublishChallenge: this.unpublishChallenge,
      archiveChallenge: this.archiveChallenge,
      selectParticipant: this.selectParticipant,
      nominateParticipant: this.nominateParticipant,
      getParticipants: this.getParticipants
    });
  }
};
</script>
