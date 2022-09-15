currentDate = new Date();
startDate = new Date(currentDate.getFullYear(), 0, 1);
var days = Math.floor((currentDate - startDate) /
    (24 * 60 * 60 * 1000));
     
var weekNumber = Math.ceil(days / 7);
var seasonWeek = weekNumber - 35;

// Display the calculated result      
console.log("Week number of " + currentDate +
    " is :   " + weekNumber);

console.log('CFB week number: ', weekNumber - 35)

console.log(new Date().getFullYear());