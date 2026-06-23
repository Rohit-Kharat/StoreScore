"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const user_entity_1 = require("../users/entities/user.entity");
const store_entity_1 = require("../stores/entities/store.entity");
const rating_entity_1 = require("../ratings/entities/rating.entity");
const bcrypt = __importStar(require("bcrypt"));
async function seedDatabase(dataSource) {
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const storeRepository = dataSource.getRepository(store_entity_1.Store);
    const ratingRepository = dataSource.getRepository(rating_entity_1.Rating);
    const userCount = await userRepository.count();
    if (userCount > 0) {
        console.log('Database already has users. Skipping seeder.');
        return;
    }
    console.log('Seeding initial database content...');
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const admin = userRepository.create({
        name: 'System Administrator Account',
        email: 'admin@example.com',
        password: hashedPassword,
        address: 'Main Admin Office, Headquarters building, Suite 101',
        role: user_entity_1.UserRole.ADMIN,
    });
    const owner1 = userRepository.create({
        name: 'Store Owner One Account',
        email: 'owner1@example.com',
        password: hashedPassword,
        address: 'Commercial District Mall, Shop 10, Ground Floor',
        role: user_entity_1.UserRole.OWNER,
    });
    const owner2 = userRepository.create({
        name: 'Store Owner Two Account',
        email: 'owner2@example.com',
        password: hashedPassword,
        address: 'Westside Retail Avenue, Block B, Shop 42',
        role: user_entity_1.UserRole.OWNER,
    });
    const normalUser1 = userRepository.create({
        name: 'Johnathan Doe Customer',
        email: 'user1@example.com',
        password: hashedPassword,
        address: '123 Residential Lane, Apartment 4B, Metro City',
        role: user_entity_1.UserRole.NORMAL,
    });
    const normalUser2 = userRepository.create({
        name: 'Clarissa Smith Reviewer',
        email: 'user2@example.com',
        password: hashedPassword,
        address: '456 Suburban Boulevard, Green Valley Suburb',
        role: user_entity_1.UserRole.NORMAL,
    });
    await userRepository.save([admin, owner1, owner2, normalUser1, normalUser2]);
    console.log('Seeded 5 users (1 admin, 2 owners, 2 normal users).');
    const savedOwner1 = await userRepository.findOne({ where: { email: 'owner1@example.com' } });
    const savedOwner2 = await userRepository.findOne({ where: { email: 'owner2@example.com' } });
    const savedUser1 = await userRepository.findOne({ where: { email: 'user1@example.com' } });
    const savedUser2 = await userRepository.findOne({ where: { email: 'user2@example.com' } });
    const store1 = storeRepository.create({
        name: 'Delhi Supermarket Gourmet Store',
        email: 'delhisupermarket@example.com',
        address: 'Delhi Connaught Place, Block C, Metro Hub',
        ownerId: savedOwner1?.id || null,
    });
    const store2 = storeRepository.create({
        name: 'Mumbai Electronics Emporium',
        email: 'mumbaielectronics@example.com',
        address: 'Mumbai Colaba Causeway, Ocean View Road',
        ownerId: savedOwner2?.id || null,
    });
    const store3 = storeRepository.create({
        name: 'Bangalore Coffee Roasters Cafe',
        email: 'bangalorecoffee@example.com',
        address: 'Bangalore Indiranagar, 100 Feet Road',
        ownerId: null,
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
//# sourceMappingURL=seeder.js.map