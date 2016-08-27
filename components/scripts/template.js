/*
 * Grab data from data.json file then
 * merge it with the id="speakerstpl" template
 * from index.html then place it in id="speakers"
 * 
 * Course: JavaScript and JSON
 * Chapter: JavaScript Templating with Mustache.js
 */
$(function() {
  var Mustache = require('mustache');

  $.getJSON('js/data.json', function(data) {
    var template = $('#speakerstpl').html();
    var html = Mustache.to_html(template, data);
    $('#speakers').html(html);    
  }); //getJSON
  
}); //function