/* global describe, it */

'use strict';

var assert = require('extended-assert');
var ts     = require('../lib/ts');
var g      = require('./generator');

var testPredicate = function (predicate, types) {
    it('returns false', function () {
        g.generateAllValuesExcept(types).forEach(function (value) {
            assert.strictEqual(predicate(value), false);
        });
    });

    it('returns true', function () {
        g.generateAllValues(types).forEach(function (value) {
            assert.strictEqual(predicate(value), true);
        });
    });
};

describe('ts', function () {
    describe('.checkArgument()', function () {
        var truthy = function () {
            return 1;
        };

        var falsy = function () {
            return 0;
        };

        it('returns the given value', function () {
            assert.strictEqual(ts.checkArgument('foo', truthy), 'foo');
            assert.strictEqual(ts.checkArgument('foo', truthy, 'bar'), 'foo');

            assert.strictEqual(ts.checkArgument(0, truthy), 0);
            assert.strictEqual(ts.checkArgument(0, truthy, 123), 0);

            assert.strictEqual(ts.checkArgument(null, truthy), null);
            assert.strictEqual(ts.checkArgument(void 0, truthy), void 0);
        });

        it('returns the given default value', function () {
            assert.strictEqual(ts.checkArgument(null, truthy, 'bar'), 'bar');
            assert.strictEqual(ts.checkArgument(null, falsy, 'bar'), 'bar');

            assert.strictEqual(ts.checkArgument(void 0, truthy, 'bar'), 'bar');
            assert.strictEqual(ts.checkArgument(void 0, falsy, 'bar'), 'bar');
        });

        it('throws a type error', function () {
            assert.throwsError(function () {
                ts.checkArgument('foo', falsy);
            }, 'TypeError', 'Illegal argument: "foo"');

            assert.throwsError(function () {
                ts.checkArgument('foo', falsy, 'bar');
            }, 'TypeError', 'Illegal argument: "foo"');

            assert.throwsError(function () {
                ts.checkArgument(0, falsy);
            }, 'TypeError', 'Illegal argument: 0');

            assert.throwsError(function () {
                ts.checkArgument(0, falsy, 'bar');
            }, 'TypeError', 'Illegal argument: 0');

            assert.throwsError(function () {
                ts.checkArgument(null, falsy);
            }, 'TypeError', 'Illegal argument: null');

            assert.throwsError(function () {
                ts.checkArgument(void 0, falsy);
            }, 'TypeError', 'Illegal argument: undefined');
        });

        it('passes the given value to the given predicate', function () {
            var called = 0;

            var predicate = function (value) {
                assert.strictEqual(value, 'foo');

                called += 1;

                return true;
            };

            ts.checkArgument('foo', predicate);

            assert.strictEqual(called, 1);
        });
    });

    [
        'Arguments',
        'Array',
        'Boolean',
        'Date',
        'Error',
        'Function',
        'Null',
        'Number',
        'Object',
        'RegExp',
        'String',
        'Undefined'
    ].forEach(function (type) {
        describe('.is' + type + '()', function () {
            testPredicate(ts['is' + type], [
                type
            ]);
        });
    });

    describe('.isFinite()', function () {
        var predicate = ts.isFinite;

        it('returns false', function () {
            g.generateAllValuesExcept([
                'Number'
            ]).concat([
                Infinity,
                NaN,
                -Number.MAX_VALUE,
                Number.MAX_VALUE,
                -9007199254740992,
                9007199254740992
            ]).forEach(function (value) {
                assert.strictEqual(predicate(value), false);
            });

            assert.strictEqual(predicate(0, 1, 2), false);
            assert.strictEqual(predicate(3, 1, 2), false);
        });

        it('returns true', function () {
            assert.strictEqual(predicate(Number.MIN_VALUE), true);
            assert.strictEqual(predicate(-9007199254740991), true);
            assert.strictEqual(predicate(9007199254740991), true);

            assert.strictEqual(predicate(1, 1, 2), true);
            assert.strictEqual(predicate(2, 1, 2), true);
        });
    });

    describe('.isInteger()', function () {
        var predicate = ts.isInteger;

        it('returns false', function () {
            g.generateAllValuesExcept([
                'Number'
            ]).concat([
                Infinity,
                NaN,
                Number.MIN_VALUE,
                -Number.MAX_VALUE,
                Number.MAX_VALUE,
                -9007199254740992,
                9007199254740992
            ]).forEach(function (value) {
                assert.strictEqual(predicate(value), false);
            });

            assert.strictEqual(predicate(0, 1, 2), false);
            assert.strictEqual(predicate(3, 1, 2), false);
        });

        it('returns true', function () {
            assert.strictEqual(predicate(-9007199254740991), true);
            assert.strictEqual(predicate(9007199254740991), true);

            assert.strictEqual(predicate(1, 1, 2), true);
            assert.strictEqual(predicate(2, 1, 2), true);
        });
    });

    describe('.isNaN()', function () {
        var predicate = ts.isNaN;

        it('returns false', function () {
            g.generateAllValuesExcept([
                'Number'
            ]).concat([
                Infinity,
                Number.MIN_VALUE,
                Number.MAX_VALUE
            ]).forEach(function (value) {
                assert.strictEqual(predicate(value), false);
            });
        });

        it('returns true', function () {
            assert.strictEqual(predicate(NaN), true);
        });
    });

    describe('.isVoid()', function () {
        testPredicate(ts.isVoid, [
            'Null',
            'Undefined'
        ]);
    });
});
