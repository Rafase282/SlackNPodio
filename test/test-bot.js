'use strict';

//Require the dev-dependencies
const chai = require('chai');
const app = {
  bot: require('../bot/bot'),
  helper: require('../bot/helper')
};
const expect = require('expect');
const item = require('./item').items[0];
chai.should();

//Globals
const url = 'https://podio.com/ghold/seanlouistestspace/apps/podioapp/items/2';

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
    app.bot.getStatus('Another', 'Status')
      .then((res)=>{
        expect(res)
          .toBeA('string', 'It should return a message with the url.')
          .toEqual(msg, 'It has to be the same message.');
      })
      done();
  })
  it('Sets field value for item', (done) => {
    app.bot.setStatus('Another', 'Status', 'Live')
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
      .toBeA('number', 'It should return a number.')
      done();
  })
});
