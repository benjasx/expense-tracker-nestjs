import { Injectable } from '@nestjs/common';
import { PrinterService } from '../printer/printer.service';
import { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import { ExpensesService } from 'src/expenses/expenses.service';
import { User } from 'src/auth/entities/user.entity';
import { SearchExpenseDto } from 'src/expenses/dto/search-expense.dto';
import { ReportByFilter } from './documents/ReportByFilter';
import { ReportByCategory } from './documents/ReportByCategoria';

@Injectable()
export class ReportsService {
  constructor(
    private readonly printerService: PrinterService,
    private readonly expensesService: ExpensesService,
  ) {}

  async getBillReport(searchDto: SearchExpenseDto, user: User) {
    const [expensesResponse, balanceData] = await Promise.all([
      this.expensesService.findAll({ ...searchDto, limit: 9000 }, user),
      this.expensesService.getAnalysis(user, searchDto),
    ]);

    const docDefinition: TDocumentDefinitions = ReportByFilter(
      expensesResponse.data,
      balanceData,
      user,
    );

    return this.printerService.createPdf(docDefinition);
  }

  async getReportByCategory(searchDto: SearchExpenseDto, user: User) {
    const expenseByCategory = await this.expensesService.getCategoryBreakdown(
      user,
      searchDto,
    );

    const docDefinition: TDocumentDefinitions = ReportByCategory(
      expenseByCategory,
      searchDto.startDate,
      searchDto.endDate,
    );

    return this.printerService.createPdf(docDefinition);
  }
}
