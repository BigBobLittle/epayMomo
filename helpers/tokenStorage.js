'use strict';
/***
 * @name TokenStorage 
 * @description the epaygh api requires a developer to auto generate an access token every 3600(1hr)
 * so i save the `access token` itself and the `expiration time` in localstorage and always check 
 * if i'ts already expired bf re-generating a new one. 
 * this file is the implementation of the various interfaces of the localstorage.
 * `REMEMBER` we dont have the browsers interface of localstorage in nodejs
 * So this is a  drop-in substitute for the browsers' native localStorage API that runs on node.js.
 */

 const LocalStorage = require('node-localstorage').LocalStorage;

 function TokenStorage() {
    this.localStorage;

    if(typeof localStorage === "undefined" || typeof localStorage === null){
      //a file with name your tokens will be generated with access token and expiry 
        this.localStorage = new LocalStorage('./your_tokens');
    }
 }


 //store the access token and expiry
 TokenStorage.prototype.store = function(data){
     this.localStorage.setItem('access_token', data.access_token);
     this.localStorage.setItem('expires_at', data.expires_at);
 }


 //get access token and expiry from locastorage 
 TokenStorage.prototype.get =  function(name) {
    return  this.localStorage.getItem(name);
 }

 //delete from localstorage 
 TokenStorage.prototype.remove = function(name) {
   return  this.localStorage.removeItem(name);
 }


// expose token storage for use in other files 
module.exports = TokenStorage

 