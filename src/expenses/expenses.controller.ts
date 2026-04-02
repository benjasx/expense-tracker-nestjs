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
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Auth()
  create(@Body() createExpenseDto: CreateExpenseDto, @GetUser() user: User) {
    return this.expensesService.create(createExpenseDto, user);
  }

  @Get()
  @Auth()
  findAll(@Query() searchDto: SearchExpenseDto, @GetUser() user: User) {
    return this.expensesService.findAll(searchDto, user);
  }

  @Get('categories-analysis')
  @Auth()
  async getCategoriesAnalysis(
    @GetUser() user: User,
    @Query() searchDto: SearchExpenseDto,
  ) {
    return this.expensesService.getCategoryBreakdown(user, searchDto);
  }

  @Get('balance')
  @Auth()
  getAnalysis(@GetUser() user: User, @Query() searchDto: SearchExpenseDto) {
    return this.expensesService.getAnalysis(user, searchDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @GetUser() user: User,
  ) {
    return this.expensesService.update(id, updateExpenseDto, user);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
