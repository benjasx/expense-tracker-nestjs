import type {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { Expense } from 'src/expenses/entities/expense.entity';

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

export const ReportByFilter = (expenses: Expense[]): TDocumentDefinitions => {
  console.log(expenses[1]);

  const rows = expenses.map((exp) => {
    const isIngreso = exp.categoria?.tipo === 'ingreso';
    const montoFormateado = `$ ${exp.monto.toFixed(2)}`;

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

  // 2. Definimos el cuerpo de la tabla con los encabezados
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
            text: [
              { text: `Usuario: ${'John Doe'}\n`, style: 'h2' },
              { text: 'Periodo de fechas:\n', style: 'h3' },
              //TODO: Cambiar las fechas por las del filtro
              { text: `De ${'01.01.2026'} al ${'01.05.2026'}`, style: 'h3' },
            ],
          },
          {
            text: [
              { text: `Gastos del periodo: $${100}\n`, style: 'h3' },
              //TODO: Cambiar las fechas por las del filtro
              { text: `ingresos del Periodo: $${2000}\n`, style: 'h3' },
              { text: `Fondo Total: $${900}`, style: 'h3' },
            ],
            alignment: 'right',
          },
        ],
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
