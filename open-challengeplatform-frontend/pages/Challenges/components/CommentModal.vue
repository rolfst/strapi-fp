<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="toggleModal">&times;</span>
      <h2>{{ $t('comment-modal--leave-a-comment') }}</h2>
      <div class="modal-content--box">
        <form class="form-control">
          <textarea :placeholder="commentPlaceholder" />
        </form>
        <div class="text-enhancers">
          <img
            src="../../../assets/images/emoticon.svg"
            :alt="emoticonIconAltText"
            :title="emoticonIconAltText"
          >
          <img
            src="../../../assets//images/attachment.svg"
            :alt="attachmentIconAltText"
            :title="attachmentIconAltText"
          >
        </div>
      </div>
      <button class="button primary">
        {{ $t('comment-modal--leave-a-comment--button-text') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'toggleModal'
  ],
  data () {
    return {
      attachmentIconAltText: '',
      commentPlaceholder: '',
      emoticonIconAltText: ''
    };
  },
  mounted () {
    this.translate();
  },
  methods: {
    closeModal () {
      this.showModal = false;
    },
    translate () {
      this.attachmentIconAltText = this.$i18n.t('comment-model--attachment--alt-text');
      this.commentPlaceholder = this.$i18n.t('comment-modal--comment--placeholder');
      this.emoticonIconAltText = this.$i18n.t('comment-model--emoticon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-content--box {
  min-height: 248px;
  border: 1px solid #bebebe;
  border-radius: 4px;
  margin-top: 24px;
  display: flex;
  padding: 12px;
}

.form-control {
  margin: 0 auto;
  flex:9;

  textarea {
  min-width: 820px;
  min-height: 184px;
  border: none;
  font-size: 18px;
  }
}

.text-enhancers {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: baseline;
}

.button {
  margin-top: 24px;
}

img {
  cursor: pointer;
}
</style>
