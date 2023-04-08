const {sed, cat} = require('shelljs');

// Get the versionCode and versionName from the build.gradle file
const versionCode = cat('android/app/build.gradle').match(
  /versionCode (\d+)/,
)[1];
const versionName = cat('android/app/build.gradle').match(
  /versionName "([\d\.]+)"/,
)[1];

// Update the app_version and app_version_name variables in api.js
// Update app_version and app_version_name values in src/configs/api/index.js
sed(
  '-i',
  /export const app_version = .*/,
  `export const app_version = ${versionCode};`,
  'src/configs/api/index.js',
);
sed(
  '-i',
  /export const app_version_name = .*/,
  `export const app_version_name = '${versionName}';`,
  'src/configs/api/index.js',
);
