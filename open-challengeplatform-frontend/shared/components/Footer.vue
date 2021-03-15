<template>
  <div class="footer">
    <div class="flex-container">
      <div class="footer-col" }>
        <h3>{{ $t('offices') }}</h3>
        <ul>
          <li><a href="https://www.kvk.nl/service-en-contact/kvk-kantoor-amsterdam/">Amsterdam</a></li>
          <li><a href="https://www.kvk.nl/service-en-contact/kvk-kantoor-arnhem">Arnhem</a></li>
          <li><a href="https://www.kvk.nl/service-en-contact/kvk-kantoor-eindhoven">Eindhoven</a></li>
          <li><a href="https://www.kvk.nl/service-en-contact/kvk-kantoor-groningen">Groningen</a></li>
          <li><a href="https://www.kvk.nl/service-en-contact/kvk-kantoor-rotterdam">Rotterdam</a></li>
          <li><a href="https://www.kvk.nl/service-en-contact/kvk-kantoor-utrecht">Utrecht</a></li>
          <li><a href="https://www.kvk.nl/service-en-contact/#kantoren-overzicht">{{ $t('footer--all-offices') }}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Over KVK</h3>
        <ul>
          <li><a href="https://www.kvk.nl/over-kvk/">Over de organisatie</a></li>
          <li><a href="https://www.kvk.nl/over-kvk/media-en-pers/">Pers</a></li>
          <li><a href="https://werkenbij.kvk.nl/">Werken bij</a></li>
          <li><a href="https://www.kvk.nl/over-kvk/over-het-handelsregister/">Over het Handelsregister</a></li>
          <li><a href="https://www.kvk.nl/over-kvk/nieuw-op-kvknl/">Updates KVK.nl</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Blijf op de hoogte</h3>
        <ul>
          <li>Nooit meer het laatste ondernemersnieuws missen</li>
          <li>
            <a href="https://www.kvk.nl/over-kvk/nieuwsbrief/"><span class="petrol bold">Meld je aan</span></a> voor onze nieuwsbrieven
          </li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Ondernemersplein</h3>
        <ul>
          <li>Informatie en advies van de overheid voor ondernemers</li>
          <li>
            KVK is partner van
            <a href="https://ondernemersplein.kvk.nl/"><span class="petrol bold">Ondernemersplein</span></a>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex-container">
      <div class="end social">
        <a href="https://www.facebook.com/kamervankoophandel">
          <img
            src="~assets/images/facebook.svg"
            class="footer--icon filter-primary-purple"
            alt=""
            title=""
          >
        </a>
        <a href="http://www.linkedin.com/company/kamer-van-koophandel">
          <img
            src="~assets/images/linkedin.svg"
            class="footer--icon filter-primary-purple"
            alt=""
            title=""
          >
        </a>
        <a href="https://twitter.com/KvK_NL">
          <img
            src="~assets/images/twitter.svg"
            class="footer--icon filter-primary-purple"
            alt=""
            title=""
          >
        </a>
        <a href="https://www.youtube.com/user/DeKamerVanKoophandel">
          <img
            src="~assets/images/youtube.svg"
            class="footer--icon filter-primary-purple"
            alt=""
            title=""
          >
        </a>
      </div>
    </div>
    <div class="flex-container">
      <hr class="divider">
      <div class="col-1-2 footer-logo svg-blue">
        <img
          src="~assets/images/footer_logo.svg"
          alt=""
          title=""
        >
      </div>
      <div class="end footer-items">
        <ul class="items-list">
          <li><a href="https://www.kvk.nl/privacy/">Privacy</a></li>
          <li><a href="https://www.kvk.nl/privacy/cookies/">Cookies</a></li>
          <li><a href="https://www.kvk.nl/disclaimer/">Disclaimer</a></li>
          <li><a href="https://www.kvk.nl/english/">English</a></li>
          <li><a href="https://www.kvk.nl/toegankelijkheid/">Toegankelijkheid</a></li>
          <li>ID: 0000</li>
        </ul>
      </div>
    </div>
    <div class="footer-gradient" />
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.footer {
  background: #EFEFEF;
  padding-top: 1em;

  .flex-container {
    margin-top: 1em;
    margin-bottom: 0;
  }
  .footer-gradient {
    height: 0.5rem;
    background-image: -webkit-gradient(
      linear,
      left top,
      right top,
      from(#aa418c),
      to(#ff9300)
    );
    background-image: linear-gradient(to right, #aa418c, #ff9300);
    width: 100%;
  }

  .footer-col {
    width: 235px;
  }
  .footer-logo {
    height: 2em;
    margin-top: 0.5em;
  }

  .divider {
    margin-top: 0;
    margin-bottom: 0;
  }

  ul {
    list-style: none;
    padding-left: 0;

    li {
      margin-left: 0;
      line-height: 1.8em;
    }
  }

  a {
    text-decoration: none;
    color: black;

    &:hover {
      text-decoration: underline;
    }
  }

  .footer--icon {
    @extend .svg-purple;
    height: 2em;
    width: 2em;
    transition: all 0.2s;

    &:hover {
      height: 2.5em;
      width: 2.5em;
    }
  }

  .social {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 180px;
    height: 2.5em;
    justify-self: flex-end;
    margin-left: auto;
  }

  .svg-purple {
    filter: invert(36%) sepia(8%) saturate(6440%) hue-rotate(272deg)
      brightness(91%) contrast(86%);
    --webkit-filter: invert(36%) sepia(8%) saturate(6440%) hue-rotate(272deg)
      brightness(91%) contrast(86%);
  }

  .svg-blue {
    filter: invert(21%) sepia(39%) saturate(2584%) hue-rotate(166deg)
      brightness(99%) contrast(102%);
  }

  .footer-items {
    .items-list {
      margin-top: 0;
      color: $color-gray-80;
      font-weight: 300;
      font-size: 14px;
      li {
        display: inline;
        margin-left: 1em;
        a{
          color: $color-gray-80;
          font-weight: 300;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
