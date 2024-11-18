import Format from './format'

export default class Options {
  filename: string

  saveFile: boolean

  pdfMarkup: string

  format: Format

  constructor(
    filename = `${Date.now()}`,
    saveFile = true,
    format = new Format(),
  ) {
    this.saveFile = saveFile
    this.pdfMarkup = ''
    this.filename = filename
    this.format = format

    if (!this.filename.match(/\.pdf$/)) {
      this.filename += '.pdf'
    }
  }
}
