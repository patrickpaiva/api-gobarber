import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 9, 13, 14).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 9, 13, 15),
            user_id: '123456',
            provider_id: '123123',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const appointmentDate = new Date(2020, 9, 13, 16);

        await createAppointment.execute({
            date: appointmentDate,
            user_id: '123456',
            provider_id: '123456123456',
        });

        expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: '123456',
                provider_id: '123456123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 9, 13, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 9, 13, 11),
                user_id: '123123',
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 9, 13, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 9, 13, 13),
                user_id: '123123',
                provider_id: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am or after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 9, 13, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 9, 14, 7),
                user_id: 'user-id',
                provider_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 9, 14, 18),
                user_id: 'user-id',
                provider_id: 'provider-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
