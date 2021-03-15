<template>
  <div :class="`notification ${hidden ? 'hidden' : ''}`">
    {{ message }}
    <img
      src="~/assets/images/close.svg"
      class="icon"
      :alt="$t('notification--close')"
      :title="$t('notification--close')"
      @click="closeNotification()"
    >
  </div>
</template>

<script>
import { NotificationService } from '~/shared/services/Notification-Service.js';

export default {
  data () {
    return {
      message: '',
      hidden: true
    };
  },
  mounted () {
    this.handleNotification();
  },
  methods: {
    handleNotification () {
      NotificationService.$on('showNotification', (message) => {
        this.message = message;
        this.hidden = false;
      });
    },
    closeNotification () {
      this.hidden = true;
      setTimeout(() => {
        this.message = '';
      }, 200);
    }
  }
};
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  right: 60px;
  top: 124px;
  background-color: white;
  z-index: 999;
  border-radius: 4px;
  border: 1px solid #2E7D32;
  padding: 25px;
  display: flex;
  align-items: center;
  align-content: center;
  font-family: $font-roboto-light;
  transition: opacity 0.2s;
  opacity: 1;

  .icon {
    width: 15px;
    height: 15px;
    margin-left: 25px;
  }

  &.hidden {
    opacity: 0;
  }
}
</style>
