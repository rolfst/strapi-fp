<template>
  <div>
    <div class="flex-container">
      <img
        :src="getImageUrl"
        class="challenge-search-image"
        :alt="searchImageAltText"
        :title="searchImageAltText"
      >
      <div class="challenge-search-content">
        <h3>{{ $props.challenge.title }}</h3>
        <p class="search-summary">
          {{ $props.challenge.summary }}
        </p>
        <div class="search-footer">
          <tag title="Challenge" color="outline" class="tag" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tag from '../../../shared/components/Tag';

export default {
  components: {
    'tag': Tag
  },
  props: {
    challenge: {
      type: Object,
      default: function () { return {}; }
    }
  },
  data () {
    return {
      searchImage: '',
      searchImageAltText: ''
    };
  },
  computed: {
    getImageUrl () {
      if (this.$props.challenge.hero) {
        return process.env.restApi + this.$props.challenge.hero.url.toString();
      } else {
        return this.searchImage;
      }
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.searchImageAltText = this.$i18n.t('challenge-search-result--image--alt-text');
    }
  }
};
</script>

<style scoped lang="scss">
.flex-container {
  justify-content: flex-start;
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid #979797;
  flex-wrap: nowrap;
}

.challenge-search-image {
  width: 148px;
  height: 148px;
  margin-right: 10px;
}

.challenge-search-content {
  display: flex;
  flex-direction: column;
  width: 100%;

  p {
    padding: 0;
    margin: 0;
  }
}

.search-footer {
  display: flex;
  justify-content: flex-end;
}

.tag {
  width: 53px;
  padding: 0px 10px;
}

.search-summary {
  height: 76px;
  margin-top: 10px !important;
  font-size: 16px;
  line-height: 24px;
  color: #757575;
}
</style>
