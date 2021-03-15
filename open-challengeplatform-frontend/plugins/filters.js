import Vue from 'vue';
import { format } from 'date-fns';

Vue.filter('date', function (val) {
  const localDate = new Date(val);
  return format(localDate, 'DD/MM/YYYY HH:mm');
});

Vue.filter('limitText', function (value, limit) {
  if (value.length > limit) {
    return value.slice(0, limit) + '...';
  } else {
    return value;
  }
});
