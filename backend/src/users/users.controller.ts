import { Controller, Get, Post, Body, Param, Put, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Any logged-in user can update their password
  @UseGuards(JwtAuthGuard)
  @Put('update-password')
  async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.usersService.updatePassword(req.user.id, updatePasswordDto);
  }

  // Admin can create new users of any role directly
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Admin can list all normal and admin users, support filtering and sorting
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('role') role?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.usersService.findAll({ name, email, address, role }, sortField, sortOrder);
  }

  // Admin can view details of all users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneWithStoreRating(id);
  }
}
