<script>
import axios from 'axios';
import { NotificationService } from '~/shared/services/Notification-Service.js';

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
    initialReaction: {
      type: String,
      default: ''
    },
    scrollTo: {
      type: Function,
      default: null
    },
    amount: {
      type: Number,
      default: null
    },
    favorites: {
      type: Boolean,
      default: false
    },
    highlights: {
      type: Boolean,
      default: false
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
      data: null,
      error: null,
      reactions: [],
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
      this.loading = false;
      this.data = response;
      return this.data;
    },
    getSingleReaction (slug) {
      return new Promise((resolve, reject) => {
        this.query('get', this.endpoint + '/' + slug, this.headers).then((res) => {
          resolve(res.data);
        });
      });
    },
    async loadTopReactions () {
      const params = {
        params: {
          depth: 0,
          '_sort': 'createdAt:DESC'
        }
      };
      await this.query('get', this.endpoint, { params: params.params, headers: this.headers.headers }).then((resp) => {
        resp.data.reactions.map((reaction) => {
          this.$set(reaction, 'children', []);
        });
        this.reactions = resp.data.reactions;
      });
    },
    loadSubReactions (slug, depth) {
      return new Promise((resolve, reject) => {
        const params = {
          full_slug_contains: slug,
          depth: depth,
          '_sort': 'createdAt:DESC'
        };
        this.query('get', this.endpoint, { params: params, headers: this.headers.headers }).then((resp) => {
          const parent = this.search(this.reactions, slug);
          if (parent) {
            resp.data.reactions.map((reaction) => {
              this.$set(reaction, 'children', []);
            });
            this.$set(parent, 'children', resp.data.reactions);
            this.$scopedSlots.reactions = this.reactions;
          }
        }).catch((resp) => {
        });
      });
    },
    loadHighlightedReaction (fullSlug) {
      return new Promise((resolve, reject) => {
        if (fullSlug) {
          const items = fullSlug.split('~');
          items.map((item, key) => {
            this.loadSubReactions(item, key + 1);
          });
          resolve();
        }
      });
    },
    postReaction (parentSlug = '', content) {
      return new Promise((resolve, reject) => {
        this.query('post', this.endpoint + `/${parentSlug}`, { summary: content }, this.headers).then(async (res) => {
          const input = res.data;
          input.children = [];
          if (input.parent_id) {
            const parent = this.search(this.reactions, parentSlug);
            await this.loadSubReactions(parentSlug, parent.depth + 1);
          } else {
            await this.loadTopReactions();
          }
          resolve(input._id);
        });
      });
    },
    search (root, slug) {
      if (Array.isArray(root)) {
        const arr = [...root];
        return arr.reduce((acc, value, index, init) => {
          const result = this.search(value, slug);
          if (result !== null) { init.length = 0; }
          return result;
        }, arr);
      }
      if (root.slug === slug) {
        return root;
      } else if (root.children != null) {
        const children = [...root.children];
        return children.reduce((acc, value, index, arr) => {
          acc = this.search(value, slug);
          if (acc !== null) { arr.length = 0; };
          return acc;
        }, null);
      }
      return null;
    },
    loadInitialReaction () {
      if (this.$props.initialReaction) {
        this.loadHighlightedReaction(this.$props.initialReaction).then((res) => {
          this.getSingleReaction(this.$props.initialReaction).then((res) => {
            this.$props.scrollTo(res._id);
          });
        });
      }
    },
    likeReaction (reactionSlug) {
      return new Promise((resolve, reject) => {
        const payload = {
          op: 'like'
        };
        this.query('patch', this.endpoint + `/${reactionSlug}`, payload, this.headers).then((res) => {
          resolve(res.data);
        });
      });
    },
    favoriteReaction (reactionSlug) {
      return new Promise((resolve, reject) => {
        const payload = {
          op: 'favorite'
        };
        this.query('patch', this.endpoint + `/${reactionSlug}`, payload, this.headers).then((res) => {
          NotificationService.showNotification(this.$i18n.t('reaction--favorite--success'));
          resolve(res.data);
        });
      });
    },
    loadReactions (amount = 0) {
      this.reactions = [];
      const params = {
        params: {
          '_limit': amount,
          '_sort': 'createdAt:DESC'
        }
      };

      this.query('get', this.endpoint, params, this.headers).then((res) => {
        this.reactions = res.data.reactions;
      });
    },
    loadFavoriteReactions () {
      const params = {
        params: {
          'type': 'reaction'
        },
        headers: this.headers.headers
      };
      this.query('get', this.endpoint + '/favorites', params).then((res) => {
        this.reactions = res.data;
      });
    },
    highlightReaction (reactionSlug) {
      return new Promise((resolve, reject) => {
        const payload = {
          op: 'highlight'
        };
        this.query('patch', this.endpoint + `/${reactionSlug}`, payload, this.headers).then((res) => {
          NotificationService.showNotification(this.$i18n.t('reaction--highlight--success'));
          resolve(res.data);
        });
      });
    },
    deleteReaction (reactionSlug) {
      return new Promise((resolve, reject) => {
        const payload = {
          op: 'remove'
        };
        this.query('patch', this.endpoint + `/${reactionSlug}`, payload, this.headers).then((res) => {
          NotificationService.showNotification(this.$i18n.t('reaction--delete--success'));
          resolve(res.data);
        });
      });
    },
    loadHighlightedReactions () {
      this.query('get', this.endpoint).then((res) => {
        this.reactions = res.data.highlights;
      });
    }
  },
  created () {
    if (this.$props.amount) {
      this.loadReactions(this.$props.amount);
    } else if (this.$props.favorites) {
      this.loadFavoriteReactions();
    } else if (this.$props.highlights) {
      this.loadHighlightedReactions();
    } else {
      this.loadTopReactions();
      this.loadInitialReaction();
    }
  },
  render () {
    return this.$scopedSlots.default({
      data: this.data,
      error: this.error,
      load: this.load,
      reactions: this.reactions,
      loadSubReactions: this.loadSubReactions,
      postReaction: this.postReaction,
      loadHighlightedReaction: this.loadHighlightedReaction,
      likeReaction: this.likeReaction,
      favoriteReaction: this.favoriteReaction,
      highlightReaction: this.highlightReaction,
      deleteReaction: this.deleteReaction,
      loading: this.loading
    });
  }
};
</script>
