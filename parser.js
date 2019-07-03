const path = require('path');
const {commentsFolder, outputFile, outputPartialFile, getDirectoryFiles, getFileNameNoExtension, parseFile, appendToFile, markdownToPdf} = require('./utils')

// Script
const commentsFile = getDirectoryFiles(commentsFolder)

commentsFile.map(file => {
  let fileName = getFileNameNoExtension(file)
  appendToFile('# ' + fileName + '\n\n', fileName + '.md')
  parseFile(path.join(commentsFolder, file))
    .then(parsedFile => {
      const comments = {}
      const texts = parsedFile.xfdf.annots[0].text
      const highlights = parsedFile.xfdf.annots[0].highlight
      texts.map(comm => {
        if (comm['contents-richtext']) {
          let page = (parseInt(comm['popup'][0]['$'].page) + 1)
          let comment = comm['contents-richtext'][0].body[0].p[0].span[0]._
          if (comments[page]) {
            comments[page].push(comment)
          } else {
            comments[page] = [comment]
          }
        }
      })

      if (highlights) {
        highlights.map(comm => {
          if (comm['contents-richtext']) {
            let page = (parseInt(comm['popup'][0]['$'].page) + 1)
            let comment = comm['contents-richtext'][0].body[0].p[0].span[0]._
            if (comments[page]) {
              comments[page].push(comment)
            } else {
              comments[page] = [comment]
            }
          }
        })
      }

      let promises = Object.keys(comments).map(page => {
        let comment = '##### Pagina: ' + page + '\n'
        let pageComments = comments[page]
        pageComments.map(comm => {
          comment += '**Commento**: \n' + comm + '\n\n'
        })
        comment += '\n\n------------------\n\n'
        appendToFile(comment, fileName + '.md')
      })

      return Promise.all(promises)
        .then(() => fileName)
    })
    .then(fileName => {
      markdownToPdf(outputPartialFile, outputFile, fileName)
    })
    .catch(err => console.log(err))

})
