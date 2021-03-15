<template>
  <div class="about">
    <hero :title="$t('home--hero--title')" :description="$t('home--hero--subtitle')" :buttons="false" />
    <div class="content flex-container">
      <h2>
        {{ $t('about--content--title-1') }}
      </h2>
      <p>
        {{ $t('about--content--paragraph-1') }}
      </p>
      <br>
      <h2>
        {{ $t('about--faq--title') }}
      </h2>
      <h3>
        {{ $t('about--faq--q-1') }}
      </h3>
      <p>
        {{ $t('about--faq--a-1--paragraph-1') }}
      </p>
      <p>
        {{ $t('about--faq--a-1--paragraph-2') }}
      </p>
      <p>
        {{ $t('about--faq--a-1--paragraph-3') }}
      </p>
      <h3>
        {{ $t('about--faq--q-2') }}
      </h3>
      <p>
        {{ $t('about--faq--a-2--paragraph-1') }}
      </p>
      <ul>
        <li>{{ $t('about--faq--a-2--item-1') }}</li>
        <li>{{ $t('about--faq--a-2--item-2') }}</li>
        <li>{{ $t('about--faq--a-2--item-3') }}</li>
        <li>{{ $t('about--faq--a-2--item-4') }}</li>
      </ul>
      <h3>
        {{ $t('about--faq--q-3') }}
      </h3>
      <p>
        {{ $t('about--faq--a-3--paragraph-1') }}
      </p>
      <ul>
        <li>{{ $t('about--faq--a-3--item-1') }}</li>
        <li>{{ $t('about--faq--a-3--item-2') }}</li>
        <li>{{ $t('about--faq--a-3--item-3') }}</li>
      </ul>
      <p>
        {{ $t('about--faq--a-3--paragraph-2') }} <a href="https://kvk.instantmagazine.com/e-zines-kvk/kvk-business-challenge">{{ $t('about--faq--a-3--e-magazine') }}</a>.
      </p>
      <h3>
        {{ $t('about--faq--q-4') }}
      </h3>
      <p>
        {{ $t('about--faq--a-4') }}
      </p>
      <h3>
        {{ $t('about--faq--q-5') }}
      </h3>
      <p>
        {{ $t('about--faq--a-5') }}
      </p>
    </div>
  </div>
</template>

<script>
import Hero from '~/shared/components/Hero';

export default {
  components: {
    'hero': Hero
  }
};
</script>

<style lang="scss" scoped>
.about {
  h2 {
    margin-top: 60px;
    width: 100%;
    margin-bottom: 0;
  }

  h3 {
    margin-top: 30px;
  }

  p {
    margin: 16px 0;
  }

  ul {
    li {
      font-size: 18px;
      line-height: 32px;
      color: $color-gray-80;
    }
  }
}
</style>
