import { DataSource } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';
import * as bcrypt from 'bcrypt';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const storeRepository = dataSource.getRepository(Store);
  const ratingRepository = dataSource.getRepository(Rating);

  
  const userCount = await userRepository.count();
  if (userCount > 0) {
    console.log('Database already has users. Skipping seeder.');
    return;
  }

  console.log('Seeding initial database content...');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  
  const admin = userRepository.create({
    name: 'System Administrator Account', // 30 chars
    email: 'admin@example.com',
    password: hashedPassword,
    address: 'Main Admin Office, Headquarters building, Suite 101',
    role: UserRole.ADMIN,
  });

  const owner1 = userRepository.create({
    name: 'Store Owner One Account', // 24 chars
    email: 'owner1@example.com',
    password: hashedPassword,
    address: 'Commercial District Mall, Shop 10, Ground Floor',
    role: UserRole.OWNER,
  });

  const owner2 = userRepository.create({
    name: 'Store Owner Two Account', // 24 chars
    email: 'owner2@example.com',
    password: hashedPassword,
    address: 'Westside Retail Avenue, Block B, Shop 42',
    role: UserRole.OWNER,
  });

  const normalUser1 = userRepository.create({
    name: 'Johnathan Doe Customer', // 23 chars
    email: 'user1@example.com',
    password: hashedPassword,
    address: '123 Residential Lane, Apartment 4B, Metro City',
    role: UserRole.NORMAL,
  });

  const normalUser2 = userRepository.create({
    name: 'Clarissa Smith Reviewer', // 24 chars
    email: 'user2@example.com',
    password: hashedPassword,
    address: '456 Suburban Boulevard, Green Valley Suburb',
    role: UserRole.NORMAL,
  });

  await userRepository.save([admin, owner1, owner2, normalUser1, normalUser2]);
  console.log('Seeded 5 users (1 admin, 2 owners, 2 normal users).');

  
  const savedOwner1 = await userRepository.findOne({ where: { email: 'owner1@example.com' } });
  const savedOwner2 = await userRepository.findOne({ where: { email: 'owner2@example.com' } });
  const savedUser1 = await userRepository.findOne({ where: { email: 'user1@example.com' } });
  const savedUser2 = await userRepository.findOne({ where: { email: 'user2@example.com' } });

  
  const store1 = storeRepository.create({
    name: 'Delhi Supermarket Gourmet Store', // 31 chars
    email: 'delhisupermarket@example.com',
    address: 'Delhi Connaught Place, Block C, Metro Hub',
    ownerId: savedOwner1?.id || null,
  });

  const store2 = storeRepository.create({
    name: 'Mumbai Electronics Emporium', // 28 chars
    email: 'mumbaielectronics@example.com',
    address: 'Mumbai Colaba Causeway, Ocean View Road',
    ownerId: savedOwner2?.id || null,
  });

  const store3 = storeRepository.create({
    name: 'Bangalore Coffee Roasters Cafe', // 30 chars
    email: 'bangalorecoffee@example.com',
    address: 'Bangalore Indiranagar, 100 Feet Road',
    ownerId: null, // Unassigned
  });

  await storeRepository.save([store1, store2, store3]);
  console.log('Seeded 3 stores.');

  
  const savedStore1 = await storeRepository.findOne({ where: { email: 'delhisupermarket@example.com' } });
  const savedStore2 = await storeRepository.findOne({ where: { email: 'mumbaielectronics@example.com' } });

  
  if (savedUser1 && savedUser2 && savedStore1 && savedStore2) {
    const rating1 = ratingRepository.create({
      userId: savedUser1.id,
      storeId: savedStore1.id,
      score: 5,
    });

    const rating2 = ratingRepository.create({
      userId: savedUser1.id,
      storeId: savedStore2.id,
      score: 3,
    });

    const rating3 = ratingRepository.create({
      userId: savedUser2.id,
      storeId: savedStore1.id,
      score: 4,
    });

    await ratingRepository.save([rating1, rating2, rating3]);
    console.log('Seeded 3 store ratings.');
  }

  console.log('Database seeding completed successfully.');
}
