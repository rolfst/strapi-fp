<script>
import axios from 'axios';
import { mapMutations } from 'vuex';
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
      data: {},
      error: null,
      loading: false,
      headers: {
        headers: {
          'Content-Type': 'application/json',
          'kvkmasterid': '09501717-87b1-48fe-adaa-a2d4040325f1'
        }
      }
    };
  },
  computed: {
    companyLogoUrl () {
      if (this.data.company) {
        if (this.data.company.logo) {
          return process.env.restApi + this.data.company.logo.url;
        }
        return '';
      } else {
        return '';
      }
    }
  },
  mounted () {
    this.getChallengeDetails();
  },
  methods: {
    async query (type, ...params) {
      this.loading = true;
      const response = await this.api[type](...params)
        .catch((err) => {
          this.error = err.response;
          this.$emit('error', err);
          return this.$nuxt.error({ statusCode: 404, message: err.response });
        });
      this.data = response.data;
      this.$store.commit('setEventDetails', this.data);
      this.data.timeElapsed = this.percentageOfTimeElapsed(response.data.start_date, response.data.end_date);
      this.$emit('success', response);
      this.loading = false;
      return this.data;
    },
    ...mapMutations({
      metaStore: 'setEventDetails'
    }),
    getChallengeDetails () {
      return this.query('get', this.endpoint);
    },
    async likeChallenge () {
      const payload = {
        op: 'like'
      };
      const result = await this.query('patch', this.endpoint, payload, this.headers);
      this.data.likes = result.likes;
      this.data.likedByUser = result.likedByUser;
      return result;
    },
    async favoriteChallenge () {
      const payload = {
        op: 'favorite'
      };
      const result = await this.query('patch', this.endpoint, payload, this.headers);
      this.data.favorites = result.favorites;
      this.data.favoritedByUser = result.favoritedByUser;
      return result;
    }
  },
  render () {
    return this.$scopedSlots.default({
      challengeDetails: this.data,
      error: this.error,
      companyLogoUrl: this.companyLogoUrl,
      loading: this.loading,
      getChallengeDetails: this.getChallengeDetails,
      likeChallenge: this.likeChallenge,
      favoriteChallenge: this.favoriteChallenge
    });
  }
};
</script>
