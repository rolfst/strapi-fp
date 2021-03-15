import Vue from 'vue';

export const NotificationService = new Vue({
  methods: {
    showNotification (message) {
      this.$emit('showNotification', message);
    }
  }
});
