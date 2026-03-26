import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import type { Response } from 'express'; // Import type para evitar errores de TS
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('bill')
  @Auth()
  async getBillReports(@Res() response: Response) {
    try {
      const pdf = await this.reportsService.getBillReport();

      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader('Content-Disposition', 'inline; filename=factura.pdf');

      const buffer = await pdf.getBuffer();
      response.end(buffer);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      if (!response.headersSent) {
        response.status(500).send('Error interno en el motor de PDF');
      }
    }
  }
}
