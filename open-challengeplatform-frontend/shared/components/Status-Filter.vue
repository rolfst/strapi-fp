<template>
  <div class="status-filter">
    <div class="status-filter--left-menu">
      <ul>
        <li v-for="filter in $props.filters" :key="filter.value" :class="{ 'active': statusFilter === filter.value }" @click="filterResults(filter.value)">
          {{ filter.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'toggleFilter',
    'filters'
  ],
  data () {
    return {
      statusFilter: ''
    };
  },
  mounted () {
    this.statusFilter = this.$props.filters[0].value;
  },
  methods: {
    filterResults (status) {
      this.statusFilter = status;
      this.$emit('filter-condition', this.statusFilter);
    },
    openNewChallenge () {
      this.$router.push('/createChallenge');
    }
  }
};
</script>

<style lang="scss" scoped>
.status-filter {
  display: flex;
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 27px;
  flex-wrap: wrap;

  ul {
    display: inline-block;
    list-style-type: none;
    font-size: 18px;
    padding: 0;
  }

  li {
    display: inline;
    padding: 10px 24px 12px 24px;
    color: $color-gray-date-time;
    cursor: pointer;
  }

  .active {
    color: black;
    border-bottom: 6px solid #00526e;
    font-weight: bold;
  }
}

.status-filter--left-menu {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.status-filter--right-menu {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
