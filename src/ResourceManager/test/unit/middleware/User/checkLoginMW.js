const expect = require( 'chai').expect;
const should= require( 'chai').should;
const sinon = require('sinon')

const checkLoginMW = require('../../../../middleware/User/checkLoginMW');
const UserModel = require("../../../../models/user");
const jwt = require("jsonwebtoken");


describe('Testing: checkLoginMW middleware', function () {

    it('should call next when user attributes are undefined', async () => {
        const req = {
            body:{}
        };
        const res = {
            locals:{
                loginerror: false
            }
        };
        const next = sinon.stub();
        const mockUserModel = {
            findOne: sinon.stub().resolves(),
        };
        await checkLoginMW({UserModel:mockUserModel})(req,res,next);

        expect(req.body.email).to.be.eql(undefined);
        expect(req.body.password).to.be.eql(undefined);
        expect(next.called).to.be.true;
    });
    it('should call next when password does not match', async () => {
        const req = {
            body:{
                email: 'test@test.com',
                password: 'wrongpassword'
            }
        };
        const mockUser = {
            username: 'Test',
            email: 'test@test.com',
            password: 'test',
        }
        const res = {
            locals:{
                loginerror: false
            }
        };
        const next = sinon.stub();
        const mockUserModel = {
            findOne: sinon.stub().resolves(mockUser),
        };
        await checkLoginMW({UserModel:mockUserModel})(req,res,next);

        expect(next.called).to.be.true;
    });
    it('should login in if everything checks', async () => {
        const signStub = sinon.stub(jwt, 'sign').returns('fakeToken');
        const req = {
            body:{
                email: 'test@test.com',
                password: 'test'
            }
        };
        const mockUser = {
            username: 'Test',
            email: 'test@test.com',
            password: 'test',
        }
        const res = {
            locals:{
                loginerror: false
            },
            redirect: where=>{
                expect(where).to.be.eql("/resource")
            }
        };
        const next = sinon.stub();
        const mockUserModel = {
            findOne: sinon.stub().resolves(mockUser),
        };
        await checkLoginMW({UserModel:mockUserModel})(req,res,next);
        expect(signStub.calledOnce).to.be.true;


    });
    it('should call next when password does not match', async () => {
        const req = {
            body:{
                email: 'test@test.com',
                password: 'test'
            }
        };

        const res = {
            locals:{
                loginerror: false
            },
        };
        const next = sinon.stub();
        const mockUserModel = {
            findOne: sinon.stub().resolves(null),
        };
        await checkLoginMW({UserModel:mockUserModel})(req,res,next);

        expect(res.locals.loginerror).to.be.true;
        expect(next.called).to.be.true;

    });


});
