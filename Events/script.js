const currentDate = document.querySelector(".current-date");
const daysTag = document.querySelector(".calendar");
const prevNextIcon = document.querySelectorAll(".icons span");
let date = new Date();
currYear = date.getFullYear();
currMonth = date.getMonth();
const months = ["January" , "February" , "March" , "April" , "May" , "June" , "July" , "August" , "September" , "October" , "November" , "December"];

const renderCalendar = () => {
    let firstDaysofMonth = new Date(currYear , currMonth , 1).getDay();
    let lastDateofMonth = new Date(currYear , currMonth+1 , 0).getDate();
    let lastDayofMonth = new Date(currYear , currMonth+1 , 0).getDay();
    let lastDateofLastMonth = new Date(currYear , currMonth , 0).getDate();
    let divTag = "";
    for (let i =firstDaysofMonth; i > 0; i--) {
        divTag += `<div class = "days inactive">${lastDateofLastMonth - i + 1}</div>`
        
    }
    for (let i = 1; i<= lastDateofMonth ; i++)
    {
        let isToday = i === date.getDate() && currMonth === date.getMonth() && currYear === date.getFullYear() ? "active" : "";
        divTag += `<div class = "days ${isToday}">${i}</div>`
    }
    for (let i = lastDayofMonth; i < 6; i++) {
        divTag += `<div class = "days inactive">${i - lastDayofMonth + 1}</div>`
        
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = divTag;
};

renderCalendar();


prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev"  ? currMonth - 1 : currMonth + 1;
        if(currMonth < 0 || currMonth > 11){
            date = new Date(currYear , currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();

        } else {
            date = new Date();
        }
        renderCalendar();
    })
})
