<template>
  <div class="tags-filters">
    <div class="form-control field-small">
      <tags-service endpoint="tags" :params="subject">
        <div slot-scope="{ tags: tags, getTags: getTags }">
          <input
            v-model="subject"
            class="_input-subjects"
            type="text"
            icon="true"
            :placeholder="tagsPlaceholder"
            required
            @input="triggerTagSearch(getTags)"
          >
          <img
            src="../../../assets/images/search-icon.svg"
            class="input-icon"
            :alt="tagsSearchIconAltText"
            :title="tagsSearchIconAltText"
          >
          <div v-if="showAutoSuggestTags" class="more-options--options">
            <ul v-for="tag in tags" :key="tag._id" @click="addTag">
              <li>{{ tag.title }}</li>
            </ul>
          </div>
        </div>
      </tags-service>
    </div>
    <div class="flex-container selected-tags">
      <div v-for="tag in allTags" :key="tag" @click="removeTag(tag)">
        <tag-component closable="true" color="blue">
          {{ tag }}
        </tag-component>
      </div>
    </div>
  </div>
</template>

<script>
import TagsService from '../../../shared/services/Tags-Service';
import TagComponent from '../../../shared/components/Tag';

export default {
  components: {
    'tags-service': TagsService,
    'tag-component': TagComponent
  },
  props: {
    profile: {
      type: Boolean,
      default: false
    },
    initial: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showAutoSuggestTags: false,
      allTags: this.initial,
      subject: '',
      tagsPlaceholder: '',
      tagsSearchIconAltText: ''
    };
  },
  watch: {
    initial: function (newVal, oldVal) {
      this.allTags = newVal;
    }
  },
  beforeMount () {
    this.getTagsFromUrl();
  },
  mounted () {
    this.translate();
  },
  methods: {
    triggerTagSearch (fn) {
      if (this.subject.length > 2) {
        this.showAutoSuggestTags = true;
        fn();
      } else {
        this.showAutoSuggestTags = false;
      }
    },
    addTag: function (e) {
      this.allTags.push(e.target.innerHTML);
      this.showAutoSuggestTags = false;
      this.subject = '';
      if (this.$props.profile) {
        this.$emit('add-tag', e.target.innerHTML);
      } else {
        this.$emit('subject-filter-array', this.allTags);
      }
    },
    removeTag (tag) {
      this.allTags = this.allTags.filter((elem) => {
        return elem !== tag;
      });
      if (this.$props.profile) {
        this.$emit('remove-tag', tag);
      } else {
        this.$emit('subject-filter-array', this.allTags);
      }
    },
    getTagsFromUrl () {
      const tags = this.$route.query.tags;
      if (tags) {
        this.allTags = tags.split(',');
        this.$emit('subject-filter-array', this.allTags);
      }
    },
    translate () {
      this.tagsPlaceholder = this.$i18n.t('tags-filter--tags--placeholder');
      this.tagsSearchIconAltText = this.$i18n.t('tags-filter--search-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.more-options--options{
  z-index: 99;
  opacity: 1;
  display: block;
  margin-top: -14px;
  width: 100%;

  li:hover {
    color: white;
    background-color: #aa418c;
  }
}

.selected-tags {
  flex-wrap: wrap;

  &.flex-container {
    justify-content: unset;
  }
}
</style>
