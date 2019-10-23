module.exports = function WaiterFactory(pool) {
    //var errorMessage;
    
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
        console.log(rowCheck)
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

    async function errorTestAssistant() {
        return errorMessage
    }

    return {
        shiftsPopulator,
        errorTestAssistant
    }
}





//await pool.query('UPDATE waiters SET weekdays_working = $1 WHERE waiters_id = $2;', weekdayWorking)



//USE THIS TO COLOR THE DAYS
/* <div class="col-12 center" id="#">
            {{#each this}}
            <div class="weekdayBlockDivs" id="{{style}}"><p>{{day}}</p></div>

            {{/each}}
        </div> */

// function dateAndDayMatcher(firstDayPrefix, secondDayPrefix) {
//     var globalObjectForTemplate = [
//         { day: 'Mon', style: "rgb(23, 64, 77)" },                                                                                //, style: ''
//         { day: 'Tue', style: "rgb(23, 64, 77)" },
//         { day: 'Wed', style: "rgb(23, 64, 77)" },
//         { day: 'Thu', style: "rgb(23, 64, 77)" },
//         { day: 'Fri', style: "rgb(23, 64, 77)" },
//         { day: 'Sat', style: "rgb(23, 64, 77)" },
//         { day: 'Sun', style: "rgb(23, 64, 77)" },
//     ];




//     for (var i in globalObjectForTemplate) {
//         if (firstDayPrefix == secondDayPrefix && globalObjectForTemplate[i].day == firstDayPrefix) {
//             globalObjectForTemplate[i].style = "green";
//         } else if (globalObjectForTemplate[i].day == firstDayPrefix) {
//             globalObjectForTemplate[i].style = "blue"
//         }
//     }

//     for (var i in globalObjectForTemplate) 
//         if (firstDayPrefix != secondDayPrefix && globalObjectForTemplate[i].day == secondDayPrefix) {
//             globalObjectForTemplate[i].style = "red";
//         }
//     }
//     return globalObjectForTemplate
// }