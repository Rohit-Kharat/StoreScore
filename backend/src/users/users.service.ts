import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (existing) {
      throw new ConflictException('A user with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const saved = await this.usersRepository.save(user);
    delete saved.password;
    return saved;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    delete user.password;
    return user;
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const isMatch = await bcrypt.compare(updatePasswordDto.oldPassword, user.password || '');
    if (!isMatch) {
      throw new BadRequestException('Incorrect current password.');
    }

    user.password = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    await this.usersRepository.save(user);
    return { message: 'Password updated successfully.' };
  }

  async findAll(
    filters: { name?: string; email?: string; address?: string; role?: string },
    sortField: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<User[]> {
    const whereClause: any = {};

    if (filters.name) {
      whereClause.name = Like(`%${filters.name}%`);
    }
    if (filters.email) {
      whereClause.email = Like(`%${filters.email}%`);
    }
    if (filters.address) {
      whereClause.address = Like(`%${filters.address}%`);
    }
    if (filters.role) {
      whereClause.role = filters.role;
    }

    // Validate sort field
    const allowedSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const field = allowedSortFields.includes(sortField) ? sortField : 'name';
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';

    const users = await this.usersRepository.find({
      where: whereClause,
      order: {
        [field]: order,
      },
    });

    // Remove passwords before returning
    return users.map((u) => {
      delete u.password;
      return u;
    });
  }

  async findOneWithStoreRating(id: number): Promise<any> {
    // We want to fetch user details. If they are a Store Owner, we retrieve their store and calculate the average rating.
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { store: { ratings: true } },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    delete user.password;

    const result: any = { ...user };
    if (user.role === UserRole.OWNER && user.store) {
      const ratings = user.store.ratings || [];
      const sum = ratings.reduce((acc, r) => acc + r.score, 0);
      const avgRating = ratings.length > 0 ? Number((sum / ratings.length).toFixed(2)) : 0;
      
      result.store = {
        id: user.store.id,
        name: user.store.name,
        email: user.store.email,
        address: user.store.address,
        averageRating: avgRating,
        totalRatings: ratings.length,
      };
      result.rating = avgRating; // To satisfy "If the user is a Store Owner, their Rating should also be displayed"
    } else if (user.role === UserRole.OWNER) {
      result.rating = 0; // Store Owner without store assigned yet
    }

    return result;
  }
}
