import type { TDocumentDefinitions, StyleDictionary } from 'pdfmake/interfaces';
import { CategoryAnalysis } from '../types/ReportByCategory.type';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const styles: StyleDictionary = {
  header: { fontSize: 20, bold: true, color: '#1A237E', margin: [0, 0, 0, 5] },
  subheader: { fontSize: 10, color: '#666', margin: [0, 0, 0, 20] },
  tableHeader: {
    bold: true,
    fontSize: 11,
    color: 'white',
    fillColor: '#212121',
    margin: [0, 6, 0, 6],
  },
  catName: { fontSize: 9, bold: true, margin: [0, 8, 0, 0] },
  catType: { fontSize: 7, bold: true, color: '#888' },
};

export const ReportByCategory = (
  expenseByCategory: CategoryAnalysis[],
): TDocumentDefinitions => {
  const maxTotal = Math.max(...expenseByCategory.map((item) => item.total), 1);
  const chartAreaWidth = 280; // Ancho total de la barra de referencia

  const chartRows: any[][] = expenseByCategory.map((item) => {
    const isIngreso = item.tipo === 'ingreso';
    const barWidth = (item.total / maxTotal) * chartAreaWidth;

    return [
      {
        // Columna 1: Nombre y Tipo
        stack: [
          { text: item.categoria.toUpperCase(), style: 'catName' },
          { text: isIngreso ? '📥 INGRESO' : '📤 GASTO', style: 'catType' },
        ],
      },
      {
        // Columna 2: Gráfica Moderna
        stack: [
          {
            margin: [0, 10, 0, 0],
            canvas: [
              // Barra de fondo (Gris claro / Referencia)
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: chartAreaWidth,
                h: 10,
                r: 5,
                color: '#F5F5F5',
              },
              // Barra de progreso (Color dinámico)
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: barWidth,
                h: 10,
                r: 5,
                color: isIngreso ? '#2e5b9a' : '#e74c3c',
              },
            ],
          },
          {
            text: currencyFormatter.format(item.total),
            fontSize: 10,
            bold: true,
            margin: [0, 4, 0, 8],
            color: '#333',
          },
        ],
      },
    ];
  });

  return {
    header: {
      text: 'Benjasx98 - Business Intelligence',
      alignment: 'right',
      margin: [20, 15],
      fontSize: 8,
      color: '#999',
    },
    content: [
      { text: 'ANÁLISIS ESTRATÉGICO', style: 'header' },
      {
        text: 'Distribución financiera por categorías operativas.',
        style: 'subheader',
      },

      {
        table: {
          widths: [140, '*'],
          body: [
            [
              { text: 'CONCEPTO', style: 'tableHeader', alignment: 'left' },
              {
                text: 'RENDIMIENTO VISUAL',
                style: 'tableHeader',
                alignment: 'left',
              },
            ],
            ...chartRows,
          ],
        },
        layout: {
          hLineWidth: (i) => (i === 1 ? 1 : 0.5),
          vLineWidth: () => 0,
          hLineColor: (i) => (i === 1 ? '#000' : '#E0E0E0'),
          paddingTop: () => 5,
          paddingBottom: () => 5,
        },
      },

      // Leyenda minimalista
      {
        margin: [0, 30, 0, 0],
        columns: [
          {
            width: 'auto',
            canvas: [
              { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 2, color: '#2e5b9a' },
            ],
          },
          { text: 'Ingresos Operativos', fontSize: 8, margin: [5, 0, 20, 0] },
          {
            width: 'auto',
            canvas: [
              { type: 'rect', x: 0, y: 0, w: 8, h: 8, r: 2, color: '#e74c3c' },
            ],
          },
          { text: 'Gastos y Deducciones', fontSize: 8, margin: [5, 0, 0, 0] },
        ],
      },
    ],
    styles: styles,
  };
};
