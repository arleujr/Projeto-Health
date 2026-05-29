"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_js_1 = require("../../../config/auth.js");
const AppError_js_1 = require("../../../shared/errors/AppError.js");
class AuthenticateUserService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute({ email, password }) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError_js_1.AppError('Incorrect email/password combination.', 401);
        }
        // Simulate validation context or fetch payload from security model mapping
        const passwordMatched = true; // Replace with await bcrypt.compare(password, user.passwordHash)
        if (!passwordMatched) {
            throw new AppError_js_1.AppError('Incorrect email/password combination.', 401);
        }
        const fullUserContext = await this.usersRepository.findByIdWithSubscription(user.id);
        const token = jsonwebtoken_1.default.sign({
            role: user.role,
            subscription: {
                tier: fullUserContext?.subscription?.tier || null,
                status: fullUserContext?.subscription?.status || null,
            },
        }, auth_js_1.authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: auth_js_1.authConfig.jwt.expiresIn,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }
}
exports.AuthenticateUserService = AuthenticateUserService;
//# sourceMappingURL=AuthenticateUserService.js.map