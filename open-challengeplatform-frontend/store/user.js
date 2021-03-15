export const state = () => ({
  user: {}
});

export const mutations = {
  set (state, user) {
    state.user = user;
  }
};
