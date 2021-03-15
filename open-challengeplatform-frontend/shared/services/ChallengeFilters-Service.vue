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
      error: null,
      statusFilter: [],
      typeFilter: []
    };
  },
  methods: {
    async query (type, ...params) {
      const response = await this.api[type](...params).catch((err) => {
        this.error = err.response;
        this.$emit('error', err);
        return this.error;
      });
      const filters = response.data.filters;
      filters.forEach((element) => {
        if (element.status) {
          this.statusFilter = element.status;
        }
        if (element.type) {
          this.typeFilter = element.type;
        }
      });
      this.$emit('success', response);
      return this.data;
    },
    getTags () {
      return this.query('get', this.endpoint, {
        params: { title_contains: this.$props.params }
      });
    }
  },
  mounted () {
    this.getTags();
  },
  render () {
    return this.$scopedSlots.default({
      statusFilter: this.statusFilter,
      error: this.error,
      typeFilter: this.typeFilter
    });
  }
};
</script>
