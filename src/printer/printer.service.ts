import { Injectable } from '@nestjs/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const pdfmake = require('pdfmake');

@Injectable()
export class PrinterService {
  constructor() {
    pdfmake.setUrlAccessPolicy(() => true);
    pdfmake.addFonts({
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf',
      },
    });
  }

  createPdf(docDefinition: TDocumentDefinitions) {
    return pdfmake.createPdf(docDefinition);
  }
}
