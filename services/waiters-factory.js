module.exports = function WaiterFactory(pool) {



        // async function waiterTable_Username_WeekdaysWorking_ForeignKeyPopulator(workday, id) {
        //     let waiterDataId = [id];
        //     let accountExtraction = await pool.query(`SELECT * FROM accounts WHERE id = $1`, waiterDataId)
        //     let account = accountExtraction.rows;
        //     let waiterUsername = account[0].username;
        //     //Duplicate day prevention
        //     let workdayAndId = [workday, id];
        //     let rowCheckExtraction = await pool.query(`SELECT * FROM waiters WHERE (weekdays_working = $1 AND waiters_id = $2)`, workdayAndId)
        //     var rowCheck = rowCheckExtraction.rowCount
        //     if (rowCheck == 1) {
        //         errorMessage = "That weekday has already been entered!"
        //         return false
        //     }
        //     //If there is no existing row for that day, enter it 
        //     else if (rowCheck == 0) {
        //         errorMessage = "";
        //         let newWorkDayRowInfo = [waiterUsername, workday, id];
        //         await pool.query(`INSERT INTO waiters (waiter_username, weekdays_working, waiters_id) VALUES ($1, $2, $3)`, newWorkDayRowInfo);
        //         return true
        //     }
        // }

        async function waiterTablePopulatorUsingArray(workdayArray, id) {
            //console.log(workdayArray.length)
            let accountExtraction = await pool.query(`SELECT * FROM accounts WHERE id = $1`, [id])
            let account = accountExtraction.rows;
            let waiterUsername = account[0].username;
            //console.log(workdayArray.length)

            // if (workdayArray.length == 1){
            //     let theDay = workdayArray[0]
    
            //     var rowCheckExtraction = await pool.query(`SELECT * FROM waiters WHERE (weekdays_working = $1 AND waiters_id = $1)`, [theDay, id])
            // } else if (workdayArray.length > 1){
                
            // }

            var rowCheckExtraction = await pool.query(`SELECT * FROM waiters WHERE (weekdays_working = ANY($1) AND waiters_id = $2)`, [workdayArray, id])
          
                //var rowCheckExtraction = await pool.query(`SELECT * FROM waiters WHERE (weekdays_working = $1 AND waiters_id = $1)`, [workdayArray, id])
                
                //console.log(rowCheckExtraction.rows)
                //select * from word_weight where word in ('a', 'steeple', 'the');
            //var rowCheck = undefined;
            var rowCheck = rowCheckExtraction.rowCount
            //console.log(rowCheck)
            // console.log(rowCheck)
            if (rowCheck > 0) {
                errorMessage = "We've already received some of those workdays!"
                return false
            
            
            } else if (rowCheck == 0) {
                errorMessage = "";
                for (let j = 0; j < workdayArray.length; j++) {
                    await pool.query(`INSERT INTO waiters (waiter_username, weekdays_working, waiters_id) VALUES ($1, $2, $3)`, [waiterUsername, workdayArray[j], id]);
                    
                }
                return true
            }
        }

            async function removeShiftsForUser(id) {
                let idForEntriesToDelete = []
                idForEntriesToDelete.push(id);
                return await pool.query(`DELETE FROM waiters WHERE waiters_id = $1`, idForEntriesToDelete)
            }



            async function workingDaysDisplayer(id) {

                if (id) {
                    let idForWorkingDays = [id];
                    let workingDaysExtraction = await pool.query(`select * from waiters where waiters_id = $1`, idForWorkingDays)
                    let count = workingDaysExtraction.rowCount
                    let workingDays = workingDaysExtraction.rows
                    workingDays[0].amountOfWorkingDays = count
                    return workingDays
                }
            }



            //     else {
            //         let workingDaysExtraction = await pool.query(`select * from waiters`)
            //         return workingDaysExtraction.rows
            //     }
            // }

            async function weekdaysWorking_OnWaiterTableCounter() {

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

                let dayCountArray = [
                    ["Monday", dayCountObject[0].Monday],
                    ["Tuesday", dayCountObject[0].Tuesday],
                    ["Wednesday", dayCountObject[0].Wednesday],
                    ["Thursday", dayCountObject[0].Thursday],
                    ["Friday", dayCountObject[0].Friday],
                    ["Saturday", dayCountObject[0].Saturday],
                    ["Sunday", dayCountObject[0].Sunday]
                ]
                let duplicatePreventionByRowCheck = duplicateCheckObject[0].rowCheckDay

                for (var k = 0; k < 7; k++) {
                    if (duplicatePreventionByRowCheck[k] == 0) {
                        await pool.query(`INSERT INTO info (weekday, waiters_for_day) VALUES ($1, $2)`, dayCountArray[k]);
                    } else {
                        await pool.query(`UPDATE info SET waiters_for_day = $2 WHERE weekday = $1`, dayCountArray[k]);
                    }
                }

                return dayCountObject
            }

            async function shiftsAndDayMatcher() {

                var waiterAvailabilityByColorDivPrinter = [{
                        day: 'Mon',
                        style: "rgb(23, 64, 77)"
                    },
                    {
                        day: 'Tue',
                        style: "rgb(23, 64, 77)"
                    },
                    {
                        day: 'Wed',
                        style: "rgb(23, 64, 77)"
                    },
                    {
                        day: 'Thu',
                        style: "rgb(23, 64, 77)"
                    },
                    {
                        day: 'Fri',
                        style: "rgb(23, 64, 77)"
                    },
                    {
                        day: 'Sat',
                        style: "rgb(23, 64, 77)"
                    },
                    {
                        day: 'Sun',
                        style: "rgb(23, 64, 77)"
                    },
                ];

                let infoTableDataExtraction = await pool.query(`SELECT weekday, waiters_for_day FROM info`)
                let infoTableData = infoTableDataExtraction.rows
                let infoTableDataRowCount = infoTableDataExtraction.rowCount

                if (infoTableDataRowCount > 0) {
                    for (var i = 0; i < 7; i++) {
                        if (infoTableData[i].waiters_for_day == 3) {
                            waiterAvailabilityByColorDivPrinter[i].style = "green"
                        } else if (infoTableData[i].waiters_for_day > 3) {
                            waiterAvailabilityByColorDivPrinter[i].style = "red"
                        }
                    }
                }

                let visualWaiterAvailability = await weekdaysWorking_OnWaiterTableCounter()

                waiterAvailabilityByColorDivPrinter[0].count = visualWaiterAvailability[0].Monday;
                waiterAvailabilityByColorDivPrinter[1].count = visualWaiterAvailability[0].Tuesday;
                waiterAvailabilityByColorDivPrinter[2].count = visualWaiterAvailability[0].Wednesday;
                waiterAvailabilityByColorDivPrinter[3].count = visualWaiterAvailability[0].Thursday;
                waiterAvailabilityByColorDivPrinter[4].count = visualWaiterAvailability[0].Friday;
                waiterAvailabilityByColorDivPrinter[5].count = visualWaiterAvailability[0].Saturday;
                waiterAvailabilityByColorDivPrinter[6].count = visualWaiterAvailability[0].Sunday;

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
                //waiterTable_Username_WeekdaysWorking_ForeignKeyPopulator,
                removeShiftsForUser,
                workingDaysDisplayer,
                weekdaysWorking_OnWaiterTableCounter,
                shiftsAndDayMatcher,
                errorTestAssistant,
                infoTestAssistant,
                waiterTablePopulatorUsingArray
            }
        }


        //await pool.query('UPDATE waiters SET weekdays_working = $1 WHERE waiters_id = $2;', weekdayWorking)
        //select weekdays_working, count (*) from waiters group by weekdays_working;