// utils.js
import { debug } from "./constants"

export const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const debuglog = (thing) => {
    if (debug) {
        console.log(thing)
    }
}