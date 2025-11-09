import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:8080',
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'firefox',
      use: {...devices['Desktop Firefox']},
    },
  ],
  webServer: {
    command: `http-server ../../${process.env.CEE_WORKSPACE}/dist/`,
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe'
  },
  reporter: [
    ['list'],
    ['html', {
      outputFolder: `../../${process.env.CEE_WORKSPACE}/results/`,
      open: 'never',
      title: process.env.CEE_WORKSPACE
    }],
    ['./reporter.js']
  ]
})