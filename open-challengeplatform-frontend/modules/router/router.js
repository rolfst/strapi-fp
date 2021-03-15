import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const AllChallenges = () => import('~/pages/Challenges/Challenges').then(m => m.default || m);
const HomeComponent = () => import('~/pages/Home/Home').then(m => m.default || m);
const ProfileComponent = () => import('~/pages/Profile/Profile').then(m => m.default || m);
const SignupComponent = () => import('~/pages/Signup/Signup').then(m => m.default || m);
const ChallengeDetails = () => import('~/pages/Challenges/ChallengeDetails').then(m => m.default || m);
const NotFoundComponent = () => import('~/pages/NotFound/NotFound').then(m => m.default || m);
const NewsDetails = () => import('~/pages/News/NewsDetail').then(m => m.default || m);
const Testimonials = () => import('~/pages/Testimonials/Testimonials').then(m => m.default || m);
const TestimonialDetails = () => import('~/pages/Testimonials/TestimonialDetails').then(m => m.default || m);
const News = () => import('~/pages/News/News').then(m => m.default || m);
const SearchComponent = () => import('~/pages/SearchPage/SearchPage').then(m => m.default || m);
const AboutComponent = () => import('~/pages/About/About').then(m => m.default || m);
const CreateChallenge = () => import('~/pages/Challenges/CreateChallenge').then(m => m.default || m);

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/challenges',
        name: 'challenges',
        component: AllChallenges,
        props: (route) => ({
          tags: route.query.tags
        }),
        alias: ['/uitdagingen']
      },
      {
        path: '/createChallenge',
        name: 'createChallenge',
        component: CreateChallenge,
        props: true
      },
      {
        path: '/challenges/:id',
        name: 'challengesById',
        component: ChallengeDetails,
        props: true,
        query: true
      },
      {
        path: '/editChallenge',
        name: 'editChallenge',
        component: CreateChallenge,
        props: true
      },
      {
        path: '/challenges/:id/news/:news_id',
        name: 'newsById',
        component: NewsDetails,
        props: 'true'
      },
      {
        path: '/challenges/:id/news',
        name: 'newsOverview',
        component: News
      },
      {
        path: '/testimonials',
        name: 'testimonialOverview',
        component: Testimonials
      },
      {
        path: '/testimonials/:id',
        name: 'testimonialDetail',
        component: TestimonialDetails,
        props: true
      },
      {
        path: '/',
        name: 'home',
        component: HomeComponent,
        alias: ['/home']
      },
      {
        path: '/sign-up',
        name: 'sign-up',
        component: SignupComponent
      },
      {
        path: '/search',
        name: 'search',
        component: SearchComponent,
        props: (route) => ({
          q: route.query.q
        }),
        alias: ['/zoeken']
      },
      {
        path: '/profile',
        name: 'profile',
        component: ProfileComponent
      },
      {
        path: '/about',
        name: 'profile',
        component: AboutComponent
      },
      {
        path: '*',
        name: 'NotFound',
        component: NotFoundComponent
      }
    ]
  });
}
