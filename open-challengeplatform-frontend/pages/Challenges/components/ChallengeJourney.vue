<template>
  <div class="box-1">
    <div class="challenge-journey">
      <div class="journey-details">
        <div class="journey-details--title">
          <h4>{{ $props.journeyStage.type }}</h4>
        </div>
      </div>
    </div>
    <div class="journey-description">
      <p>Stages in the {{ $props.journeyStage.type }} are</p>
      <div class="journey-description--timelines">
        <ul>
          <li v-for="stage in $props.journeyStage.stages" :key="stage.id"> {{stage.name}} </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'journeyStage'
  ]
};
</script>

<style lang="scss" scoped>
.box-1 {
  width: 100%;
  padding: 36px 72px 36px 72px;
  background-color: white;
  box-shadow: 0 4px 6px 0 rgba(190,190,190,0.2), 0 1px 3px 0 rgba(190,190,190,0.2);
}

.challenge-journey {
  font-family: $font-roboto-light;
  display: flex;
}

.journey-details {
  display: flex;
  flex-wrap: wrap;
}

.journey-details--id__active {
  width: 35px;
  height: 26px;
  border-radius: 50%;
  background-color: #aa418c;
  color: white;
  text-align: center;
  padding-top: 9px;
}

.journey-details--id {
  width: 35px;
  height: 26px;
  border-radius: 50%;
  background-color: grey;
  color: white;
  text-align: center;
  padding-top: 9px;
}

.journey-details--title {
  margin-top: -33px;
}

.journey-details--title-duration {
  margin-top: -28px;
  color: grey;
  font-size: 14px;
}

.journey-description {
  max-width: 705px;
}

.line {
  height: 1px;
  width: 100%;
  margin-top: -10px;
  border: 2px solid #d8d8d8;
}
</style>
