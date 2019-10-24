module.exports = function WaiterFactory(pool) {

        async function shiftsPopulator(workday, id) {
            let waiterDataId = [];
            waiterDataId[0] = id;
            let accountExtraction = await pool.query(`SELECT * FROM accounts WHERE id = $1`, waiterDataId)
            let account = accountExtraction.rows;
            let waiterUsername = account[0].username;
            //Duplicate day prevention
            let workdayAndId = [];
            workdayAndId[0] = workday;
            workdayAndId[1] = id;
            let rowCheckExtraction = await pool.query(`SELECT * FROM waiters WHERE (weekdays_working = $1 AND waiters_id = $2)`, workdayAndId)
            var rowCheck = rowCheckExtraction.rowCount
            if (rowCheck == 1) {
                errorMessage = "That weekday has already been entered!"
                return false
            }
            //If there is no existing row for that day, enter it 
            else if (rowCheck == 0) {
                let newWorkDayRowInfo = [];
                newWorkDayRowInfo[0] = waiterUsername;
                newWorkDayRowInfo[1] = workday;
                newWorkDayRowInfo[2] = id;
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
        console.log(shiftsInfo)
        //Sorting array alphabetically by username (unneccessary but neat > for a-z < for z-a)
        let sortedShiftsInfo = shiftsInfo.sort(function (a, b) {
            return a.waiter_username.toLowerCase() > b.waiter_username.toLowerCase();
        });
        //
        //Extracting the days - the app can be improved FROM HERE by extracting the days for specific user 
        let daysThatHaveWaiters = sortedShiftsInfo.map((entry) => {
            return entry.weekdays_working
        })
        console.log(daysThatHaveWaiters)
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
        //console.log(dayCountObject)
            let duplicateCheckMonday = [];
            duplicateCheckMonday[0] = "Monday";
            let rowCheckMondayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckMonday)
            var rowCheckMonday = rowCheckMondayExtraction.rowCount

            let duplicateCheckTuesday = [];
            duplicateCheckTuesday[0] = "Tuesday";
            let rowCheckTuesdayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckTuesday)
            var rowCheckTuesday = rowCheckTuesdayExtraction.rowCount

            let duplicateCheckWednesday = [];
            duplicateCheckWednesday[0] = "Wednesday";
            let rowCheckWednesdayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckWednesday)
            var rowCheckWednesday = rowCheckWednesdayExtraction.rowCount

            let duplicateCheckThursday = [];
            duplicateCheckThursday[0] = "Thursday";
            let rowCheckThursdayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckThursday)
            var rowCheckThursday = rowCheckThursdayExtraction.rowCount

            let duplicateCheckFriday = [];
            duplicateCheckFriday[0] = "Friday";
            let rowCheckFridayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckFriday)
            var rowCheckFriday = rowCheckFridayExtraction.rowCount

            let duplicateCheckSaturday = [];
            duplicateCheckSaturday[0] = "Saturday";
            let rowCheckSaturdayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckSaturday)
            var rowCheckSaturday = rowCheckSaturdayExtraction.rowCount

            let duplicateCheckSunday = [];
            duplicateCheckSunday[0] = "Sunday";
            let rowCheckSundayExtraction = await pool.query(`SELECT * FROM info WHERE weekday = $1`, duplicateCheckSunday)
            var rowCheckSunday = rowCheckSundayExtraction.rowCount



        let mondayCount = []
        mondayCount[0] = "Monday"
        mondayCount[1] = dayCountObject[0].Monday
        if (rowCheckMonday == 0) {
            await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, mondayCount);
        } else {
            await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, mondayCount);
        }

        let tuesdayCount = []
        tuesdayCount[0] = "Tuesday"
        tuesdayCount[1] = dayCountObject[0].Tuesday
        if (rowCheckTuesday == 0) {
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, tuesdayCount);
        } else {
        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, tuesdayCount);
        }
        
        let wednesdayCount = []
        wednesdayCount[0] = "Wednesday"
        wednesdayCount[1] = dayCountObject[0].Wednesday
        if (rowCheckWednesday == 0) {
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, wednesdayCount);
        } else {
        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, wednesdayCount);    
        }

        let thursdayCount = []
        thursdayCount[0] = "Thursday"
        thursdayCount[1] = dayCountObject[0].Thursday
        if (rowCheckThursday == 0) {
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, thursdayCount);
        } else {
        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, thursdayCount);    
        }
        
        let fridayCount = []
        fridayCount[0] = "Friday"
        fridayCount[1] = dayCountObject[0].Friday
        if (rowCheckFriday == 0) {
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, fridayCount);
        } else {
        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, fridayCount);
        }

        let saturdayCount = []
        saturdayCount[0] = "Saturday"
        saturdayCount[1] = dayCountObject[0].Saturday
        if (rowCheckSaturday == 0) {
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, saturdayCount);
        } else {
        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, saturdayCount);
        }

        let sundayCount = []
        sundayCount[0] = "Sunday"
        sundayCount[1] = dayCountObject[0].Sunday
        if (rowCheckSunday == 0) {
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

    // var infoTableDataReference = [ { id: 57, weekday: 'Monday', waiters_for_day: 2 },
    //     { id: 58, weekday: 'Tuesday', waiters_for_day: 1 },
    //     { id: 59, weekday: 'Wednesday', waiters_for_day: 0 },
    //     { id: 60, weekday: 'Thursday', waiters_for_day: 0 },
    //     { id: 61, weekday: 'Friday', waiters_for_day: 0 },
    //     { id: 62, weekday: 'Saturday', waiters_for_day: 0 },
    //     { id: 63, weekday: 'Sunday', waiters_for_day: 0 }]

    let infoTableDataExtraction = await pool.query(`SELECT weekday, waiters_for_day FROM info`)
    let infoTableData = infoTableDataExtraction.rows
    let infoTableDataRowCount = infoTableDataExtraction.rowCount

    console.log(infoTableData)
if (infoTableDataRowCount > 0){
    if (infoTableData[0].waiters_for_day == 3) {
        waiterAvailabilityByColorDivPrinter[0].style = "green"
    } else if (infoTableData[0].waiters_for_day > 3) {
        waiterAvailabilityByColorDivPrinter[0].style = "red"
    }
    if (infoTableData[1].waiters_for_day == 3) {
        waiterAvailabilityByColorDivPrinter[1].style = "green"
    } else if (infoTableData[1].waiters_for_day > 3) {
        waiterAvailabilityByColorDivPrinter[1].style = "red"
    }
    if (infoTableData[2].waiters_for_day == 3) {
        waiterAvailabilityByColorDivPrinter[2].style = "green"
    } else if (infoTableData[2].waiters_for_day > 3) {
        waiterAvailabilityByColorDivPrinter[2].style = "red"
    }
    if (infoTableData[3].waiters_for_day == 3) {
        waiterAvailabilityByColorDivPrinter[3].style = "green"
    } else if (infoTableData[3].waiters_for_day > 3) {
        waiterAvailabilityByColorDivPrinter[3].style = "red"
    }
    if (infoTableData[4].waiters_for_day == 3) {
        waiterAvailabilityByColorDivPrinter[4].style = "green"
    } else if (infoTableData[4].waiters_for_day > 3) {
        waiterAvailabilityByColorDivPrinter[4].style = "red"
    }
    if (infoTableData[5].waiters_for_day == 3) {
        waiterAvailabilityByColorDivPrinter[5].style = "green"
    } else if (infoTableData[5].waiters_for_day > 3) {
        waiterAvailabilityByColorDivPrinter[5].style = "red"
    }
    if (infoTableData[6].waiters_for_day == 3) {
        waiterAvailabilityByColorDivPrinter[6].style = "green"
    } else if (infoTableData[6].waiters_for_day > 3) {
        waiterAvailabilityByColorDivPrinter[6].style = "red"
    }
}

    console.log(waiterAvailabilityByColorDivPrinter)

    return waiterAvailabilityByColorDivPrinter
    }

// for(var i=0;i<=vm.array1.length;i++)
// {
//     for(var j=0;j<=vm.array2.length;j++)
//     {
//         if(i==j)
//         vm.save(vm.array1[i].content1,vm.array2[j].content2){

//         }
//     }
// }

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