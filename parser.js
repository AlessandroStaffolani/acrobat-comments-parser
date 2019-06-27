const path = require('path');
const { commentsFolder, outputFile, outputPartialFile, getDirectoryFiles, getFileNameNoExtension, parseFile, appendToFile, markdownToPdf} = require('./utils')

// Script
const commentsFile = getDirectoryFiles(commentsFolder)

commentsFile.map(file => {
  let fileName = getFileNameNoExtension(file)
  appendToFile('# ' + fileName + '\n\n', fileName + '.md')
  parseFile(path.join(commentsFolder, file))
    .then(parsedFile => {
      const comments = parsedFile.xfdf.annots[0].text;
      let promises = comments.map(comm => {
        if (comm['contents-richtext']) {
          let comment = '**Pagina**: ' + (parseInt(comm['popup'][0]['$'].page) + 1) + '\n';
          comment += '**Commento**: \n' + comm['contents-richtext'][0].body[0].p[0].span[0]._;
          comment += '\n\n------------------\n\n'
          appendToFile(comment, fileName + '.md')
        }
      })
      return Promise.all(promises)
        .then(() => fileName)
    })
    .then(fileName => {
      markdownToPdf(outputPartialFile, outputFile, fileName)
    })
    .catch(err => console.log(err))
  
})