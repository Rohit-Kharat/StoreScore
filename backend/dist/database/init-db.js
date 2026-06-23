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
exports.ensureDatabaseExists = ensureDatabaseExists;
const mysql = __importStar(require("mysql2/promise"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
async function ensureDatabaseExists() {
    dotenv.config({ path: path.join(__dirname, '../../.env') });
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '3306', 10);
    const user = process.env.DB_USERNAME || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_DATABASE || 'store_rating_db';
    try {
        const connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
        console.log(`Database "${database}" verified/created successfully.`);
    }
    catch (error) {
        console.error('Error during database initialization:', error);
    }
}
//# sourceMappingURL=init-db.js.map