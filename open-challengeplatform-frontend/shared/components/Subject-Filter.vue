<template>
  <div :class="{hidden: hidden, 'subject-filter': true}">
    <div class="subject-filter-title-container">
      <h1 class="subject-filter--title">
        {{ $t('filter') }}
      </h1>
      <img
        src="~assets/images/clear.svg"
        class="subject-filter--close"
        :alt="closeIconAltText"
        :title="closeIconAltText"
        @click="toggleFilter"
      >
    </div>
    <div class="subject-filter--subtitle">
      <h3>{{ $t('subjects') }}</h3>
      <hr>
    </div>
    <div class="subject-filter--content">
      <tags-service endpoint="tags">
        <div slot-scope="{ tags: tags }">
          <ul>
            <li v-for="tag in tags" :key="tag._id">
              <input :id="tag._id" v-model="checkedTags" type="checkbox" class="subject-filter--checkbox styled-checkbox" :value="tag.title">
              <label :for="tag._id">{{ tag.title }}</label>
            </li>
          </ul>
        </div>
      </tags-service>
    </div>
    <div class="subject-filter--footer">
      <button class="button primary" @click="loadFilteredChallenges()">
        {{ $t('apply') }}
      </button>
      <button class="button" @click="resetCheckedTags()">
        {{ $t('reset') }}
      </button>
    </div>
  </div>
</template>

<script>
import TagsService from '../services/Tags-Service';

export default {
  components: {
    'tags-service': TagsService
  },
  props: [
    'hidden',
    'toggleFilter'
  ],
  data () {
    return {
      checkedTags: [],
      closeIconAltText: ''
    };
  },
  beforeMount () {
    this.getTagsFromUrl();
  },
  mounted () {
    this.translate();
  },
  methods: {
    resetCheckedTags () {
      this.checkedTags = [];
    },
    loadFilteredChallenges () {
      this.$emit('subject-filter-array', this.checkedTags);
      this.$props.toggleFilter();
    },
    getTagsFromUrl () {
      const tags = this.$route.query.tags;
      if (tags) {
        this.checkedTags = tags.split(',');
        this.$emit('subject-filter-array', this.checkedTags);
      }
    },
    translate () {
      this.closeIconAltText = this.$i18n.t('subject-filter--close-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
$width: 371px;

.subject-filter {
  padding: 42px;
  padding-top: 53px;
  position: fixed;
  height: 100%;
  width: $width;
  right: 0;
  top: 0;
  background-color: white;
  transition: right 0.2s;
  box-shadow: -29px 0 30px 0 rgba(117,117,117,0.12), -10px 0 30px 0 rgba(0,0,0,0.14);
  -webkit-transition: right 0.2s;
  z-index: 999;

  &--title-container {
    width: 100%;
  }

  &--title {
    display: inline;
  }

  &--close {
    float: right;
    margin-top: 15px;
    cursor: pointer;
  }

  &--subtitle {
    margin-top: 43px;

    h3 {
      margin-bottom: 13px;
    }

    hr {
      border: 0;
      border-top: 1px $color-gray-10 solid;
    }
  }

  &--content {
    ul {
      padding-left: 0;

      li {
        list-style: none;
        padding: 9px 0;
      }
    }
  }

  &--checkbox {
    margin-right: 18px;
  }

  &--footer {
    margin-top: 65px;
  }
}

.hidden {
  right: -($width + (42px * 2));
  box-shadow: none;
}
</style>
