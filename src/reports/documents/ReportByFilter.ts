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
  const rows = expenses.map((exp) => {
    const isIngreso = exp.categoria?.tipo === 'ingreso';
    const montoFormateado = currencyFormatter.format(exp.monto);

    return [
      exp.fecha.toString(),
      exp.descripcion,

      {
        text: isIngreso ? 'INGRESO' : 'GASTO',
        bold: true,
        alignment: 'center' as const,
        color: '#333333',
      },
      exp.categoria?.nombre || 'S/C',

      {
        text: montoFormateado,
        alignment: 'right' as const,
        bold: true,
        noWrap: true,

        color: isIngreso ? '#2e5b9a' : '#e74c3c',
      },
    ];
  });

  const tableBody = [
    [
      { text: 'Fecha', style: 'tableHeader' },
      { text: 'Descripción', style: 'tableHeader' },
      { text: 'Categoría', style: 'tableHeader' },
      { text: 'tipo', style: 'tableHeader' },
      { text: 'Monto', style: 'tableHeader' },
    ],
    ...rows,
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
            // COLUMNA IZQUIERDA: Info del Usuario
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
            // COLUMNA DERECHA: La Mini Tabla pegada al borde
            width: 'auto',
            table: {
              widths: ['*', 80], // Ajusta estos valores para que el ancho total te guste
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
              hLineWidth: (i) => 0.5,
              vLineWidth: (i) => 0.5,
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

      //Tabla
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'], // '*' hace que la descripción use el espacio sobrante
          body: tableBody,
        },
        layout: 'lightHorizontalLines', // Le da un toque muy limpio
      },
    ],
    styles: styles,
  };
};
