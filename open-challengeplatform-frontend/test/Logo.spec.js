import { mount } from '@vue/test-utils';
import Header from '@/shared/components/Header.vue';

describe('Header', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Header);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
