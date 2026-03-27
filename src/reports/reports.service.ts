import { Injectable } from '@nestjs/common';
import { PrinterService } from '../printer/printer.service';
import { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import { ExpensesService } from 'src/expenses/expenses.service';
import { User } from 'src/auth/entities/user.entity';
import { SearchExpenseDto } from 'src/expenses/dto/search-expense.dto';
import { ReportByFilter } from './documents/ReportByFilter';

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

    const docDefinition: TDocumentDefinitions = ReportByFilter(expenses);

    return this.printerService.createPdf(docDefinition);
  }
}
