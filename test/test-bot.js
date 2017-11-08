/* global describe, it */

'use strict';

//Require the dev-dependencies
const podio = require('../bot/podio');
const helper = require('../bot/helper');
const bot = require('../bot/bot');
const app = {podio, helper, bot};
const expect = require('expect');
const item = require('./item').items[0];
const files = require('./files');

//Globals
const url = item.link;
const files_title = `*List of up to 3 files from items sorted by name in descending order, page 0:*\n`
const list_of_files = `*File:* Web Developer Resume.pdf, *size:* 135218 kb, *link:* https://files.podio.com/323317004
*File:* Web Developer Resume.docx, *size:* 21554 kb, *link:* https://files.podio.com/325016329
*File:* jerry-seinfeld-deal-with-it1.gif, *size:* null, *link:* https://app.box.com/s/vwsd80f6tov1cnxoeuoid5ar3qlysv48\n`;

describe('Test Functions from Bot', () => {
  it('Retrievs "Another" Item', (done) => {
    const res = app.podio.getPodioItem('Another');
    expect(res)
      .toBeA('object', 'The result should be an object.');
    done();
  });
  it('Provides message with Item\' url', (done) => {
    const msg = `Item: Another, Item Link: ${url}`;
    app.podio.getURL('Another')
      .then((res)=>{
        expect(res)
          .toBeA('string', 'It should return a message with the url.')
          .toEqual(msg, 'It has to be the same message.');
      })
      done();
  })
  it('Retrieves field\' value for Specified item', (done) => {
    const msg = `Item: Another, Field: Status, Value: Live`;
    app.podio.getValue('Another', 'Status')
      .then((res)=>{
        expect(res)
          .toBeA('string', 'It should return a message with the url.')
          .toEqual(msg, 'It has to be the same message.');
      })
      done();
  })
  it('Sets field value for item', (done) => {
    app.podio.setValue('Another', 'Status', 'Live')
      .then((res)=>{
        expect(res)
          .toBeA('string', 'It should return a message with the url.')
      })
      done();
  })
  it('Get a llist of files in the app', (done) => {
    app.podio.getFiles('item', 3, 'name', 0, true)
      .then((res)=>{
        expect(res)
          .toBeA('string', 'It should return a message with rich format.')
          .toEqual(files_title + list_of_files, `It should be the same as ${files_title + list_of_files}`);
      })
      done();
  })
});

describe('Test helper functions', () => {
  it('Retrieves the url from an item\' object', (done) => {
    expect(app.helper.getURL(item))
      .toBeA('string', 'It should return url string.')
      .toEqual(url, `It should be equal to ${url}`);
      done();
  })
  it('Shows help message', (done) => {
    expect(app.helper.showHelp())
      .toBeA('string', 'It should return a help message.');
      done();
  })
  it('Retrieves ID for the category value', (done) => {
    const options = item.fields[1].config.settings.options;
    const res = app.helper.getFieldValueID(options, 'Groomed');
    expect(res)
      .toBeA('number', 'It should return a string.');
      done();
  })
  it('Retrieves the right field by label or text values', (done) => {
    const res = app.helper.filterFields(item.fields, 'Status');
    expect(res)
      .toBeA('object', 'It should return a object.');
      done();
  })
  it('Retrieves the field id', (done) => {
    const res = app.helper.getFieldID(item, 'Status');
    expect(res)
      .toBeA('number', 'It should return a number.');
      done();
  })
  it('Retrieves the item id', (done) => {
    expect(app.helper.getItemID(item))
      .toBeA('number', 'It should return a number.');
      done();
  })
  it('Retrieves the right response (number, string, object, etc)', (done) => {
    expect(app.helper.checkValue(item.fields[0].values[0].value))
      .toBeA('string', 'It should return a title string.')
      .toEqual('Another', 'It should be equal to "Another"');
    expect(app.helper.checkValue(item.fields[1].values[0].value))
      .toBeA('string', 'It should return a category text.')
      .toEqual('Live', 'It should be equal to "Another"');
    expect(app.helper.checkValue(item.fields[3].values[0].value))
      .toBeA('number', 'It should return a number.')
      .toEqual(282, 'It should be equal to 282');
    expect(JSON.parse(app.helper.checkValue(item.fields[4].values[0].value)))
      .toBeA('object', 'It should return an object.');
    done();
  })
  it('Retrieves file information from response', (done) => {
    expect(app.helper.listFiles(files))
      .toBeA('string', 'It should return richt text using markdown')
      .toEqual(list_of_files, `The string should be ${list_of_files}`)
    expect(app.helper.listFiles(files).length)
      .toEqual(list_of_files.length, `The string should be ${list_of_files.length} characters long`)
    done();
  })
});
