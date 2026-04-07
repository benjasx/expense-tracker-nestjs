import type { TDocumentDefinitions, StyleDictionary } from 'pdfmake/interfaces';
import { CategoryAnalysis } from '../types/ReportByCategory.type';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const styles: StyleDictionary = {
  header: { fontSize: 18, bold: true, color: '#0F172A', margin: [0, 0, 0, 2] },
  subheader: { fontSize: 10, color: '#64748B', margin: [0, 0, 0, 4] },
  dateRange: {
    fontSize: 9,
    bold: true,
    color: '#334155',
    margin: [0, 0, 0, 24],
  },
  tableHeader: {
    bold: true,
    fontSize: 9,
    color: '#F8FAFC',
    fillColor: '#1E293B',
    margin: [0, 4, 0, 4],
  },
  catName: { fontSize: 9, bold: true, color: '#1E293B', margin: [0, 6, 0, 0] },
  catType: { fontSize: 7, bold: true, margin: [0, 1, 0, 0] },
};

export const ReportByCategory = (
  expenseByCategory: CategoryAnalysis[],
  startDate?: string,
  endDate?: string,
): TDocumentDefinitions => {
  const maxTotal = Math.max(...expenseByCategory.map((item) => item.total), 1);
  const chartAreaWidth = 320;

  const formatDate = (dateStr?: string) => {
    if (!dateStr || dateStr === '') return '---';
    try {
      return format(parseISO(dateStr), "dd 'de' MMMM, yyyy", { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const chartRows: any[][] = expenseByCategory.map((item) => {
    const isIngreso = item.tipo === 'ingreso';
    const barWidth = (item.total / maxTotal) * chartAreaWidth;
    const accentColor = isIngreso ? '#0F172A' : '#EF4444'; // Azul oscuro vs Rojo vibrante

    return [
      {
        stack: [
          { text: item.categoria.toUpperCase(), style: 'catName' },
          {
            text: isIngreso ? '+ INGRESO' : '- GASTO',
            style: 'catType',
            color: accentColor,
          },
        ],
        border: [false, false, false, true],
        borderColor: '#F1F5F9',
      },
      {
        stack: [
          {
            margin: [0, 12, 0, 0],
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: chartAreaWidth,
                h: 6,
                r: 3,
                color: '#F1F5F9',
              },
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: barWidth,
                h: 6,
                r: 3,
                color: accentColor,
              },
            ],
          },
          {
            text: currencyFormatter.format(item.total),
            fontSize: 10,
            bold: true,
            margin: [0, 4, 0, 10],
            color: '#0F172A',
          },
        ],
        border: [false, false, false, true],
        borderColor: '#F1F5F9',
      },
    ];
  });

  return {
    pageSize: 'LETTER',
    pageMargins: [40, 60, 40, 60],
    header: {
      columns: [
        {
          text: 'FINANCIAL DATA SYSTEMS',
          fontSize: 7,
          color: '#94A3B8',
          margin: [40, 25],
        },
        {
          text: 'CONFIDENCIAL',
          alignment: 'right',
          fontSize: 7,
          color: '#94A3B8',
          margin: [40, 25],
        },
      ],
    },
    footer: (currentPage, pageCount) => ({
      columns: [
        {
          text: `Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
          fontSize: 7,
          color: '#94A3B8',
          margin: [40, 10],
        },
        {
          text: `Página ${currentPage} de ${pageCount}`,
          alignment: 'right',
          fontSize: 7,
          color: '#94A3B8',
          margin: [40, 10],
        },
      ],
    }),
    content: [
      {
        columns: [
          {
            stack: [
              { text: 'ANÁLISIS ESTRATÉGICO', style: 'header' },
              {
                text: 'DISTRIBUCIÓN DE FLUJO POR CATEGORÍAS',
                style: 'subheader',
              },
              {
                text: `PERIODO: ${formatDate(startDate).toUpperCase()} - ${formatDate(endDate).toUpperCase()}`,
                style: 'dateRange',
              },
            ],
          },
          {
            stack: [
              {
                text: 'BENJASX98',
                alignment: 'right',
                fontSize: 14,
                bold: true,
                color: '#0F172A',
              },
              {
                text: 'DEVELOPER SOLUTIONS',
                alignment: 'right',
                fontSize: 8,
                color: '#64748B',
              },
            ],
          },
        ],
      },

      {
        table: {
          headerRows: 1,
          widths: [120, '*'],
          body: [
            [
              {
                text: 'CATEGORÍA / TIPO',
                style: 'tableHeader',
                border: [false, false, false, false],
              },
              {
                text: 'VOLUMEN FINANCIERO (MXN)',
                style: 'tableHeader',
                border: [false, false, false, false],
              },
            ],
            ...chartRows,
          ],
        },
        layout: {
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
      },

      // Leyenda Refinada
      {
        margin: [0, 40, 0, 0],
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            stack: [
              {
                columns: [
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0,
                        y: 0,
                        w: 6,
                        h: 6,
                        r: 1,
                        color: '#0F172A',
                      },
                    ],
                    width: 10,
                  },
                  {
                    text: 'INGRESOS TOTALES',
                    fontSize: 7,
                    bold: true,
                    color: '#475569',
                    margin: [0, -1, 20, 0],
                  },
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0,
                        y: 0,
                        w: 6,
                        h: 6,
                        r: 1,
                        color: '#EF4444',
                      },
                    ],
                    width: 10,
                  },
                  {
                    text: 'GASTOS ACUMULADOS',
                    fontSize: 7,
                    bold: true,
                    color: '#475569',
                    margin: [0, -1, 0, 0],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    styles: styles,
  };
};
