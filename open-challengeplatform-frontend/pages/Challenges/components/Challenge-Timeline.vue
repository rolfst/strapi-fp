<template>
  <div>
    <div class="horizontal-timeline" @mouseover="showContent = true" @mouseleave="showContent = false">
      <div class="flex-container icons-label">
        <div>
          <img
            src="../../../assets/images/start.svg"
            class="icon checkpoint-image"
            :alt="timelineStartIconAltText"
            :title="timelineStartIconAltText"
          >
          <div class="point" :style="checkPointerColor($props.startDate)" />
          <p>{{ $t('start') }}</p>
        </div>
        <div v-for="stage in stages" :key="stage.id">
          <img
            v-if="stage.type === 'event'"
            src="../../../assets/images/event.svg"
            class="icon checkpoint-image"
            :alt="timelineEventIconAltText"
            :title="timelineEventIconAltText"
          >
          <img
            v-if="stage.type === 'meeting'"
            src="../../../assets/images/meeting.svg"
            class="icon checkpoint-image"
            :alt="timelineMeetingIconAltText"
            :title="timelineMeetingIconAltText"
          >
          <img
            v-if="stage.type === 'selection'"
            src="../../../assets/images/selection.svg"
            class="icon checkpoint-image"
            :alt="timelineSelectionIconAltText"
            :title="timelineSelectionIconAltText"
          >
          <div class="point" :style="checkPointerColor(stage.start)" />
          <p id="_stage-name">
            {{ stage.name }}
          </p>
        </div>
        <div>
          <img
            src="../../../assets/images/flag.svg"
            class="icon checkpoint-image"
            :alt="timelineEndIconAltText"
            :title="timelineEndIconAltText"
          >
          <div class="point" :style="checkPointerColor($props.endDate)" />
          <p>{{ $t('end') }}</p>
        </div>
        <div class="x-axis-bar" />
        <div class="x-axis-bar elapsed" :style="styleAxis" />
        <div class="point elapsed current" :style="stylePointer" />
      </div>
      <div class="flex-container hover-content">
        <challenge-journey v-if="showContent" :journey-stage="currentStage()" />
      </div>
    </div>
    <div class="vertical-timeline">
      <div class="vertical-timeline--stagesbox" :style="checkStatus($props.startDate)">
        <div class="point" :style="checkPointerColor($props.startDate)" />
        <img
          src="../../../assets/images/start.svg"
          class="icon checkpoint-image"
          :alt="timelineStartIconAltText"
          :title="timelineStartIconAltText"
        >
        <h4>{{ $t('start') }}</h4>
      </div>
      <div v-for="stage in stages" :key="stage.id">
        <div class="vertical-timeline--stagesbox" :style="checkStatus(stage.start)">
          <div class="point" :style="checkPointerColor(stage.start)" />
          <img
            v-if="stage.type === 'event'"
            src="../../../assets/images/event.svg"
            class="icon checkpoint-image"
            :alt="timelineEventIconAltText"
            :title="timelineEventIconAltText"
          >
          <img
            v-if="stage.type === 'meeting'"
            src="../../../assets/images/meeting.svg"
            class="icon checkpoint-image"
            :alt="timelineMeetingIconAltText"
            :title="timelineMeetingIconAltText"
          >
          <img
            v-if="stage.type === 'selection'"
            src="../../../assets/images/selection.svg"
            class="icon checkpoint-image"
            :alt="timelineSelectionIconAltText"
            :title="timelineSelectionIconAltText"
          >
          <h4>{{ stage.name }}</h4>
        </div>
      </div>
      <div class="vertical-timeline--stagesbox last">
        <div class="point" :style="checkPointerColor($props.endDate)" />
        <img
          src="../../../assets/images/flag.svg"
          class="icon checkpoint-image"
          :alt="timelineCheckpointIconAltText"
          :title="timelineCheckpointIconAltText"
        >
        <h4>{{ $t('end') }}</h4>
      </div>
    </div>
  </div>
</template>

<script>
import ChallengeJourney from './ChallengeJourney';
export default {
  components: {
    'challenge-journey': ChallengeJourney
  },
  props: [
    'stages',
    'timeElapsed',
    'startDate',
    'endDate'
  ],
  data () {
    return {
      showContent: false,
      timelineCheckpointIconAltText: '',
      timelineEndIconAltText: '',
      timelineEventIconAltText: '',
      timelineMeetingIconAltText: '',
      timelineSelectionIconAltText: '',
      timelineStartIconAltText: ''
    };
  },
  computed: {
    styleAxis () {
      if (this.$props.stages) {
        const check = this.percentageOfTimeElapsed();
        if (check === 100 || check === 0) {
          return;
        }
        return 'width: ' + this.calculateWidthOfAxis(this.$props.startDate, this.$props.stages, this.$props.endDate) + 'px';
      } else {
        return false;
      }
    },
    stylePointer () {
      if (this.$props.stages) {
        const check = this.percentageOfTimeElapsed();
        if (check === 100 || check === 0) {
          return;
        }
        return 'margin-left: ' + this.calculateWidthOfAxis(this.$props.startDate, this.$props.stages, this.$props.endDate) + 'px';
      } else {
        return false;
      }
    }
  },
  mounted () {
    this.translate();
  },
  methods: {
    toggleShow () {
      this.showContent = !this.showContent;
    },
    checkPointerColor (stage) {
      return 'background-color: ' + this.colorCheckPoint(stage);
    },
    checkStatus (stage) {
      return 'border-left: 3px solid ' + this.colorCheckPoint(stage);
    },
    currentStage () {
      if (this.$props.stages) {
        return this.findCurrentStage(this.$props.stages);
      }
      return '';
    },
    translate () {
      this.timelineCheckpointIconAltText = this.$i18n.t('timeline--checkpoint-icon--alt-text');
      this.timelineEndIconAltText = this.$i18n.t('timeline--end-icon--alt-text');
      this.timelineEventIconAltText = this.$i18n.t('timeline--event-icon--alt-text');
      this.timelineMeetingIconAltText = this.$i18n.t('timeline--meeting-icon--alt-text');
      this.timelineSelectionIconAltText = this.$i18n.t('timeline--selection-icon--alt-text');
      this.timelineStartIconAltText = this.$i18n.t('timeline--start-icon--alt-text');
    }
  }
};
</script>

<style lang="scss" scoped>
.x-axis-bar {
  width: 980px;
  height: 3px;
  background-color: grey;
  margin-top: -79px;
  z-index: 1;
}

.vertical-timeline--stagesbox {
  display: flex;
  min-height: 100px;
  padding-bottom: 20px;
  align-items: flex-start;
  border-left: 3px solid gray;

  .point {
    margin-left: -12px;
  }

  img {
    margin-left: 30px;
  }

  h4 {
    margin: 0;
    margin-left: 10px;
  }

  &.last {
    border-left: none;

    .point {
      margin-left: -9px;
    }
  }
}

.point {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: grey;
  z-index: 10;
}

.elapsed {
  background-color: #377f95;
}

.current {
  margin-top: 32px;
  position: absolute;
  width: 13px;
  height: 13px;
}

.hover-content {
  z-index: 99;
  width: 100%;
  position: absolute;
  margin-top: -90px;
}

.vertical-timeline {
  display: none;
}

@media screen and (max-width: 960px) {
  .horizontal-timeline {
    display: none;
  }

  .vertical-timeline {
    display: block;
  }
}
</style>
