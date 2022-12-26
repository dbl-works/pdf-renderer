import Format from "./format";

export default class Options {
  content: string;

  filename: string;

  saveFile: boolean;

  pdfMarkup: string;

  format: Format;

  constructor(
    content: string,
    filename = `${Date.now()}`,
    saveFile = true,
    format = new Format()
  ) {
    this.content = content;
    this.saveFile = saveFile;
    this.pdfMarkup = "";
    this.filename = filename;
    this.format = format;

    if (!this.filename.match(/\.pdf$/)) {
      this.filename += ".pdf";
    }
  }
}
