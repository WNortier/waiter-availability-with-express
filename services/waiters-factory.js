module.exports = function WaiterFactory(pool) {

        async function shiftsPopulator(workday, id) {
            let waiterDataId = [id];
            let accountExtraction = await pool.query(`SELECT * FROM accounts WHERE id = $1`, waiterDataId)
            let account = accountExtraction.rows;
            let waiterUsername = account[0].username;
            //Duplicate day prevention
            let workdayAndId = [workday, id];
            let rowCheckExtraction = await pool.query(`SELECT * FROM waiters WHERE (weekdays_working = $1 AND waiters_id = $2)`, workdayAndId)
            var rowCheck = rowCheckExtraction.rowCount
            if (rowCheck == 1) {
                errorMessage = "That weekday has already been entered!"
                return false
            }
            //If there is no existing row for that day, enter it 
            else if (rowCheck == 0) {
                let newWorkDayRowInfo = [waiterUsername, workday, id];
                await pool.query(`INSERT INTO waiters (waiter_username, weekdays_working, waiters_id) VALUES ($1, $2, $3)`, newWorkDayRowInfo);
                return true
            }
        }

    async function removeShiftsForUser(id) {
        let idForEntriesToDelete = []
        idForEntriesToDelete.push(id);
        return await pool.query(`DELETE FROM waiters WHERE waiters_id = $1`, idForEntriesToDelete)
    }

    async function dayCounter() {
        dayCountObject = [{
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
            Sunday: 0
        }]

        let shiftsInfoExtraction = await pool.query(`select * from waiters`)
        let shiftsInfo = shiftsInfoExtraction.rows
        //console.log(shiftsInfo)
        //Sorting array alphabetically by username (unneccessary but neat > for a-z < for z-a)
        let sortedShiftsInfo = shiftsInfo.sort(function (a, b) {
            return a.waiter_username.toLowerCase() > b.waiter_username.toLowerCase();
        });
        //
        //Extracting the days - the app can be improved FROM HERE by extracting the days for specific user 
        let daysThatHaveWaiters = sortedShiftsInfo.map((entry) => {
            return entry.weekdays_working
        })
        //console.log(daysThatHaveWaiters)
        //Looping over the daysThatHaveWaiters array and updating the dayCountObject
        for (var i of daysThatHaveWaiters) {
            switch (i) {
                case "Monday":
                    dayCountObject[0].Monday++
                    break;
                case "Tuesday":
                    dayCountObject[0].Tuesday++
                    break;
                case "Wednesday":
                    dayCountObject[0].Wednesday++
                    break;
                case "Thursday":
                    dayCountObject[0].Thursday++
                    break;
                case "Friday":
                    dayCountObject[0].Friday++
                    break;
                case "Saturday":
                    dayCountObject[0].Saturday++
                    break;
                default:
                    dayCountObject[0].Sunday++
            }
        }

            let duplicateCheckObject = [{
                duplicateCheckDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                rowCheckDayExtractors: [rowCheckMondayExtraction = "", rowCheckTuesdayExtraction = "", rowCheckWednesdayExtraction = "", rowCheckThursdayExtraction = "", rowCheckFridayExtraction = "", rowCheckSaturdayExtraction = "", rowCheckSundayExtraction = ""],
                rowCheckDay: [rowCheckMonday = "", rowCheckTuesday = "", rowCheckWednesday = "", rowCheckThursday = "", rowCheckFriday = "", rowCheckSaturday = "", rowCheckSunday = ""]
            }]

            for (var j = 0; j < 7; j++) {
                duplicateCheckObject[0].rowCheckDayExtractors[j] = await pool.query(`SELECT * FROM info WHERE weekday = $1`, Array(duplicateCheckObject[0].duplicateCheckDays[j]))
            }
            for (var j = 0; j < 7; j++) {
                duplicateCheckObject[0].rowCheckDay[j] = duplicateCheckObject[0].rowCheckDayExtractors[j].rowCount
            }
            console.log(duplicateCheckObject[0].duplicateCheckDays[3])
            console.log(duplicateCheckObject[0].rowCheckDay[0])
            console.log(duplicateCheckObject[0].rowCheckDay[1])
            //console.log(Array(duplicateCheckMonday))


  


            // let rowCheckMondayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckMonday)
            // var rowCheckMonday = rowCheckMondayExtraction.rowCount


            // let rowCheckTuesdayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckTuesday)
            // var rowCheckTuesday = rowCheckTuesdayExtraction.rowCount


            // let rowCheckWednesdayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckWednesday)
            // var rowCheckWednesday = rowCheckWednesdayExtraction.rowCount


            // let rowCheckThursdayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckThursday)
            // var rowCheckThursday = rowCheckThursdayExtraction.rowCount


            // let rowCheckFridayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckFriday)
            // var rowCheckFriday = rowCheckFridayExtraction.rowCount


            // let rowCheckSaturdayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckSaturday)
            // var rowCheckSaturday = rowCheckSaturdayExtraction.rowCount


            // let rowCheckSundayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckSunday)
            // var rowCheckSunday = rowCheckSundayExtraction.rowCount




        let mondayCount = ["Monday",  dayCountObject[0].Monday]
        mondayCount[0] = 
        mondayCount[1] = dayCountObject[0].Monday
        //if (rowCheckMonday == 0) {
            if (duplicateCheckObject[0].rowCheckDay[0] == 0) {
            await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, mondayCount);
        } else {
            await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, mondayCount);
        }

        let tuesdayCount = []
        tuesdayCount[0] = "Tuesday"
        tuesdayCount[1] = dayCountObject[0].Tuesday
        //if (rowCheckTuesday == 0) {
            if (duplicateCheckObject[0].rowCheckDay[1] == 0) {
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, tuesdayCount);
        } else {
        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, tuesdayCount);
        }
        
        let wednesdayCount = []
        wednesdayCount[0] = "Wednesday"
        wednesdayCount[1] = dayCountObject[0].Wednesday
        //if (rowCheckWednesday == 0) {
            if (duplicateCheckObject[0].rowCheckDay[2] == 0) {
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, wednesdayCount);
        } else {
        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, wednesdayCount);    
        }

        let thursdayCount = []
        thursdayCount[0] = "Thursday"
        thursdayCount[1] = dayCountObject[0].Thursday
        //if (rowCheckThursday == 0) {
            if (duplicateCheckObject[0].rowCheckDay[3] == 0) {
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, thursdayCount);
        } else {
        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, thursdayCount);    
        }
        
        let fridayCount = []
        fridayCount[0] = "Friday"
        fridayCount[1] = dayCountObject[0].Friday
        if (duplicateCheckObject[0].rowCheckDay[4] == 0) {
            //if (rowCheckFriday == 0) {
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, fridayCount);
        } else {
        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, fridayCount);
        }

        let saturdayCount = []
        saturdayCount[0] = "Saturday"
        saturdayCount[1] = dayCountObject[0].Saturday
        if (duplicateCheckObject[0].rowCheckDay[5] == 0) {
            //if (rowCheckSaturday == 0) {
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, saturdayCount);
        } else {
        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, saturdayCount);
        }

        let sundayCount = []
        sundayCount[0] = "Sunday"
        sundayCount[1] = dayCountObject[0].Sunday
        if (duplicateCheckObject[0].rowCheckDay[6] == 0) {
            //if (rowCheckSunday == 0) {
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, sundayCount);
        } else {
        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, sundayCount);
        }
        return true
    }


    async function shiftsAndDayMatcher(){
    
        var waiterAvailabilityByColorDivPrinter = [
        { day: 'Mon', style: "rgb(23, 64, 77)" },                                                                                //, style: ''
        { day: 'Tue', style: "rgb(23, 64, 77)" },
        { day: 'Wed', style: "rgb(23, 64, 77)" },
        { day: 'Thu', style: "rgb(23, 64, 77)" },
        { day: 'Fri', style: "rgb(23, 64, 77)" },
        { day: 'Sat', style: "rgb(23, 64, 77)" },
        { day: 'Sun', style: "rgb(23, 64, 77)" },
    ];

    let infoTableDataExtraction = await pool.query(`SELECT weekday, waiters_for_day FROM info`)
    let infoTableData = infoTableDataExtraction.rows
    let infoTableDataRowCount = infoTableDataExtraction.rowCount

    //console.log(infoTableData)
if (infoTableDataRowCount > 0){
    for (var i = 0; i < 7; i++) {
        if (infoTableData[i].waiters_for_day == 3) {
            waiterAvailabilityByColorDivPrinter[i].style = "green"
        } else if (infoTableData[i].waiters_for_day > 3) {
            waiterAvailabilityByColorDivPrinter[i].style = "red"
        }
    }
}

    //console.log(waiterAvailabilityByColorDivPrinter)

    return waiterAvailabilityByColorDivPrinter
    }

    async function errorTestAssistant() {
        return errorMessage
    }

    async function infoTestAssistant() {
        let databaseInfo = await pool.query(`SELECT * from info`);
        return databaseInfo.rows;
    }

    return {
        shiftsPopulator,
        dayCounter,
        errorTestAssistant,
        infoTestAssistant,
        shiftsAndDayMatcher,
        removeShiftsForUser
    }
    }


//USE THIS TO COLOR THE DAYS
/* <div class="col-12 center" id="#">
            {{#each this}}
            <div class="weekdayBlockDivs" id="{{style}}"><p>{{day}}</p></div>

            {{/each}}
        </div> */
    
    
    
        //await pool.query('UPDATE waiters SET weekdays_working = $1 WHERE waiters_id = $2;', weekdayWorking)

        //select weekdays_working, count (*) from waiters group by weekdays_working;
            //select weekdays_working, count (*) from waiters group by weekdays_working;