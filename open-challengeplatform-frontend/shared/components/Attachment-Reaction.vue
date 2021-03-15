<template>
  <div class="attachment" @click="handleClick()">
    <div class="attachment--extension">
      {{ extOnly }}
    </div>
    <div class="attachment--name">
      {{ title }}
    </div>
    <div class="attachment--download">
      <img
        src="~assets/images/save.svg"
        :alt="saveIconAltText"
        :title="saveIconAltText"
      >
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: [
    'title',
    'url',
    'type',
    'ext',
    'upload-mode'
  ],
  data () {
    return {
      saveIconAltText: ''
    };
  },
  computed: {
    formattedUrl: function () {
      return process.env.restApi + this.url;
    },
    extOnly: function () {
      if (this.$props.ext) {
        return this.$props.ext.split('.')[1];
      } else if (this.$props.type === 'upload') {
        return this.$props.title.split('.')[1];
      }
      return null;
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    handleClick () {
      if (this.$props.type === 'download') {
        axios({
          url: this.formattedUrl,
          method: 'GET',
          responseType: 'blob'
        }).then((response) => {
          const fileURL = window.URL.createObjectURL(new Blob([response.data]));
          const fileLink = document.createElement('a');
          fileLink.href = fileURL;
          fileLink.setAttribute('download', this.title);
          document.body.appendChild(fileLink);
          fileLink.click();
        });
      }
    },
    translate () {
      this.saveIconAltText = this.$i18n.t('attachment-reaction--save-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.attachment {
  background-color: #f5f5f5;
  border: none;
  display: inline-flex !important;
  flex-direction: row;
  font-size: 12px;
  font-family: $font-roboto-light;
  color: $color-gray-50;
  padding: 10px 15px;
  border-radius: 15px;
  border-radius: 4px;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
  display: inline-block;
  text-decoration: none;

  &--extension {
    padding: 12px;
    border-radius: 4px 0 0 4px;
    height: 100%;
    background-color: rgba(52,52,52,0.08);
    text-transform: uppercase;
    color: $color-gray-date-time;
    font-size: 14px;
  }

  &--name {
    align-self: center;
    font-size: 16px;
    padding: 0 8px 0 8px;
    color: $color-gray-80;
  }

  &--download {
    padding-right: 8px;
    align-self: center;
    filter: invert(49%) sepia(0%) saturate(0%) hue-rotate(3deg) brightness(93%) contrast(93%);

    img {
      height: 18px;
      width: 18px;
    }
  }
}
</style>
