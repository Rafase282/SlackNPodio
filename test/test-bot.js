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
const files_title = `*List of up to 3 files from items sorted by name in descending order, page 0:*\n`
const list_of_files = `*File:* Web Developer Resume.pdf, *size:* 135218 kb, *link:* https://files.podio.com/323317004
*File:* Web Developer Resume.docx, *size:* 21554 kb, *link:* https://files.podio.com/325016329
*File:* jerry-seinfeld-deal-with-it1.gif, *size:* null, *link:* https://app.box.com/s/vwsd80f6tov1cnxoeuoid5ar3qlysv48\n`;

describe('Test Functions from Bot', () => {
  it('Retrievs "M-HP-6" Item', (done) => {
    app.podio.showAllFields("[M-HP-6] Mobile Homepage [Facelift]")
      .then((res) => {
        console.log(res)
        expect(res)
          .toBeA('object', 'The result should be an object.');
      })
    done();
  });
  it('Retrieves field\' value for Specified item', (done) => {
    const msg = `Item: Another, Field: Status, Value: Live`;
    app.podio.getValue('Another', 'Status')
      .then((res) => {
        expect(res)
          .toBeA('string', 'It should return a message with the url.')
          .toEqual(msg, 'It has to be the same message.');
      })
      done();
  })
  it('Sets field value for item', (done) => {
    app.podio.setValue('Another', 'Status', 'Live')
      .then((res) => {
        expect(res)
          .toBeA('string', 'It should return a message with the url.')
      })
      done();
  })
  it('Get a list of files in the app', (done) => {
    app.podio.getFiles('item', 3, 'name', 0, true)
      .then((res) => {
        expect(res)
          .toBeA('string', 'It should return a message with rich format.')
          .toEqual(files_title + list_of_files, `It should be the same as ${files_title + list_of_files}`);
      })
      done();
  })
});