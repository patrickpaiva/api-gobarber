"use strict";

var _FakeMailProvider = _interopRequireDefault(require("../../../shared/container/providers/MailProvider/fakes/FakeMailProvider"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeUserTokensRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserTokensRepository"));

var _SendForgotPasswordEmailService = _interopRequireDefault(require("./SendForgotPasswordEmailService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeMailProvider;
let fakeuserTokensRepository;
let sendForgotPasswordEmail;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeMailProvider = new _FakeMailProvider.default();
    fakeuserTokensRepository = new _FakeUserTokensRepository.default();
    sendForgotPasswordEmail = new _SendForgotPasswordEmailService.default(fakeUsersRepository, fakeMailProvider, fakeuserTokensRepository);
  });
  it('should be able to recover password using email address', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com'
    });
    expect(sendMail).toHaveBeenCalled();
  });
  it('should not be able to recover a non-existing user password', async () => {
    sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com'
    });
    await expect(sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should generate a forgot password token', async () => {
    const generate = jest.spyOn(fakeuserTokensRepository, 'generate');
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com'
    });
    expect(generate).toHaveBeenCalledWith(user.id);
  });
});