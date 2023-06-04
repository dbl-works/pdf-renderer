import Format from './format'

export default class Options {
  content: string;

  filename: string;

  saveFile: boolean;

  pdfMarkup: string;

  format: Format;

  fileType: string;

  // imageDimension: any;

  constructor(
    content: string,
    filename = `${Date.now()}`,
    saveFile = true,
    format = new Format(),
    fileType = 'pdf',
  ) {
    this.content = content
    this.saveFile = saveFile
    this.pdfMarkup = ''
    this.filename = filename
    this.format = format
    this.fileType = fileType

    if (!this.filename.match(/\.pdf$/)) {
      this.filename += '.pdf'
    }
  }
}
