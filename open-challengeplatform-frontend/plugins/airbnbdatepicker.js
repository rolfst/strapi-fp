import Vue from 'vue';

// import component and stylesheet
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker';
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css';

// see docs for available options
const datepickerOptions = {};

// make sure we can use it in our components
Vue.use(AirbnbStyleDatepicker, datepickerOptions);
