import Vue from 'vue';

Vue.mixin({
  methods: {
    percentageOfTimeElapsed (startDate, endDate) {
      const nowDate = new Date();
      if (new Date(startDate) - nowDate > 0) {
        return 0;
      }
      if (nowDate - new Date(endDate) > 0) {
        return 100;
      }
      return Math.abs(((new Date() - new Date(startDate)) / (new Date(endDate) - new Date(startDate))) * 100);
    },
    calculateWidthOfAxis (startDate, stages, endDate) {
      const nowDate = new Date();
      const width = 980;
      let counter = 0;
      if (new Date(nowDate) >= new Date(endDate)) {
        return width;
      }
      if (stages.length) {
        stages.forEach((stage) => {
          if (new Date(nowDate) >= new Date(stage.start)) {
            counter++;
          }
        });
      } else {
        return (this.percentageOfTimeElapsed(startDate, endDate) * width) / 100;
      }
      if (!counter) {
        return ((width / (stages.length + 1)) / 2);
      }
      return ((width * counter) / (stages.length + 1));
    },
    colorCheckPoint (startDate) {
      const nowDate = new Date();
      if (new Date(nowDate) >= new Date(startDate)) {
        return '#377F95';
      }
    },
    findCurrentStage (stages) {
      const nowDate = new Date();
      let currentIndex = 0;
      let counter = 0;
      const ideationPhase = {
        type: 'Ideation Phase',
        stages: []
      };
      const selectionPhase = {
        type: 'Selection Phase',
        stages: []
      };
      stages.forEach((stage) => {
        if (stage.type !== 'selection') {
          counter++;
        }
        if (new Date(nowDate) >= new Date(stage.start)) {
          currentIndex++;
        }
      });
      ideationPhase.stages = stages.slice(0, counter);
      selectionPhase.stages = stages.slice(counter, counter + stages.length);
      if (currentIndex > counter) {
        return selectionPhase;
      }
      return ideationPhase;
    }
  }
});
