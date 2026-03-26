import { Injectable } from '@nestjs/common';
import { PrinterService } from '../printer/printer.service';
import { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import { ExpensesService } from 'src/expenses/expenses.service';
import { User } from 'src/auth/entities/user.entity';
import { SearchExpenseDto } from 'src/expenses/dto/search-expense.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly expensesService: ExpensesService,
  ) {}

  async getBillReport(searchDto: SearchExpenseDto, user: User) {
    const { data: expenses } = await this.expensesService.findAll(
      { ...searchDto, limit: 9000 },
      user,
    );

    const ingresos = expenses
      .filter((e) => e.categoria.tipo === 'ingreso')
      .reduce((acc, e) => acc + e.monto, 0);

    const gastos = expenses
      .filter((e) => e.categoria.tipo === 'gasto')
      .reduce((acc, e) => acc + e.monto, 0);

    const balance = ingresos - gastos;

    const rows: TableCell[][] = expenses.map((mov) => {
      const row: TableCell[] = [
        { text: mov.fecha },
        { text: mov.descripcion },
        { text: mov.categoria.nombre },
        {
          text: mov.categoria.tipo.toUpperCase(),
          alignment: 'center',
          fillColor: mov.categoria.tipo === 'ingreso' ? '#e5e7eb' : '#f3f4f6',
          color: '#111827',
          bold: true,
        },
        {
          text: `$ ${mov.monto.toLocaleString()}`,
          alignment: 'right',
          color: mov.categoria.tipo === 'ingreso' ? '#065f46' : '#7f1d1d',
          bold: true,
        },
      ];

      return row;
    });

    const docDefinition: TDocumentDefinitions = {
      info: {
        title: 'Reporte de Movimientos',
        author: 'Benjamin',
      },

      pageOrientation: 'landscape',

      content: [
        {
          text: 'REPORTE DE MOVIMIENTOS',
          style: 'header',
        },

        {
          columns: [
            { text: `Usuario: ${user.fullName}`, style: 'subHeader' },
            {
              text: `Fecha de generación: ${new Date().toLocaleDateString()}`,
              alignment: 'right',
              style: 'subHeader',
            },
          ],
          margin: [0, 10],
        },

        {
          text: `Total de movimientos: ${expenses.length}`,
          margin: [0, 0, 0, 15],
        },

        {
          table: {
            headerRows: 1,
            widths: [90, '*', 180, 100, 120],
            body: [
              [
                { text: 'Fecha', style: 'tableHeader' },
                { text: 'Descripción', style: 'tableHeader' },
                { text: 'Categoría', style: 'tableHeader' },
                { text: 'Tipo', style: 'tableHeader', alignment: 'center' },
                { text: 'Monto', style: 'tableHeader', alignment: 'right' },
              ],
              ...rows,
            ],
          },
          layout: {
            fillColor: (rowIndex: number) => {
              if (rowIndex === 0) return '#e5e7eb'; // encabezado gris
              return rowIndex % 2 === 0 ? '#f9fafb' : null; // filas alternadas
            },
            hLineColor: () => '#d1d5db',
            vLineColor: () => '#e5e7eb',
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 6,
            paddingBottom: () => 6,
          },
        },

        {
          margin: [0, 25, 0, 0],
          table: {
            widths: ['*', 200],
            body: [
              [
                { text: 'Total Ingresos', bold: true },
                {
                  text: `$ ${ingresos.toLocaleString()}`,
                  alignment: 'right',
                  color: '#065f46',
                },
              ],
              [
                { text: 'Total Gastos', bold: true },
                {
                  text: `$ ${gastos.toLocaleString()}`,
                  alignment: 'right',
                  color: '#7f1d1d',
                },
              ],
              [
                { text: 'Balance Final', bold: true },
                {
                  text: `$ ${balance.toLocaleString()}`,
                  alignment: 'right',
                  bold: true,
                  color: balance >= 0 ? '#065f46' : '#7f1d1d',
                },
              ],
            ],
          },
          layout: 'lightHorizontalLines',
        },
      ],

      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subHeader: {
          fontSize: 10,
          color: '#374151',
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: '#111827',
        },
      },

      defaultStyle: {
        fontSize: 10,
      },
    };

    return this.printerService.createPdf(docDefinition);
  }
}
