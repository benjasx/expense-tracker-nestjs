import type {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import { ReportByFilterInterface } from '../types/ReportByFilter.type';
import { currencyFormatter } from '../helpers/currencyFormatter';

const logo: Content = {
  image: 'src/assets/logo.png',
  width: 100,
};

const styles: StyleDictionary = {
  h1: {
    fontSize: 15,
    bold: true,
    margin: [0, 5],
  },
  h2: {
    fontSize: 13,
    bold: true,
  },
  h3: {
    fontSize: 12,
    bold: true,
  },
  header: { fontSize: 18, bold: true, color: '#1A237E' },
  tableHeader: {
    bold: true,
    fontSize: 11,
    color: 'black',
    fillColor: '#F5F5F5',
    margin: [0, 5, 0, 5],
  },
};

export const ReportByFilter = (
  expenses: Expense[],
  balanceData: ReportByFilterInterface,
  user: User,
): TDocumentDefinitions => {
  // 🚩 CALCULAMOS TOTALES SOLO DE LOS FILTRADOS
  const totalIngresos = expenses
    .filter((e) => e.categoria?.tipo === 'ingreso')
    .reduce((sum, e) => sum + e.monto, 0);

  const totalGastos = expenses
    .filter((e) => e.categoria?.tipo === 'gasto')
    .reduce((sum, e) => sum + e.monto, 0);

  const rows = expenses.map((exp) => {
    const isIngreso = exp.categoria?.tipo === 'ingreso';
    const montoFormateado = currencyFormatter.format(exp.monto);

    return [
      exp.fecha.toString().split('T')[0], // Limpiamos la fecha si es ISO
      exp.descripcion,
      exp.categoria?.nombre || 'S/C',
      {
        text: isIngreso ? 'INGRESO' : 'GASTO',
        bold: true,
        alignment: 'center' as const,
        color: '#333333',
      },
      {
        text: montoFormateado,
        alignment: 'right' as const,
        bold: true,
        noWrap: true,
        color: isIngreso ? '#2e5b9a' : '#e74c3c',
      },
    ];
  });

  const tableBody: any[][] = [
    [
      { text: 'Fecha', style: 'tableHeader' },
      { text: 'Descripción', style: 'tableHeader' },
      { text: 'Categoría', style: 'tableHeader' },
      { text: 'Tipo', style: 'tableHeader', alignment: 'center' },
      { text: 'Monto', style: 'tableHeader', alignment: 'right' },
    ],
    ...rows,
    // 🚩 FILAS DE TOTALES AL FINAL DE LA TABLA
    [
      {
        text: 'TOTAL INGRESOS (FILTRADO)',
        colSpan: 4,
        alignment: 'right',
        bold: true,
        fillColor: '#f8f9fa',
        margin: [0, 5, 0, 5],
      },
      {},
      {},
      {}, // Celdas vacías por el colSpan
      {
        text: currencyFormatter.format(totalIngresos),
        alignment: 'right',
        bold: true,
        color: '#2e5b9a',
        fillColor: '#f8f9fa',
        margin: [0, 5, 0, 5],
      },
    ],
    [
      {
        text: 'TOTAL GASTOS (FILTRADO)',
        colSpan: 4,
        alignment: 'right',
        bold: true,
        fillColor: '#f8f9fa',
        margin: [0, 5, 0, 5],
      },
      {},
      {},
      {},
      {
        text: currencyFormatter.format(totalGastos),
        alignment: 'right',
        bold: true,
        color: '#e74c3c',
        fillColor: '#f8f9fa',
        margin: [0, 5, 0, 5],
      },
    ],
    [
      {
        text: 'BALANCE NETO SELECCIÓN',
        colSpan: 4,
        alignment: 'right',
        bold: true,
        fillColor: '#1A237E',
        color: '#ffffff',
        margin: [0, 5, 0, 5],
      },
      {},
      {},
      {},
      {
        text: currencyFormatter.format(totalIngresos - totalGastos),
        alignment: 'right',
        bold: true,
        fillColor: '#1A237E',
        color: '#ffffff',
        margin: [0, 5, 0, 5],
      },
    ],
  ];

  return {
    header: {
      text: 'Reporte de Movimientos',
      alignment: 'right',
      margin: [20, 20],
    },
    content: [
      logo,
      {
        text: 'Gestor de Gasto',
        style: 'h1',
      },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: `Usuario: ${user.fullName}`, style: 'h2' },
              {
                text: 'Periodo de fechas:',
                style: 'h3',
                bold: true,
                margin: [0, 5, 0, 0],
              },
              {
                text: `De ${balanceData.fechaInicio} al ${balanceData.fechaFin}`,
                style: 'h3',
              },
            ],
          },
          {
            width: 'auto',
            table: {
              widths: ['*', 80],
              body: [
                [
                  {
                    text: 'Gastos del periodo',
                    fillColor: '#000000',
                    color: '#ffffff',
                    bold: true,
                    margin: [5, 2, 5, 2],
                  },
                  {
                    text: currencyFormatter.format(balanceData.gastosPeriodo),
                    alignment: 'right',
                    margin: [5, 2, 5, 2],
                    bold: true,
                  },
                ],
                [
                  {
                    text: 'Ingresos del Periodo',
                    fillColor: '#000000',
                    color: '#ffffff',
                    bold: true,
                    margin: [5, 2, 5, 2],
                  },
                  {
                    text: currencyFormatter.format(balanceData.ingresosPeriodo),
                    alignment: 'right',
                    margin: [5, 2, 5, 2],
                    bold: true,
                  },
                ],
                [
                  {
                    text: 'Total del Periodo',
                    fillColor: '#000000',
                    color: '#ffffff',
                    bold: true,
                    margin: [5, 2, 5, 2],
                  },
                  {
                    text: currencyFormatter.format(balanceData.totalPeriodo),
                    alignment: 'right',
                    margin: [5, 2, 5, 2],
                    bold: true,
                  },
                ],
                [
                  {
                    text: 'Fondo Total',
                    fillColor: '#000000',
                    color: '#ffffff',
                    bold: true,
                    margin: [5, 2, 5, 2],
                  },
                  {
                    text: currencyFormatter.format(balanceData.fondoTotal),
                    alignment: 'right',
                    margin: [5, 2, 5, 2],
                    bold: true,
                    color: '#1A237E',
                  },
                ],
              ],
            },
            layout: {
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => '#444444',
              vLineColor: () => '#444444',
            },
          },
        ],
        margin: [0, 10, 0, 20],
      },

      {
        qr: 'https://github.com/benjasx',
        fit: 100,
        alignment: 'left',
        margin: [0, 20],
      },

      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: tableBody,
        },
        layout: 'lightHorizontalLines',
      },
    ],
    styles: styles,
  };
};
