const path = require('path');
const fs = require('fs');
const xml = require('xml2js');
let markdownPdf = require('markdown-pdf');

const sampleFile = path.join(__dirname, 'Comments', '07-JMS(1x).xfdf');
const commentsFolder = path.join(__dirname, 'Comments');
const outputPartialFile = path.join(__dirname, 'PartialResults');
const outputFile = path.join(__dirname, 'Results');

function parseFile(path) {
  const parser = new xml.Parser();
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err)
      } else {
        parser.parseString(data, (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      }
    })
  })
}

function getDirectoryFiles(directory, extension = '.xfdf') {
  return fs.readdirSync(directory).filter(file => file.indexOf(extension) !== -1)
}

function appendToFile(data, fileName) {
  fs.appendFileSync(path.join(outputPartialFile, fileName), data)
}

function getFileNameNoExtension(filename, extension = '.xfdf') {
  return filename.replace(extension, '')
}

function markdownToPdf(fileFolder, fileFolderOut, fileName) {
  fs.createReadStream(path.join(fileFolder, fileName + '.md'))
    .pipe(markdownPdf({
      remarkable: {
        breaks: true,
        html: true
      }
    }))
    .pipe(fs.createWriteStream(path.join(fileFolderOut, fileName + '.pdf')))
}

module.exports = {
  sampleFile,
  commentsFolder,
  outputPartialFile,
  outputFile,
  parseFile,
  getDirectoryFiles,
  appendToFile,
  getFileNameNoExtension,
  markdownToPdf
}
