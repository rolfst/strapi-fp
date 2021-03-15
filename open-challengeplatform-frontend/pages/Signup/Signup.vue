<template>
  <div class="page-title">
    <div class="center">
      <h1>{{ $t('signup--header') }}</h1>
      <p>{{ $t('signup--header--description') }}</p>
    </div>
    <form>
      <div class="row">
        <div class="form-control flex-1">
          <label>{{ $t('firstName') }}</label>
          <input type="text">
        </div>
        <div class="form-control flex-1">
          <label>{{ $t('lastName') }}</label>
          <input type="text">
        </div>
      </div>
      <div class="row">
        <div class="form-control flex-1">
          <label>{{ $t('emailAddress') }}</label>
          <input type="email">
        </div>
      </div>
      <div class="row">
        <div class="form-control flex-1">
          <label>{{ $t('password') }}</label>
          <input
            type="password"
            icon="true"
            :placeholder="passwordPlaceholder"
          >
          <img
            src="../../assets/images/filter-icon.svg"
            class="input-icon"
            :alt="passwordIconAltText"
            :title="passwordIconAltText"
          >
        </div>
        <div class="form-control flex-1">
          <label>{{ $t('password--confirm') }}</label>
          <input type="password">
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      passwordIconAltText: '',
      passwordPlaceholder: ''
    };
  },
  mounted () {
    this.translate();
  },
  methods: {
    translate () {
      this.passwordIconAltText = this.$i18n.t('password--icon--alt-text');
      this.passwordPlaceholder = this.$i18n.t('password--placeholder');
    }
  }
};
</script>

<style scoped lang="scss">
form {
  margin-top: 46px;
  margin-bottom: 46px;
}

.row {
  display: flex;
  max-width: 670px;
  flex-wrap: wrap;
  margin: 0 auto;
}

.page-title {
  padding-top: 60px;
  max-width: 660px;
  margin: 0 auto;
}

.flex-1 {
  flex: 1;
}

input[type=email] {
  width: 640px !important;
}
</style>
