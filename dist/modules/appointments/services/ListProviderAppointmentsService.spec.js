"use strict";

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _ListProviderAppointmentsService = _interopRequireDefault(require("./ListProviderAppointmentsService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let listProviderAppointments;
let fakeCacheProvider;
let fakeAppointmentsRepository;
describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeCacheProvider = new _FakeCacheProvider.default();
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    listProviderAppointments = new _ListProviderAppointmentsService.default(fakeAppointmentsRepository, fakeCacheProvider);
  });
  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 9, 14, 14, 0, 0)
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 9, 14, 15, 0, 0)
    });
    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2020,
      month: 10,
      day: 14
    });
    expect(appointments).toEqual([appointment1, appointment2]);
  });
});