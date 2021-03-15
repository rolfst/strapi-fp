<script>
import axios from 'axios';
import Upload from '~/shared/services/Upload';
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
    async getMyInformation () {
      this.data = await this.query('get', this.endpoint + '/me', this.headers);
      this.$store.commit('user/set', this.data);
    },
    async addTag (tag) {
      const res = await this.query('patch', 'interest', { op: 'add', tag: tag }, this.headers);
      return res;
    },
    async removeTag (tag) {
      const res = await this.query('patch', 'interest', { op: 'remove', tag: tag }, this.headers);
      return res;
    },
    async uploadProfilePicture (profilePicture) {
      const formData = new FormData();
      formData.append('data', JSON.stringify({}));
      formData.append('files.profilePicture', profilePicture);

      const res = await Upload.uploadAttachment(formData, '/users');
      this.data = res.data;
    }
  },
  mounted () {
    this.getMyInformation();
  },
  render () {
    return this.$scopedSlots.default({
      data: this.data,
      error: this.error,
      load: this.load,
      addTag: this.addTag,
      removeTag: this.removeTag,
      uploadProfilePicture: this.uploadProfilePicture,
      profilePictureUrl: this.profilePictureUrl
    });
  }
};
</script>
