<template>
  <div class="hero">
    <div class="flex-container">
      <div class="content">
        <h1 class="hero--h1">{{ title }}</h1>
        <p class="hero--p">{{ description }}</p>
        <router-link v-if="buttons" to="/challenges">
          <button class="button primary big">
            {{ $t('home--hero--see-all') }}
          </button>
        </router-link>
        <router-link v-if="buttons" to="/about">
          <button class="button big">
            {{ $t('home--hero--participate') }}
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    buttons: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="scss" scoped>
.hero {
  min-height: 650px;
  background-image: url('~assets/images/hero_background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;

  .content {
    background: white;
    align-self: center;
    padding: 24px;
    max-width: 475px;
    margin-right: auto;
    box-shadow: 0 2px 4px 0 rgba(117,117,117,0.3);
  }

  .button {
    margin-right: 16px !important;
    padding: 15px 15px;
  }

  &--h1 {
    color: $color-primary-petrol;
  }

  &--p {
    color: $color-gray-80;
  }

  .flex-container {
    margin-top: 0;
    width: 100%;
  }
}
</style>
