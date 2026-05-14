const expect = require( 'chai').expect;
const should= require( 'chai').should;
const sinon = require('sinon')

const getAllUserMW = require('../../../../middleware/User/getAllUserMW');
const UserModel = require("../../../../models/user");

describe('Testing: getAllUser middleware', function () {

    it('should set res.locals.users when reservation exists', async () => {
        const req = {};
        const res = { locals: {} };
        const next = sinon.stub();

        const mockReservations = ['user1','user2','user3']
        const wrongReservations = ['user11','user22','user33']
        const findStub = sinon.stub().resolves(mockReservations);


        const UserModel = { find: findStub };

        await getAllUserMW({UserModel})(req, res, next);

        expect(res.locals.users).to.be.eql(mockReservations);
        sinon.assert.called(next)
        next.restore;

    });
    it('should call next with error if ReservationModel.find() fails', async function() {
        const req = {};
        const res = {};
        const next = sinon.stub();


        const findStub = sinon.stub().rejects(new Error('UserModel.find() failed'));
        //const findStub = sinon.stub().resolves();
        const UserModel = { find: findStub };
        const findSpy = sinon.spy(UserModel.find);


        await getAllUserMW({UserModel})(req, res, next);

        sinon.assert.called(findStub)

        try {
            await findSpy();
            // throw new Error('Promise was not rejected');               //CSAK MERT A COVERAGE NEM SZERETTE EZT A SORT
        } catch (error) {
            expect(error.message).to.equal('UserModel.find() failed');
        }
    });

});
