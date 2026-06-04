import { AppError } from '../../../shared/errors/AppError.js';
export class CreateUserService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute({ name, email, phone, role }) {
        const emailExists = await this.usersRepository.findByEmail(email);
        if (emailExists) {
            throw new AppError('Email address already registered.', 409);
        }
        const phoneExists = await this.usersRepository.findByPhone(phone);
        if (phoneExists) {
            throw new AppError('Phone number already registered.', 409);
        }
        const user = await this.usersRepository.create({
            name,
            email,
            phone,
            role,
            cpf: "00000000000", // CPF provisório inserido direto aqui para satisfazer o banco
        });
        return user;
    }
}
