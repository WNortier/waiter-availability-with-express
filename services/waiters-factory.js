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
        //Sorting array alphabetically by username (unneccessary but neat > for a-z < for z-a)
        let sortedShiftsInfo = shiftsInfo.sort(function (a, b) {
            return a.waiter_username.toLowerCase() > b.waiter_username.toLowerCase();
        });
        //
        //Extracting the days - the app can be improved FROM HERE by extracting the days for specific user 
        let daysThatHaveWaiters = sortedShiftsInfo.map((entry) => {
            return entry.weekdays_working
        })
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

        let Monday = []
        Monday[0] = "Monday"
        Monday[1] = dayCountObject[0].Monday
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, Monday);
        let Tuesday = []
        Tuesday[0] = "Tuesday"
        Tuesday[1] = dayCountObject[0].Tuesday
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, Tuesday);
        let Wednesday = []
        Wednesday[0] = "Wednesday"
        Wednesday[1] = dayCountObject[0].Wednesday
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, Wednesday);
        let Thursday = []
        Thursday[0] = "Thursday"
        Thursday[1] = dayCountObject[0].Thursday
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, Thursday);
        let Friday = []
        Friday[0] = "Friday"
        Friday[1] = dayCountObject[0].Friday
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, Friday);
        let Saturday = []
        Saturday[0] = "Saturday"
        Saturday[1] = dayCountObject[0].Saturday
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, Saturday);
        let Sunday = []
        Sunday[0] = "Sunday"
        Sunday[1] = dayCountObject[0].Sunday
        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, Sunday);
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

    console.log(infoTableData)

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
//await pool.query('UPDATE waiters SET weekdays_working = $1 WHERE waiters_id = $2;', weekdayWorking)

//USE THIS TO COLOR THE DAYS
/* <div class="col-12 center" id="#">
            {{#each this}}
            <div class="weekdayBlockDivs" id="{{style}}"><p>{{day}}</p></div>

            {{/each}}
        </div> */
