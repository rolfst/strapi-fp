<template>
  <div class="discussion-top _comment-container">
    <div class="flex-container">
      <div class="discussion-top--header">
        <profile-picture
          v-if="reaction.created_by"
          :img="reaction.created_by.profilePicture"
          :is-mod="false"
          :big="true"
        />
        <div class="discussion-top--header--text">
          <h3>
            {{
              reaction.created_by.name
            }}
          </h3>
          <span class="date">{{ reaction.createdAt | date }}</span>
        </div>
        <img
          src="~assets/images/bookmark.svg"
          class="icon end _bookmark"
          :alt="bookmarkIconAltText"
          :title="bookmarkIconAltText"
        >
        <div v-if="moreVisible" class="more-options _more-options-comment" tabIndex="0">
          <img
            src="~assets/images/more_options.svg"
            class="icon end _moreoptions"
            :alt="moreOptionsIconAltText"
            :title="moreOptionsIconAltText"
          >
          <div class="more-options--options">
            <ul>
              <li v-if="canHighlight" @click="handleClick_highlight()">
                {{ $t('reaction--dropdown--highlight') }}
              </li>
              <li @click="handleClick_delete()">
                {{ $t('reaction--dropdown--delete') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="discussion-top--content">
        <p v-html="reaction.summary" />
      </div>
      <div class="discussion-top--footer">
        <img
          src="~assets/images/chat_bubble.svg"
          class="icon _comment"
          :alt="commentsIconAltText"
          :title="commentsIconAltText"
          @click="handleClick_loadComments"
        >
        <span class="label">{{ reaction.child_count }}</span>
        <img
          src="~assets/images/thumb_up.svg"
          :class="'icon ' + [reaction.likedByUser ? 'svg-purple' : ''] + ' _like'"
          :alt="thumbUpIconAltText"
          :title="thumbUpIconAltText"
          @click="handleClick_like()"
        >
        <likes :like-amount="reaction.likes" />
        <img
          src="~assets/images/favorite.svg"
          :class="'icon ' + [reaction.favoritedByUser ? 'svg-purple' : ''] + ' _favorite'"
          :alt="favoriteIconAltText"
          :title="favoriteIconAltText"
          @click="handleClick_favorite()"
        >
        <span class="label">{{ reaction.favorites }}</span>
        <share :endpoint="`/challenges/${challengeSlug}?reaction=${reaction.full_slug}`" />
      </div>
      <hr>
    </div>
    <div v-if="reaction.inputVisible" class="input flex-container">
      <comment-input :id="reaction._id" type="comment" :slug="reaction.slug" :post-reaction="postReaction" />
    </div>
    <div v-if="reaction.children.length != 0" class="reaction flex-container">
      <reaction-sub-recursive
        v-for="(child) in reaction.children"
        :id="child._id"
        :key="child.id"
        :reaction="child"
        :load-sub-reactions="loadSubReactions"
        :post-reaction="postReaction"
        :depth="reaction.depth + 1"
        :challenge-slug="challengeSlug"
        :favorite-reaction="favoriteReaction"
        :like-reaction="likeReaction"
        :highlight-reaction="highlightReaction"
        :delete-reaction="deleteReaction"
      />
    </div>
  </div>
</template>

<script>
import ProfilePicture from '~/shared/components/Profile-Picture';
import CommentInput from '~/shared/components/Comment-Input';
import Likes from '~/shared/components/Likes';

export default {
  name: 'reaction-sub-recursive',
  components: {
    'profile-picture': ProfilePicture,
    'comment-input': CommentInput,
    'likes': Likes
  },
  props: {
    reaction: {
      type: Object,
      default: () => {
        return {
          createdAt: '',
          inputVisible: false
        };
      },
      challengeSlug: {
        type: String
      }
    },
    loadSubReactions: {
      type: Function,
      default: null
    },
    postReaction: {
      type: Function,
      default: null
    },
    likeReaction: {
      type: Function,
      default: null
    },
    favoriteReaction: {
      type: Function,
      default: null
    },
    highlightReaction: {
      type: Function,
      default: null
    },
    deleteReaction: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      inputVisible: false,
      children: [],
      acceptedRoles: ['kvk-admin', 'kvk-moderator', 'moderator', 'admin'],
      bookmarkIconAltText: '',
      commentsIconAltText: '',
      favoritesIconAltText: '',
      likesIconAltText: '',
      moreOptionsIconAltText: ''
    };
  },
  computed: {
    moreVisible () {
      if (this.$props.reaction.isOwner) {
        return true;
      }
      if (this.$store.state.user.user.role) {
        if (this.acceptedRoles.includes(this.$store.state.user.user.role.name)) {
          return true;
        }
        return false;
      }
      return false;
    },
    canHighlight () {
      if (this.$store.state.user.user.role) {
        if (this.acceptedRoles.includes(this.$store.state.user.user.role.name)) {
          return true;
        }
        return false;
      }
      return false;
    }
  },
  watch: {
    reaction: {
      handler: function (newReaction) {
        this.reaction = newReaction;
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    handleClick_loadComments () {
      this.$set(this.reaction, 'inputVisible', true);
      this.loadSubReactions(this.reaction.slug, this.reaction.depth + 1);
    },
    handleClick_favorite () {
      if (this.favoriteReaction) {
        this.favoriteReaction(this.reaction.slug).then((res) => {
          this.reaction.favorites = res.favorites;
          this.reaction.favoritedByUser = res.favoritedByUser;
        });
      }
    },
    handleClick_like () {
      if (this.likeReaction) {
        this.likeReaction(this.reaction.slug).then((res) => {
          this.reaction.likes = res.likes;
          this.reaction.likedByUser = res.likedByUser;
        });
      }
    },
    handleClick_highlight () {
      if (this.highlightReaction) {
        this.highlightReaction(this.reaction.slug).then((res) => {
          // TODO: Add highlight confirmation
        });
      }
    },
    handleClick_delete () {
      if (this.deleteReaction) {
        this.deleteReaction(this.reaction.slug).then((res) => {
          this.reaction.summary = res.summary;
        });
      }
    },
    translate () {
      this.bookmarkIconAltText = this.$i18n.t('reaction-sub--bookmark-icon--alt-text');
      this.commentsIconAltText = this.$i18n.t('reaction-sub--comments-icon--alt-text');
      this.favoritesIconAltText = this.$i18n.t('reaction-sub--favorites-icon--alt-text');
      this.likesIconAltText = this.$i18n.t('reaction-sub--likjes-icon--alt-text');
      this.moreOptionsIconAltText = this.$i18n.t('reaction-sub--more-options-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
$padding: 24px;

.discussion-top {
  background-color: #fcfbfe;
  width: 100%;

  &--header {
    width: 100%;
    height: 66px;
    display: flex;

    &--text {
      height: 66px;
      margin-left: 18px;

      .date {
        font-size: 14px;
        font-family: $font-roboto-light;
        color: $color-gray-date-time;
      }
    }

    .more {
      margin-left: 32px;
    }
  }

  &--content {
    margin-top: 12px;
    margin-left: 84px;
    width: 100%;

    p {
      margin-top: 0;
    }
  }

  &--footer {
    padding-top: 18px;
    height: 48px;
    width: 100%;
    display: flex;
    align-items: center;
    margin-left: 84px;

    .icon {
      margin-left: 24px;

      &:first-of-type {
        margin-left: 0;
      }
    }

    .profile-container {
      margin-left: 8px;
      display: flex;

      .profile-picture {
        margin-left: -10px;

        &:first-child {
          margin-left: 0;
        }
      }

      .extra-count {
        position: relative;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        background-color: $color-gray-30;
        border: 4px solid white;
        top: 0;
        text-align: center;
        line-height: 40px;
        font-family: $font-roboto-light;
        color: white;
      }

      .z-1 {
        z-index: 1 !important;
      }

      .z-2 {
        z-index: 2 !important;
      }

      .z-3 {
        z-index: 3 !important;
      }

      .z-4 {
        z-index: 4 !important;
      }
    }
  }

  .label {
    align-self: center;
    margin-left: 6px;
    color: #3b3b3b;
    font-family: $font-roboto-light;
    font-size: 18px;
  }

  .reaction {
    &.flex-container {
      padding-left: 80px;
      padding-top: 0;
    }
  }

  hr {
      margin: 0;
      margin-top: 18px;
      border-bottom: 0;
      border-left: 0;
      border-right: 0;
      border-top: solid 1px $color-gray-10;
    }

  .input {
    margin-left: 50px;
  }
}

.flex-container {
  padding: $padding;
  padding-bottom: 0;
  background-color: #fcfbfe;
  margin-top: 0;
  margin-bottom: 0 !important;
}

.icon {
  cursor: pointer;
}

.end {
  justify-self: flex-end;
  align-content: center;
  margin-left: auto;
}

.svg-purple {
  filter: invert(36%) sepia(8%) saturate(6440%) hue-rotate(272deg)
    brightness(91%) contrast(86%);
  --webkit-filter: invert(36%) sepia(8%) saturate(6440%) hue-rotate(272deg)
    brightness(91%) contrast(86%);
}

.more-options {
  img {
    margin-left: 32px;
  }
}
</style>
