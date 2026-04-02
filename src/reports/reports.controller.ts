import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import type { Response } from 'express'; // Import type para evitar errores de TS
import { Auth } from 'src/auth/decorators/auth.decorator';
import { SearchExpenseDto } from 'src/expenses/dto/search-expense.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('bill')
  @Auth()
  async getBillReports(
    @Query() searchDto: SearchExpenseDto,
    @GetUser() user: User,
    @Res() response: Response,
  ) {
    try {
      const pdf = await this.reportsService.getBillReport(searchDto, user);

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

  @Get('report-category')
  @Auth()
  async getReportCategory(
    @Query() searchDto: SearchExpenseDto,
    @GetUser() user: User,
    @Res() response: Response,
  ) {
    try {
      const pdf = await this.reportsService.getReportByCategory(
        searchDto,
        user,
      );

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

    return;
  }
}
