#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const extPackageJson = require('../package.json');
const DEST_DIR = path.join(__dirname, '../dist');
const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip');

const extractExtensionData = () => ({
  name: extPackageJson.name,
  version: extPackageJson.version,
  env: process.env.NODE_ENV === 'test' ? 'test' : '',
  pack_env:  process.env.PACK_ENV || '',
});

const makeDestZipDirIfNotExists = () => {
  if (!fs.existsSync(DEST_ZIP_DIR)) {
    fs.mkdirSync(DEST_ZIP_DIR)
  }
};

const buildZip = (src, dist, zipFilename) => {
  console.info(`Building ${zipFilename}...`)

  const output = fs.createWriteStream(path.join(dist, zipFilename));
  const archive = archiver('zip');
  archive.pipe(output);
  archive.directory(src, false);
  archive.finalize();
};

const main = () => {
  const { name, version, env, pack_env } = extractExtensionData();
  // const zipFilename = `${name}-v${version}.zip`
  let filename = `${name}${env ? '-' + env : ''}`;
  if (pack_env) {
    filename = `${name}-${pack_env}`
  }
  const zipFilename = `${filename}.chrome.zip`;

  makeDestZipDirIfNotExists();

  buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename);
};

main();
