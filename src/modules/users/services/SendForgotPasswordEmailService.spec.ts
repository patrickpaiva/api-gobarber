import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeuserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeuserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeuserTokensRepository,
        );
    });

    it('should be able to recover password using email address', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {
        sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });

        await expect(
            sendForgotPasswordEmail.execute({
                email: 'johndoe@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generate = jest.spyOn(fakeuserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });

        expect(generate).toHaveBeenCalledWith(user.id);
    });
});
