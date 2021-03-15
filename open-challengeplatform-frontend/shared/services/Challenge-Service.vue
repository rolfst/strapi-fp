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
    challengeStatus: {
      type: String,
      default: 'current'
    },
    subjectFilter: {
      type: Array,
      default: () => []
    },
    challengeType: {
      type: String,
      default: 'all'
    },
    amount: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      api: axios.create({ baseURL: this.baseUrl }),
      data: [],
      error: null,
      params: {
        params: {
        }
      },
      headers: {
        headers: {
          'kvkmasterid': '09501717-87b1-48fe-adaa-a2d4040325f1'
        }
      },
      loading: false
    };
  },
  watch: {
    challengeStatus: function (newVal, oldVal) {
      this.loadAllChallenges(newVal, this.challengeType, this.subjectFilter);
    },
    subjectFilter: function (newVal, oldVal) {
      this.loadAllChallenges(this.challengeStatus, this.challengeType, newVal);
    },
    challengeType: function (newVal, oldVal) {
      this.loadAllChallenges(this.challengeStatus, newVal, this.subjectFilter);
    }
  },
  mounted () {
    if (this.$props.amount) {
      this.getRandomChallenges(this.$props.amount);
    } else {
      this.loadAllChallenges(this.challengeStatus, this.challengeType, this.subjectFilter);
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
      if (response) {
        this.data = response.data.challenges;
        if (this.data) {
          this.data.forEach((element) => {
            element.timeElapsed = this.percentageOfTimeElapsed(element.start_date, element.end_date);
          });
        }
        this.loading = false;
        this.$emit('success', response);
        return this.data;
      }
      this.loading = false;
      return [];
    },
    loadAllChallenges (statusCriteria, typeCriteria, tagCriteria) {
      this.data = [];
      this.setChallengeCriterias(statusCriteria, typeCriteria, tagCriteria);
      this.query('get', this.endpoint, this.params, this.headers).then((res) => {
        return res;
      }).catch((err) => {
        // TODO: Add proper error handling
        return err;
      });
    },
    setChallengeCriterias (statusCriteria, typeCriteria, tagCriteria) {
      this.params.params.tags_in = tagCriteria;
    },
    async loadNextSetOfChallenges () {
      const newSet = await this.query('get', this.endpoint, this.params, this.headers);
      this.data = new Set([...this.data, ...newSet]);
    },
    getRandomChallenges (amount) {
      this.data = [];
      const params = {
        params: {
          '_limit': amount
        }
      };
      this.query('get', this.endpoint, params, this.headers).then((res) => {
        this.data = res;
      });
    }
  },
  render () {
    return this.$scopedSlots.default({
      data: this.data,
      error: this.error,
      load: this.load,
      loadAllChallenges: this.loadNextSetOfChallenges,
      loading: this.loading
    });
  }
};
</script>
