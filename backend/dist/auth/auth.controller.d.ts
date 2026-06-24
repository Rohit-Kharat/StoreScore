import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<{
        message: string;
        userId: number;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: import("../users/entities/user.entity").UserRole;
            address: string;
        };
    }>;
    getProfile(req: any): Promise<any>;
    debugToken(req: any): Promise<{
        authorization: any;
    }>;
}
