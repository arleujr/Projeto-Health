"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const AppError_js_1 = require("../../../shared/errors/AppError.js");
class CreateUserService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute({ name, email, phone, role }) {
        const emailExists = await this.usersRepository.findByEmail(email);
        if (emailExists) {
            throw new AppError_js_1.AppError('Email address already registered.', 409);
        }
        const phoneExists = await this.usersRepository.findByPhone(phone);
        if (phoneExists) {
            throw new AppError_js_1.AppError('Phone number already registered.', 409);
        }
        const user = await this.usersRepository.create({
            name,
            email,
            phone,
            role,
        });
        return user;
    }
}
exports.CreateUserService = CreateUserService;
