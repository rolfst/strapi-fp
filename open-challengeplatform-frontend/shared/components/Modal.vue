<template>
  <div class="modal introduction">
    <div class="modal-content">
      <span class="close" @click="handleClick_toggleModal">&times;</span>
      <h2>{{ $t('first-time-modal--title') }}</h2>
      <div class="modal-content--box">
        <p>
          {{ $t('first-time-modal--paragraph-1') }}
        </p>
        <p>
          {{ $t('first-time-modal--paragraph-2') }}
        </p>
      </div>
      <button :disabled="disabled" @click="handleClick_toggleModal" class="button primary">
        {{ $t('first-time-modal--button--sign-up') }}
      </button>
      <button :disabled="disabled" @click="handleClick_toggleModal" class="button secondary">
        {{ $t('first-time-modal--button--continue') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    toggleModal: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      disabled: true
    };
  },
  methods: {
    handleClick_toggleModal () {
      if (this.toggleModal) {
        this.toggleModal();
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.disabled = false;
    }, 1000);
  }
};
</script>

<style lang="scss" scoped>
  .introduction {

  }
</style>
