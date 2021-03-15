<template>
  <div :key="componentKey" class="wrapper">
    <div class="discussion-top flex-container _comment-container">
      <div class="discussion-top--header">
        <profile-picture v-if="reaction.created_by" :img="reaction.created_by.profilePicture" />
        <div class="discussion-top--header--text">
          <h3 v-if="reaction.created_by">
            {{ reaction.created_by.name }}
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
            class="icon more-options end _moreoptions"
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
      <div class="discussion-top--attachments">
        <attachment
          v-for="attachment in reaction.attachments"
          :key="attachment._id"
          type="download"
          :url="attachment.url"
          :title="attachment.name"
          :size="attachment.size"
          :ext="attachment.ext"
        />
      </div>
      <hr>
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
          :alt="likesIconAltText"
          :title="likesIconAltText"
          @click="handleClick_like()"
        >
        <likes :like-amount="reaction.likes" />
        <img
          src="~assets/images/favorite.svg"
          :class="'icon ' + [reaction.favoritedByUser ? 'svg-purple' : ''] + ' _favorite'"
          :alt="favoritesIconAltText"
          :title="favoritesIconAltText"
          @click="handleClick_favorite()"
        >
        <span class="label">{{ reaction.favorites }}</span>
        <share :endpoint="`/challenges/${challengeSlug}?reaction=${reaction.full_slug}`" class="share" />
      </div>
    </div>
    <div v-if="inputVisible" class="input flex-container">
      <comment-input :id="reaction._id" type="comment" :slug="reaction.slug" :post-reaction="postReaction" />
    </div>
    <div v-if="reaction.children">
      <div v-if="reaction.children.length != 0" class="reactions flex-container">
        <reaction-sub
          v-for="(child, key) in reaction.children"
          :id="child._id"
          :key="key"
          :reaction="child"
          :load-sub-reactions="loadSubReactions"
          :post-reaction="postReaction"
          :challenge-slug="challengeSlug"
          :favorite-reaction="favoriteReaction"
          :like-reaction="likeReaction"
          :highlight-reaction="highlightReaction"
          :delete-reaction="deleteReaction"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ReactionSub from '~/shared/components/Reaction-Sub';
import ProfilePicture from '~/shared/components/Profile-Picture';
import CommentInput from '~/shared/components/Comment-Input';
import AttachmentReaction from '~/shared/components/Attachment-Reaction';
import Share from '~/shared/components/Share';
import Likes from '~/shared/components/Likes';

export default {
  components: {
    'reaction-sub': ReactionSub,
    'profile-picture': ProfilePicture,
    'comment-input': CommentInput,
    'attachment': AttachmentReaction,
    'share': Share,
    'likes': Likes
  },
  props: {
    reaction: {
      type: Object,
      default: () => {
        return {
          createdAt: '',
          summary: '',
          child_count: 0,
          children: []
        };
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
    challengeSlug: {
      type: String,
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
      componentKey: 0,
      currentReaction: this.$props.reaction,
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
        return this.acceptedRoles.includes(this.$store.state.user.user.role.name);
      }
      return false;
    }
  },
  watch: {
    reaction: {
      handler: function (newReaction) {
        this.reaction = newReaction;
        this.componentKey += 1;
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
      if (this.loadSubReactions) {
        this.inputVisible = true;
        this.loadSubReactions(this.reaction.slug, this.reaction.depth + 1);
      }
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
      this.bookmarkIconAltText = this.$i18n.t('reaction-top--bookmark-icon--alt-text');
      this.commentsIconAltText = this.$i18n.t('reaction-top--comments-icon--alt-text');
      this.favoritesIconAltText = this.$i18n.t('reaction-top--favorites-icon--alt-text');
      this.likesIconAltText = this.$i18n.t('reaction-top--likes-icon--alt-text');
      this.moreOptionsIconAltText = this.$i18n.t('reaction-top--more-options-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
$padding: 24px;
$width: (1000- ($padding * 2));

.wrapper {
  width: 100%;

  .share {
    margin-left: 50px;
  }

  .discussion-top {
    position: relative;

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
    }

    &--content {
      margin-top: 24px;
      width: 100%;
    }

    &--social-buttons {
      height: 68px;
      display: flex;

      .social-item {
        height: 32px;
        align-self: center;
        display: flex;
        margin-right: 36px;

        img {
          align-self: center;
        }
      }
    }

    hr {
      margin: 0;
      border-bottom: 0;
      border-left: 0;
      border-right: 0;
      border-top: solid 1px $color-gray-10;
    }

    &--footer {
      padding-top: 18px;
      height: 48px;
      width: 100%;
      display: flex;
      align-items: center;

      .icon {
        margin-left: 50px;

        &:first-of-type {
          margin-left: 0;
        }
      }
    }

    .svg-purple {
      filter: invert(36%) sepia(8%) saturate(6440%) hue-rotate(272deg)
        brightness(91%) contrast(86%);
      --webkit-filter: invert(36%) sepia(8%) saturate(6440%) hue-rotate(272deg)
        brightness(91%) contrast(86%);
    }

    .label {
      align-self: center;
      margin-left: 6px;
      color: #3b3b3b;
      font-family: $font-roboto-light;
      font-size: 18px;
    }

    &.flex-container {
      max-width: $width;
      padding: $padding;
      background-color: white;
      margin-top: 0;
      margin-bottom: 0;
      box-shadow: 0 2px 4px 0 rgba(226, 226, 226, 0.5);
      border: 1px solid #EFEFEF;
    }
  }

  .reactions {
    position: relative;

    &.flex-container {
      margin-top: 0px;
      margin-bottom: 0px;
      box-shadow: 0 2px 4px 0 rgba(226, 226, 226, 0.5);
    }
  }

  .end {
    justify-self: flex-end;
    align-content: center;
    margin-left: auto;
  }

  .input {
    &.flex-container {
      margin-top: 0;
      margin-bottom: 0;
      background: white;
    }
  }

  .icon {
    cursor: pointer;

    &.more-options {
      margin-left: 32px;
    }
  }
}
</style>
