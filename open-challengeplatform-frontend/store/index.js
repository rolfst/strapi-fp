export const state = () => ({
  eventSlug: undefined
});

export const mutations = {
  setEventSlug (state, slug) {
    state.eventSlug = slug;
  },
  removeEventSlug (state) {
    state.eventSlug = '';
  }
};

export const getters = {
  getEventSlug (state) {
    return state.eventSlug;
  }
};
