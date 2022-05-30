// utils.js
import { debug } from './constants';

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
export const debuglog = (thing) => {
  if (debug) {
    console.log(thing);
  }
};

Date.prototype.yyyydashmm = function () {
  var mm = this.getMonth() + 1; // getMonth() is zero-based

  return [this.getFullYear(), (mm > 9 ? '' : '0') + mm].join('-');
};
