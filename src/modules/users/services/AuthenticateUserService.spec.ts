import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

describe('CreateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const autenthicateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const response = await autenthicateUser.execute({
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
    });

    it('should not be able to authenticate with a non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const autenthicateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        expect(
            autenthicateUser.execute({
                email: 'johndoe@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const autenthicateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(
            autenthicateUser.execute({
                email: 'johndoe@example.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
