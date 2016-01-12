'use strict';

var _ = require('lodash'),
    WebpackConfig = require('webpack-config'),
    CompilerStrategyInvoker = require('./compilerStrategyInvoker'),
    GlobRunCompilerStrategy = require('./globRunCompilerStrategy');

/**
 * @private
 * @function
 * @alias workerFarmRunWorker
 * @param {String} filename
 * @param {WorkerFarmWorkerOptions} options
 * @param {Function} callback
 */
function workerFarmRunWorker(filename, options, callback) {
    var environment = _.get(options, 'environment', {}),
        compilerOptions = _.get(options, 'compilerOptions', {}),
        webpackOptions = _.get(options, 'webpackOptions', {});

    WebpackConfig.environment.setAll(environment);

    var strategy = new GlobRunCompilerStrategy(compilerOptions, webpackOptions),
        invoker = new CompilerStrategyInvoker(strategy, {
            run: false,
            watch: false,
            stats: true,
            timings: false,
            violations: false
        });

    invoker.execute(filename, function(err, stats) {
        callback(err, {
            hasErrors: stats.hasErrors(),
            hasWarnings: stats.hasWarnings()
        });
    });
}

/**
 * @private
 * @module webpack-glob/lib/workerFarmRunWorker
 */
module.exports = workerFarmRunWorker;