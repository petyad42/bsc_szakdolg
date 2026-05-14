const expect = require('chai').expect;
const should  = require('chai').should();
const sinon = require('sinon')
const mongoose = require('mongoose');

const getReservationMW = require('../../../../middleware/Reservation/getReservationMW');
const getResourceMW = require("../../../../middleware/Resource/getResourceMW");

describe('Testing: getReservation middleware', function () {

    it('should set res.locals.reservation when reservation exists', async () => {
        const mockReservation = {
            starts: new Date(`October 1, 2023 12:24:00`),
            ends: new Date(`October 1, 2023 11:24:00`),
            resourceID: '150150150150150150150150',
            repeats: 'WEEKLY',
            eventID: '150115011501150115011501'
        };
        const mockReservationModel = {
            findOne: sinon.stub().resolves(mockReservation),
        };

        const req = { params: { reservationid: '150115011501150115011501' } };
        const res = { locals: {} };
        const next = sinon.stub();

        await getReservationMW({ ReservationModel: mockReservationModel })(req, res, next);

        expect(res.locals.reservation.eventID).to.be.eql('150115011501150115011501')
        expect(res.locals.reservation).to.be.eql(mockReservation);
        next.calledOnce.should.be.true;
    });

    it('should call next with an error when reservation does not exist', async () => {
        const mockReservationModel = {
            findOne: sinon.stub().resolves(null),
        };

        const req = { params: { reservationid: 'nonExistentId' } };
        const res = { locals: {} };
        //const next = sinon.stub().throws();
        const next = sinon.stub();

        await getReservationMW({ ReservationModel: mockReservationModel })(req, res, next);

        should.equal(res.locals.reservation, undefined);
        //expect(next).to.throw(Error);
        expect(next.called).to.be.true;
    });
    it('should set res.locals to {} when reservation is undefined', async () => {

        const mockReservationModel = {
            findOne: sinon.stub().resolves(null),
        };

        const req = { params: { reservationid: 'nonExistentId' } };
        const res = { locals: {} };
        const next = sinon.stub();

        await getReservationMW({ ReservationModel: mockReservationModel })(req, res, next);

        should.equal(res.locals.reservation, undefined);
        expect(res.locals).to.be.eql({});
    });
});
describe('Security Testing: getReservation middleware', function () {
    it('should call next if req parameter is not hexadecimal and 24 character long', async () => {

        const mockReservationModel = {
            findOne: sinon.stub().resolves(null),
        };

        const req = { params: { reservationid: '15015015' } };
        const res = { locals: {} };
        const next = sinon.stub();

        await getReservationMW({ ReservationModel: mockReservationModel })(req, res, next);

        expect(next.called).be.true;
    });

});
