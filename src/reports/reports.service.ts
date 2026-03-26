import { Injectable } from '@nestjs/common';
import { PrinterService } from '../printer/printer.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ExpensesService } from 'src/expenses/expenses.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly expensesService: ExpensesService,
  ) {}

  async getBillReport() {
    const docDefinition: TDocumentDefinitions = {
      // Metadatos del documento
      info: {
        title: 'Factura CellControl',
        author: 'Benjamin',
      },
      content: [
        { text: 'Factura' },
        { text: 'Reporte de Servicio Técnico', margin: [0, 10] },

        'Hola Benjamin, este reporte usa la lógica oficial de la v0.3',
      ],
    };

    return this.printerService.createPdf(docDefinition);
  }
}
