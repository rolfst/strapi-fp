<template>
  <div class="attachment-challenge">
    <span v-if="$props.mode === 'download'" class="attachment-challenge--icon">
      <img
        src="~assets/images/attach_file.svg"
        class="svg-purple"
        :alt="attachFileIconAltText"
        :title="attachFileIconAltText"
      >
    </span>
    <span class="attachment-challenge--title">
      {{ nameOnly }}<br>
      <span class="extension">{{ extension }}</span>
    </span>
    <span class="attachment-challenge--created">{{ attachment.createdAt | date }}</span>
    <span class="attachment-challenge--size">{{ attachment.size }} kb</span>
    <span v-if="$props.mode === 'download'" class="attachment-challenge--download">
      <button @click="handleClick_download()">
        <img
          id="_icon-download"
          src="~assets/images/save.svg"
          class="svg-purple"
          :alt="saveChallengeIconAltText"
          :title="saveChallengeIconAltText"
        >
      </button>
    </span>
    <span v-if="!$props.mode" class="attachment-challenge--download">
      <button>
        <img
          src="~assets/images/bin.svg"
          :alt="binIconAltText"
          :title="binIconAltText"
        >
      </button>
    </span>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: [
    'attachment',
    'mode'
  ],
  data () {
    return {
      attachFileIconAltText: '',
      binIconAltText: '',
      saveChallengeIconAltText: ''
    };
  },
  computed: {
    formattedUrl: function () {
      if (this.$props.mode === 'download') {
        return process.env.restApi + this.attachment.url;
      }
      return null;
    },
    nameOnly: function () {
      if (this.$props.mode === 'download') {
        return this.attachment.name.substr(0, this.attachment.name.lastIndexOf('.')) || this.attachment.name;
      } else {
        return this.attachment.name.split('.')[0];
      }
    },
    extension: function () {
      if (this.$props.mode === 'download') {
        return this.attachment.ext.substr(1);
      } else {
        return this.attachment.name.split('.')[1];
      }
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    handleClick_download () {
      axios({
        url: this.formattedUrl,
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', this.attachment.name);
        document.body.appendChild(fileLink);
        fileLink.click();
      });
    },
    translate () {
      this.attachFileIconAltText = this.$i18n.t('attachment-challenge--attach-file-icon--alt-text');
      this.binIconAltText = this.$i18n.t('attachment-challenge--bin-icon--alt-text');
      this.saveChallengeIconAltText = this.$i18n.t('attachment-challenge--save-challenge-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.attachment-challenge {
  width: calc(100% - 40);
  padding: 20px 20px;
  display: flex;
  align-items: center;
  text-align: left;
  font-family: $font-roboto-regular;
  color: $color-gray-50;
  line-height: 30px;
  margin-bottom: 17px;
  background: white;
  border-radius: 4px;

  &:last-of-type {
    border-bottom: unset;
  }

  &--icon {
    width: 50px;
    display: flex;
    align-content: center;

    img {
      height: 35px;
      align-self: center;
    }
  }

  &--title {
    flex: 5;
    margin-right: 100px;
  }

  &--created {
    flex: 3;
  }

  &--size {
    flex: 1;
  }

  &--download {
    flex: 1;
    display: flex;
    align-content: center;
    cursor: pointer;

    button {
      background: unset;
      border: unset;
      margin-left: auto;
      align-self: center;

      img {
        height: 35px;
      }
    }
  }

  .extension {
    font-size: 14px;
    text-transform: uppercase;
    color: $color-gray-date-time;
  }

  .svg-purple {
    filter: invert(36%) sepia(8%) saturate(6440%) hue-rotate(272deg)
    brightness(91%) contrast(86%);
    --webkit-filter: invert(36%) sepia(8%) saturate(6440%) hue-rotate(272deg)
    brightness(91%) contrast(86%);
  }
}
</style>
