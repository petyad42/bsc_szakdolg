const expect = require('chai').expect;
const should  = require('chai').should();
const sinon = require('sinon')


const saveReservationMW = require('../../../../middleware/Reservation/saveReservationMW');

describe('Testing: saveReservation middleware', function () {

    it('res.locals.reservation parameters should equal certain values and save function should be called', async () => {;
        const mockReservationModel = {
            save: sinon.stub().resolves(),
            findOne: sinon.stub().resolves()
        };
        const starts = new Date(`October 1, 2023 12:24:00`);
        const ends = new Date(`October 1, 2023 11:24:00`);
        const repeats = 'DAILY';

        const endRepeat = new Date(`October 2, 2023 11:24:00`);

        const req = { body: { starts: starts, ends: ends,repeats: repeats,endrepeat: endRepeat } };
        const res = {
            locals: {
                reservation:{
                    eventID: '1501',
                    save: sinon.stub().resolves()
                },
                resource:{
                    _id:'150'
                },
                isCreate: true
            },
            redirect: where=>{
                expect(where).to.be.eql("/calendar/150")
            }
        };
        const next = sinon.stub();

        await saveReservationMW({ ReservationModel: mockReservationModel })(req, res, next);

        expect(res.locals.reservation.starts).to.be.eql(starts)
        expect(res.locals.reservation.ends).to.be.eql(ends);
        expect(res.locals.reservation.repeats).to.be.eql(repeats);
        expect(res.locals.reservation.endRepeat).to.be.eql(endRepeat);
        expect(res.locals.reservation).not.to.be.eql(undefined)
        expect(res.locals.reservation.save.called).to.be.true;
        mockReservationModel.restore;
        req.restore;
        res.restore;
        next.restore;
    });
    it('save function should not be called and next should be called with an error', async () => {;
        const mockReservationModel = {
            save: sinon.stub().resolves(),
        };
        const starts = undefined;
        const ends= undefined;


        const req = { body: { name: starts, type: ends } };
        const res = {
            locals: {
                reservation:{
                    save: sinon.stub().rejects()
                }

            },

        };
        const next = sinon.stub();

        await saveReservationMW({ ReservationModel: mockReservationModel })(req, res, next);

        expect(res.locals.reservation.starts).to.be.eql(undefined)
        expect(res.locals.reservation.ends).to.be.eql(undefined);
        expect(res.locals.reservation.save.called).not.to.be.true;
        expect(next.called).to.be.true;
    });



});
