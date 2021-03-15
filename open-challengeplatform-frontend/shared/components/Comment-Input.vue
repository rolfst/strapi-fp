<template>
  <div :class="`comment-input ` + [top ? 'top' : '']">
    <div class="comment-input--profile-picture">
      <img
        :src="imageUrl"
        class="comment-input--profile-picture--image"
        :alt="profilePictureAltText"
        :title="profilePictureAltText"
      >
    </div>
    <div class="comment-input--wysiwyg">
      <div :id="`pell-${id}`" class="pell" />
      <p v-if="empty" class="error">
        {{ $t("reaction--empty") }}
      </p>
      <div class="attachments">
        <attachment-reaction v-for="(attachment, key) in attachments" :key="key" :title="attachment.name" type="upload" />
      </div>
    </div>
    <div class="comment-input--send">
      <button class="comment-input--button" @click="handleClick_postReaction">
        <img
          src="~assets/images/send.svg"
          class="comment-input--send--image _post-comment"
          :alt="uploadImageAltText"
          :title="uploadImageAltText"
        >
      </button>
    </div>
  </div>
</template>

<script>
import pell from 'pell';
import striptags from 'striptags';
import AttachmentReaction from '~/shared/components/Attachment-Reaction';

export default {
  components: {
    'attachment-reaction': AttachmentReaction
  },
  props: {
    slug: {
      type: String,
      default: null
    },
    top: {
      type: Boolean,
      default: false
    },
    postReaction: {
      type: Function,
      default: null
    },
    id: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      empty: false,
      content: '',
      profilePictureAltText: '',
      uploadImageAltText: '',
      attachments: []
    };
  },
  computed: {
    imageUrl () {
      if (this.$store.state.user.user) {
        if (this.$store.state.user.user.profilePicture) {
          return process.env.restApi + this.$store.state.user.user.profilePicture.url;
        }
      }
      return '/images/avatar_default.svg';
    }
  },
  mounted () {
    const configComment = {
      element: document.getElementById(`pell-${this.id}`),
      onChange: (html) => {
        html = striptags(html, [
          'p',
          'br',
          'ul',
          'ol',
          'li',
          'h3',
          'div',
          'u',
          'b'
        ]);
        this.content = html;
      },
      actions: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        {
          name: 'h3',
          icon: '<b>H<sub>3</sub></b>',
          title: 'Heading 3',
          result: () => pell.exec('formatBlock', '<h3>')
        },
        'paragraph',
        'olist',
        'ulist',
        {
          name: 'attachment',
          icon: 'yeet',
          title: 'Attachment',
          result: (res) => {
            this.handleAttachments(res);
          }
        }
      ]
    };
    const configAll = {
      element: document.getElementById(`pell-${this.id}`),
      onChange: (html) => {
        this.content = html;
      },
      actions: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'heading1',
        'heading2',
        {
          name: 'h3',
          icon: '<b>H<sub>3</sub></b>',
          title: 'Heading 3',
          result: () => pell.exec('formatBlock', '<h3>')
        },
        'paragraph',
        'olist',
        'ulist'
      ]
    };
    if (this.type === 'comment') {
      pell.init(configComment);
    } else {
      pell.init(configAll);
    }
    this.translate();
  },
  methods: {
    handleClick_postReaction () {
      if (this.content.length > 0) {
        this.empty = false;
        this.postReaction(this.slug, this.content).then((res) => {
          this.content = '';
          const el = document.getElementById(res);
          el.scrollIntoView({ block: 'center' });
        });
      } else {
        this.empty = true;
      }
    },
    translate () {
      this.profilePictureAltText = this.$i18n.t('comment-input--profile-picture--alt-text');
      this.uploadImageAltText = this.$i18n.t('comment-input--upload--image--alt-text');
    },
    handleAttachments (ev) {
      let el = window._protected_reference = document.createElement('INPUT');
      el.type = 'file';
      el.multiple = 'multiple';
      // cancel will not trigger 'change'
      el.addEventListener('change', (ev2) => {
        // access el.files[] to do something with it (test its length!)
        new Promise((resolve) => {
          this.attachments = el.files;
        }).then(function () {
          // clear / free reference
          el = window._protected_reference = undefined;
        });
      });
      el.click(); // open
    }
  }
};
</script>

<style lang="scss">
.comment-input {
  padding: 24px;
  width: 100%;
  background: #fcfbfe;
  display: flex;
  flex-direction: row;
  align-items: center;

  &--button {
    background: unset;
    border: unset;
  }

  &.top {
    background: white;
    padding-right: 0;
  }

  &--profile-picture {
    &--image {
      height: 66px;
      width: 66px;
      border-radius: 50%;
      flex: 1;
    }
  }

  &--wysiwyg {
    flex: 10;
    height: 100%;
    margin-left: 24px;

    button {
      background: unset;
      border: unset;
    }
  }

  &--send {
    justify-self: flex-end;
    display: block;
    flex: 1;
    text-align: center;

    &--image {
      height: 30px;
      width: 30px;
    }
  }

  p {
    &.error {
      color: red;
      margin: 0;
    }
  }

  .attachments {
    padding-top: 16px;
  }
}
</style>
