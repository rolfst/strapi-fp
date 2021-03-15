<template>
  <div>
    <challenge-filter-service endpoint="challengeFilters">
      <div slot-scope="{ statusFilter: statusFilter, typeFilter: typeFilter }">
        <div class="challenge-filters">
          <div class="form-control">
            <select class="select-css _filter-personal" @change="sendStatusFilter">
              <option v-for="type in typeFilter" :key="type" :value="type">
                {{ $t(type) }}
              </option>
            </select>
          </div>
          <div class="form-control">
            <select class="select-css _filter-status" @change="sendTypeFilter">
              <option v-for="status in statusFilter" :key="status" :value="status">
                {{ $t(status) }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </challenge-filter-service>
  </div>
</template>

<script>
import ChallengeFiltersService from '../../../shared/services/ChallengeFilters-Service';

export default {
  components: {
    'challenge-filter-service': ChallengeFiltersService
  },
  methods: {
    sendStatusFilter: function (e) {
      this.$emit('challenge-status-filter', e.target.value);
    },
    sendTypeFilter: function (e) {
      this.$emit('challenge-type-filter', e.target.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.challenge-filters {
  display: flex;
  align-items: center;
  padding-top: 15px;
}

@media screen and (max-width: 960px) {
  .challenge-filters {
    flex-direction: column;
    align-items: left;
  }
}

.form-control {
  margin-right: 20px;
  .select-css {
    width: 100px;
    border: none;
    box-shadow: none;
  }

  .select-css:focus {
    outline: none;
    box-shadow: none;
  }
}
</style>
