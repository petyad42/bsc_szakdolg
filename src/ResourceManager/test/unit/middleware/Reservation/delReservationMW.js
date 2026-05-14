const mongoose = require('mongoose');
const chai = require('chai');
const sinon = require('sinon');
const expect = require('chai').expect;
const delReservationMW = require('../../../../middleware/Reservation/delReservationMW')


const ReservationModel = require('../../../../models/reservation');
const {ObjectId} = require("mongodb");
describe('Testing: delReservation middleware', () => {
    let reservation1;

    before(async () => {
        let foglalas = new ReservationModel({
            _id: new ObjectId("123456781234567812345678"),
            starts: new Date(`October 1, 2023 12:24:00`),
            ends: new Date(`October 1, 2023 13:24:00`),
            resourceID: new ObjectId("876543211234567887654321"),
            repeats: 'WEEKLY'
        });
        await foglalas.save();
    });

    after(async () => {
        await ReservationModel.deleteOne({_id: "123456781234567812345678"})
            .then((reservation) => {

                if(reservation.deletedCount===1){
                    console.log('Entity deleted after test');
                }
                else {
                    console.log('Didn\'t find a match');
                }
            })
            .catch(function (err){
                console.log("Error: "+err)
            })

    });

    it('should create a new reservation and find it in the db', async () => {

        await ReservationModel.findById("123456781234567812345678")
            .then(function(reservation){
                reservation1 = reservation;
            })
            .catch(function (err){
                return Promise.reject(err);
            })
        expect(reservation1).not.to.eql(undefined)

    });


    it('should delete a reservation, and redirect to /calendar/id', async () => {
        const deleteSpy = sinon.spy(ReservationModel,'deleteOne');
        const req = { params: { reservationid: '123456781234567812345678' } };
        const res = {
            redirect: sinon.stub(),
            locals:{
                resource:{
                    _id:"876543211234567887654321"
                }
            }
        };
        const next = sinon.stub();

        await delReservationMW({ ReservationModel: ReservationModel })(req, res, next);

        // Assertions
        sinon.assert.calledOnceWithExactly(ReservationModel.deleteOne, {_id: req.params.reservationid});
        sinon.assert.calledOnce(deleteSpy)
        sinon.assert.calledOnce(res.redirect);
        sinon.assert.calledWithExactly(res.redirect, '/calendar/876543211234567887654321');
        sinon.assert.calledOnce(next);

        deleteSpy.restore();
        req.restore;
        res.restore;
        next.restore
    });
    it('should not find the reservation after deleting it', async () => {

        await ReservationModel.findById("123456781234567812345678")
            .then(function(reservation){
                reservation1 = reservation;
            })
            .catch(function (err){
                console.log('Didn\'t find')
                return Promise.reject(err);
            })
        expect(reservation1).to.eql(null)


    });
    it('should redirect to /reservation if the id is undefined', async () => {
        const req = { params: { reservationid: undefined } };
        const res = {
            redirect: sinon.stub(),
            locals:{
                resource:{
                    _id:"876543211234567887654321"
                }
            }
        };
        const next = sinon.stub();
        await delReservationMW({ ReservationModel: ReservationModel })(req, res, next);

        sinon.assert.calledOnce(res.redirect);
        sinon.assert.calledWithExactly(res.redirect, '/calendar/876543211234567887654321');
        sinon.assert.calledOnce(next);

    });

});
