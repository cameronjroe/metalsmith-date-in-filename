var _ = require('lodash');
var assert = require('assert');
var Metalsmith = require('metalsmith');
var dateInFilename = require('..');

function buildDone(done) {
    return function (err) {
        if (err) {
            return done(err);
        }

        done();
    }
}

describe('metalsmith-date-in-filename', function () {
    it('should add date to meta if it\'s present in filename', function (done) {
        var metalsmith = Metalsmith('test/fixtures/assorted_posts');
        metalsmith
            .use(dateInFilename({override: false}))
            .use(function (files, metalsmith, done) {
                _.forEach(files, function (fileMeta, fileName) {
                    switch (fileName) {
                        case '2014-11-04-four.md':
                            assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                        case '20141104-six.md':
                            assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                    }
                });
                done();
            })
            .build(buildDone(done));
    });
    it('should work with different date placements', function(done) {
        var metalsmith = Metalsmith('test/fixtures/filenames');
        metalsmith
            .use(dateInFilename(true))
            .use(function (files, metalsmith, done) {
                _.forEach(files, function (fileMeta, fileName) {
                    assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                });
                done();
            })
            .build(buildDone(done));
    });
    it('should add date to meta if it\'s present in filename, but shouldn\'t override if it\'s already present in front matter', function(done) {
        var metalsmith = Metalsmith('test/fixtures/assorted_posts');
        metalsmith
            .use(dateInFilename({override: false}))
            .use(function (files, metalsmith, done) {
                _.forEach(files, function (fileMeta, fileName) {
                    switch (fileName) {
                        case 'one.md':
                            assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                        case '2014-11-04-two.md':
                            assert.equal((new Date('11-01-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                        case 'three.md':
                            assert.equal(undefined, fileMeta.date);
                            break;
                        case '2014-11-04-four.md':
                            assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                        case '20141104-five.md':
                            assert.equal((new Date('11-01-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                        case '20141104-six.md':
                            assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                    }
                });
                done();
            })
            .build(buildDone(done));
    });
    it('should add date to meta if it\'s present in filename, and it should override if it\'s already present in front matter', function(done) {
        var metalsmith = Metalsmith('test/fixtures/assorted_posts');
        metalsmith
            .use(dateInFilename({override: true}))
            .use(function (files, metalsmith, done) {
                _.forEach(files, function (fileMeta, fileName) {
                    switch (fileName) {
                        case 'one.md':
                            assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                        case '2014-11-04-two.md':
                            assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                        case 'three.md':
                            assert.equal(undefined, fileMeta.date);
                            break;
                        case '2014-11-04-four.md':
                            assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                        case '20141104-five.md':
                            assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                        case '20141104-six.md':
                            assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                    }
                });
                done();
            })
            .build(buildDone(done));
    });
    it('passing `false` is shorthand for setting `override` option to `false`', function(done) {
        var metalsmith = Metalsmith('test/fixtures/single_post_with_disparate_dates');
        metalsmith
            .use(dateInFilename(false))
            .use(function (files, metalsmith, done) {
                _.forEach(files, function (fileMeta, fileName) {
                    switch (fileName) {
                        case '2014-10-02-one.md':
                            assert.equal((new Date('11-04-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                    }
                });
                done();
            })
            .build(buildDone(done));
    });
    it('passing `true` is shorthand for setting `override` option to `true`', function(done) {
        var metalsmith = Metalsmith('test/fixtures/single_post_with_disparate_dates');
        metalsmith
            .use(dateInFilename(true))
            .use(function (files, metalsmith, done) {
                _.forEach(files, function (fileMeta, fileName) {
                    switch (fileName) {
                        case '2014-10-02-one.md':
                            assert.equal((new Date('10-02-2014')).toISOString(), new Date(fileMeta.date).toISOString());
                            break;
                    }
                });
                done();
            })
            .build(buildDone(done));
    });
});
