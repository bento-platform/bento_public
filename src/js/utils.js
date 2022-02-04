// utils.js
export const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}