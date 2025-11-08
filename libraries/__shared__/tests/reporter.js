import fs from 'node:fs';


export default class CEEReporter {

  results = {};

  onTestEnd(test, result) {
    const [_, _browser, _file, framework, suite] = test.titlePath();
    ((this.results[framework] ||= {})[suite] ||= {})[result.status] ||= 0
    this.results[framework][suite][result.status] += 1;
    const weight = test.annotations.filter(({type}) => type === 'weight').toReversed()[0]?.description ?? 3;
    (this.results[framework].weight ||= {})[result.status] ||= 0;
    this.results[framework].weight[result.status] += weight
  }

  onEnd(result) {
    for (const [framework, results] of Object.entries(this.results)) {
      const basicPassed = results['basic support'].passed ?? 0;
      const basicFailed = results['basic support'].failed ?? 0;
      const advancedPassed = results['advanced support'].passed ?? 0;
      const advancedFailed = results['advanced support'].failed ?? 0;

      const weightedPassed = results.weight.passed ?? 0;
      const weightedFailed = results.weight.failed ?? 0;
      const totalWeight = weightedPassed + weightedFailed;

      fs.writeFileSync(`../../${framework}/results/results.json`, JSON.stringify({
        summary: {
          success: basicPassed + advancedPassed,
          failed: basicFailed + advancedFailed,
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
        }
      }, null, 2))
    }
  }
}