import { bootstrap } from '@storefront/testing';
import * as chai from 'chai';

bootstrap(chai, __dirname, [
  '../src/sort/index.html',
  '../src/past-purchases-sort/index.html'
]);
