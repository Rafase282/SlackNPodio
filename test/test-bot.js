'use strict';

//Require the dev-dependencies
const bot = require('../bot/bot');
const helper = require('../bot/helper');
const expect = require('expect');
const item = require('./item').items[0];
const app = {bot, helper};

//Globals
const url = item.link;

describe('Test Functions from Bot', () => {
  it('Retrievs "Another" Item', (done) => {
    const res = app.bot.getPodioItem('Another');
    expect(res)
      .toBeA('object', 'The result should be an object.');
    done();
  });
  it('Provides message with Item\' url', (done) => {
    const msg = `Item: Another, Item Link: ${url}`;
    app.bot.getURL('Another')
      .then((res)=>{
        expect(res)
          .toBeA('string', 'It should return a message with the url.')
          .toEqual(msg, 'It has to be the same message.');
      })
      done();
  })
  it('Retrieves field\' value for Specified item', (done) => {
    app.bot.getValue('Another', 'Status')
      .then((res)=>{
        expect(res)
          .toBeA('string', 'It should return a message with the url.')
          .toEqual(msg, 'It has to be the same message.');
      })
      done();
  })
  it('Sets field value for item', (done) => {
    app.bot.setValue('Another', 'Status', 'Live')
      .then((res)=>{
        expect(res)
          .toBeA('string', 'It should return a message with the url.')
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
      .toBeA('string', 'It should return url string.');
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
});
