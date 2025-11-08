import fs from 'node:fs';
import {test} from '@playwright/test';

export const getProp = async (ce, name) => {
  return await (await (await ce.elementHandle()).getProperty(name)).jsonValue()
}

export const getPropOrAttr = async (ce, name) => {
  return await getProp(ce, name) ?? ce.getAttribute(name);
}

export const weight = (weight) => ({
  annotation: {type: 'weight', description: weight}
})

export const each = (cb) => {
  fs.readdirSync('./harness', {withFileTypes: true}).filter(d => d.isDirectory()).forEach(({name}) => {
    test.describe(name, () => {
      test.beforeEach(async ({page}) => {
        await page.goto(`/${name}/`);
      })

      cb();
    })
  })
}