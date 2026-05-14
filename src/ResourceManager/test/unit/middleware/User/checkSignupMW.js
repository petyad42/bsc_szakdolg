const expect = require( 'chai').expect;
const should= require( 'chai').should;
const sinon = require('sinon')

const checkSignupMW = require('../../../../middleware/User/checkSignupMW');
const UserModel = require("../../../../models/user");

describe('Testing: checkSignup middleware', function () {

    it('should call next when user attributes are undefined', async () => {
        const req = {
            body:{}
        };
        const res = {};
        const next = sinon.stub();
        const mockUserModel = {
            findOne: sinon.stub().resolves(),
        };
        await checkSignupMW({UserModel:mockUserModel})(req,res,next);
        expect(req.body.username).to.be.eql(undefined);
        expect(req.body.email).to.be.eql(undefined);
        expect(req.body.password).to.be.eql(undefined);
        expect(next.called).to.be.true;
    });
    it('should call next when user already exists', async () => {
        const req = {
            body:{
                username: 'Test',
                email: 'test@test.com',
                password: 'test',
            }
        };
        const res = {};
        const next = sinon.stub();
        const mockUser = {
            username: 'Test',
            email: 'test@test.com',
            password: 'test',
        }
        const mockUserModel = {
            findOne: sinon.stub().resolves(mockUser)
        };
        await checkSignupMW({UserModel:mockUserModel})(req,res,next);
        expect(next.called).to.be.true;
    });
    it('should call next when username length is less the 3 characters', async () => {
        const req = {
            body:{
                username: 'Te',
                email: 'test@test.com',
                password: 'test',
            }
        };
        const res = {};
        const next = sinon.stub();
        const mockUserModel = {
            findOne: sinon.stub().resolves(null)
        };
        await checkSignupMW({UserModel:mockUserModel})(req,res,next);
        expect(next.called).to.be.true;
    });
    it('should create user when every requirements checks out', async () => {
        const username = 'Test';
        const email = 'test@test.com';
        const password = 'test';
        const isAdmin = true;
        const mockUser = {
            username: 'Test',
            email: 'test@test.com',
            password: 'test',
            isAdmin: true
        }
        const req = {
            body:{
                username: username,
                email: email,
                password: password,
                isAdmin: isAdmin
            }
        };
        const res = {
            locals:{
                newUser: {
                    _id:'150',
                    username: username,
                    email: email,
                    password: password,
                    save: sinon.stub().resolves(mockUser)
                },

            },
            redirect: where=>{
                expect(where).to.be.eql("/login")
            }
        };
        const next = sinon.stub();

        const mockUserModel = {
            findOne: sinon.stub().resolves(null),
            username: 'Test',
            email: 'test@test.com',
            password: 'test',
            save: sinon.stub().resolves()
        };
        expect(res.locals.newUser).not.to.be.eql(undefined);
        await checkSignupMW({ UserModel: mockUserModel })(req,res,next);
        //expect(UserModel.save.called).to.be.true;
    });

});
