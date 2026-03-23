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
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Auth()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @Auth()
  findAll(@Query() searchDto: SearchExpenseDto) {
    return this.expensesService.findAll(searchDto);
  }

  @Get('categories-analysis')
  @Auth()
  getCategoriesAnalysis(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expensesService.getCategoryBreakdown(startDate, endDate);
  }

  @Get('balance')
  @Auth()
  getAnalysis(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expensesService.getAnalysis(startDate, endDate);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
