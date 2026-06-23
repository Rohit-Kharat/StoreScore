import { Controller, Get, Post, Body, Query, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // Admin can create a new store
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  // Store Owners can fetch their own store metrics and rating logs
  @Get('my-store')
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  async getMyStore(@Request() req) {
    return this.storesService.findByOwnerId(req.user.id);
  }

  // Any logged-in user can browse stores (supports search name/address and sorting)
  @Get()
  async findAll(
    @Request() req,
    @Query('name') name?: string,
    @Query('address') address?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.storesService.findAll(req.user.id, { name, address }, sortField, sortOrder);
  }

  // Admin can view store details by ID
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.findById(id);
  }
}
