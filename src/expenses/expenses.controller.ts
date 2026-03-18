import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { SearchExpenseDto } from './dto/search-expense.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  findAll(@Query() searchDto: SearchExpenseDto) {
    return this.expensesService.findAll(searchDto);
  }

  @Get('categories-analysis')
  getCategoriesAnalysis(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expensesService.getCategoryBreakdown(startDate, endDate);
  }

  @Get('balance')
  getAnalysis(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expensesService.getAnalysis(startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
