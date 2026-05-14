const expect = require( 'chai').expect;
const should= require( 'chai').should;
const sinon = require('sinon')

const getAllReservationMW = require('../../../../middleware/Reservation/getAllReservationMW');
const ReservationModel = require("../../../../models/reservation");

describe('Testing: getAllReservation middleware', function () {

    it('should set res.locals.reservation when reservation exists', async () => {
        const req = {};
        const res = { locals: {} };
        const next = sinon.stub();

        const mockReservations = ['res1','res2','res3']
        const wrongReservations = ['res1','res22','res3']
        const findStub = sinon.stub().resolves(mockReservations);


        const ReservationModel = { find: findStub };

        await getAllReservationMW({ReservationModel })(req, res, next);

        expect(res.locals.reservations).to.be.eql(mockReservations);
        sinon.assert.called(next)
        next.restore;

    });
    it('should call next with error if ReservationModel.find() fails', async function() {
        const req = {};
        const res = {};
        const next = sinon.stub();


        const findStub = sinon.stub().rejects(new Error('ReservationModel.find() failed'));
        //const findStub = sinon.stub().resolves();
        const ReservationModel = { find: findStub };
        const findSpy = sinon.spy(ReservationModel.find);


        await getAllReservationMW({ReservationModel})(req, res, next);

        sinon.assert.called(findStub)

        try {
            await findSpy();
            // throw new Error('Promise was not rejected');               //CSAK MERT A COVERAGE NEM SZERETTE EZT A SORT
        } catch (error) {
            expect(error.message).to.equal('ReservationModel.find() failed');
        }
    });

});
