module.exports = function WaiterFactory(pool) {

    async function waitersShiftsPopulator(workday, id) {
        let waiterDataId = [];
        waiterDataId.push(id)
        //let weekdayWorking = []; weekdayWorking.push(workday); //weekdayWorking[1] = null;
        let weekdayWorking = [];
        weekdayWorking[0] = workday;
        weekdayWorking[1] = id; //weekdayWorking[0] = "Frank"; 
        // console.log(weekdayWorking)
        let waiterWorkdaysExtraction = await pool.query(`SELECT * FROM accounts WHERE id = $1`, waiterDataId)
        let waiterWorkdays = waiterWorkdaysExtraction.rows
        let waiterUsername = waiterWorkdays[0].username
        // console.log(waiterUsername)
        let newWorkDayRowInfo = [];
        newWorkDayRowInfo[0] = waiterUsername;
        newWorkDayRowInfo[1] = workday;
        newWorkDayRowInfo[2] = id;
        // console.log(newWorkDayRowInfo)
        // console.log(waiterWorkdays)
        waiterWorkdays.forEach(async function (entry) {
            await pool.query(`INSERT into WAITERS (waiter_username, weekdays_working, waiters_id) values ($1, $2, $3)`, newWorkDayRowInfo);
        });
        return true
    }
    return {
        waitersShiftsPopulator
    }
}

//await pool.query('UPDATE waiters SET weekdays_working = $1 WHERE waiters_id = $2;', weekdayWorking)