// src/utils/fileHandler.js
const fs = require('fs');
const { promisify } = require('util');
const writeFileAtomic = require('write-file-atomic');
const readFileAsync = promisify(fs.readFile);

async function readFile(filePath) {
  try {
    const data = await readFileAsync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeFile(filePath, data) {
  await writeFileAtomic(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  readFile,
  writeFile
};