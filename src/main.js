import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '@/App';
import routes from '@/routes';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';

import vuetify from '@/plugins/vuetify';

import moment from 'moment';
Vue.filter('shortWordDate', function(value) {
  if (value) {
    return moment(parseInt(value)).format('DD-MMM-YY')
  }
});

library.add(faUserSecret);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    linkActiveClass: 'active',
    mode: 'history'
});

new Vue({
    el: '#app',
    vuetify,
    render: h => h(App),
    router
});