# Acrobat Comments Parser

Simple node js script to get the comments of a pdf (written using adobe acrobat reader), extract these comments and put them inside a file with only the comments (both markdown and pdf files are generated).

### Install
```
git clone <repo_url>
cd acrobat-comments-parser
yarn install
```

### Configuration
Inside the file `utils.js` are presents the path of the folder in which put:
 
- the comments files (extracted manually from adobe reader, using the extractor provided by the program, please extract in `xfdf` format)
- partial results path, folder for the markdown autogenerated files (default: `PartialResults`)
- results path, folder for the pdf autogenerated files (default: `Results`)

### Execution
```
yarn parse
```