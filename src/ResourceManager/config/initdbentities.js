const ResourceModel = require("../models/resource");
const ReservationModel = require("../models/reservation");
module.exports = function (){
    const ResourceModel = require('../models/resource.js');
    const ReservationModel = require('../models/reservation.js');
    const UserModel = require('../models/user.js');
    console.log("---x----INIT-DB---x----");

    async function deleteDB(){
        await ResourceModel.deleteMany({});
        await ReservationModel.deleteMany({});
        await UserModel.deleteMany({});
        console.log("All data has been deleted!");
    }

    async function addDummyEnts(num){
        await deleteDB();
        console.log("Adding dummies...");
        let felh = new UserModel({
            email: 'admin@admin.com',
            username: 'admin',
            password: 'admin1234',
            isAdmin: true
        });
        await felh.save();
        for(let i = 0;i<num;i++){
            let eroforr = new ResourceModel({
                name: 'A'+ i.toString(),
                type: 'terem'
            });
            let foglalas = new ReservationModel({
                starts: new Date(`October 1, 2023 ${10+i}:24:00`),
                ends: new Date(`October 1, 2023 ${11+i}:24:00`),
                resourceID: eroforr.id,
                repeats: 'WEEKLY'
            });
            let foglalas2 = new ReservationModel({
                starts: new Date(`September 30, 2023 ${10+i}:24:00`),
                ends: new Date(`September 30, 2023 ${11+i}:24:00`),
                repeats: 'MONTHLY',
                resourceID: eroforr.id
            });
            await eroforr.save();
            await foglalas.save();
            await foglalas2.save();
            console.log(eroforr.name.toString()+ ' entity added!');
            console.log(`${foglalas.starts.getMonth().toString()}.${foglalas.starts.getDate().toString()}  ${foglalas.starts.getHours().toString()} - ${foglalas.ends.getHours().toString()} added!`);
        }
    }

    addDummyEnts(5);
    
}