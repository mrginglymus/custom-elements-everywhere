import fs from 'node:fs';


export default class CEEReporter {

  results = {};

  onTestEnd(test, result) {
    const [_, _browser, _file, suite] = test.titlePath();
    ((this.results ||= {})[suite] ||= {})[result.status] ||= 0
    this.results[suite][result.status] += 1;
    const weight = test.annotations.filter(({type}) => type === 'weight').toReversed()[0]?.description ?? 3;
    (this.results.weight ||= {})[result.status] ||= 0;
    this.results.weight[result.status] += weight
  }

  onEnd(result) {
    const frameworkDir = `../../${process.env.CEE_WORKSPACE}`

    const packageJson = JSON.parse(fs.readFileSync(`${frameworkDir}/package.json`, 'utf-8'));
    const pkg = packageJson.library_package
    const version = packageJson.dependencies[pkg];

    const basicPassed = this.results['basic support'].passed ?? 0;
    const basicFailed = this.results['basic support'].failed ?? 0;
    const advancedPassed = this.results['advanced support'].passed ?? 0;
    const advancedFailed = this.results['advanced support'].failed ?? 0;

    const weightedPassed = this.results.weight.passed ?? 0;
    const weightedFailed = this.results.weight.failed ?? 0;
    const totalWeight = weightedPassed + weightedFailed;

    fs.mkdirSync(`${frameworkDir}/results/`, {recursive: true})
    fs.writeFileSync(`${frameworkDir}/results/results.json`, JSON.stringify({
      summary: {
        success: basicPassed + advancedPassed,
        failed: basicFailed + advancedFailed,
        skipped: 0,
        error: false,
        disconnected: false,
        exitCode: 0,
        score: totalWeight === 0 ? 0 : 100 * weightedPassed / totalWeight,
        basicSupport: {
          total: basicPassed + basicFailed,
          failed: basicFailed,
          passed: basicPassed
        },
        advancedSupport: {
          total: advancedPassed + advancedFailed,
          failed: advancedFailed,
          passed: advancedPassed
        }
      },
      library: {
        name: pkg,
        version
      }
    }, null, 2));
    fs.writeFileSync(`${frameworkDir}/results/results.html`, `
<html>
<head>
    <meta http-equiv="refresh" content="0; url=./index.html">
</head>
</html>`);
  }
}