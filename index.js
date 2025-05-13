/*if(Notification in window){
    Notification.requestPermission().then(function(permission){
        if(Notification.permission !== "granted"){
            alert("please allow notification access");
            location.reload();
        }
    });
}

var timeoutids=[];
function schedulerem(){
    var title=document.getElementById("title").value;
    var description=document.getElementById("description").value;
    var date=document.getElementById("date").value;
    var time=document.getElementById("time").value;

    var dt=date+" "+time;
    var schd =new date(dt);
    var curr_time =new date();
    var timediff=schd-curr_time;

    if(timediff>0){
        addrem(title,description,dt);
        var timeoutid=setTimeout(function(){
            document.getElementById("notify").play();

            var notification=new Notification(title,{
                body: description,
                requireInteraction:true,
            });
        },timediff);
        timeoutids.push(timeoutid);
    }
    else{
        alert("the scheduled timie is past now");
    }

}

function addrem(title,description,dt){
    var tabbody=document.getElementById("tabl");
    var row=tabbody.insertRow();
    var titcell=row.insertCell(0);
    var descell=row.insertCell(1);
    var dtcell=row.insertCell(2);
    var actcell=row.insertCell(3);

    titcell.innerHtml=title;
    descell.innerHtml=description;
    dtcell.innerHtml=st;
    actcell.innerHtml='<button onclick="delrem(this)">Delete</button> ';
}*/


let reminders = [];

// Load from localStorage
document.addEventListener("DOMContentLoaded", () => {
    if ("Notification" in window) {
        Notification.requestPermission();
    }

    const stored = localStorage.getItem("reminders");
    if (stored) {
        reminders = JSON.parse(stored);
        reminders.forEach(rem => addToTable(rem));
    }
});

function schedulerem() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!title || !description || !date || !time) {
        alert("Please fill all fields.");
        return;
    }

    const datetime = `${date} ${time}`;
    const newReminder = { title, description, datetime, completed: false };
    reminders.push(newReminder);
    localStorage.setItem("reminders", JSON.stringify(reminders));
    addToTable(newReminder);

    // Clear form
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
}

function addToTable(reminder) {
    const table = document.getElementById("tabl");
    const row = table.insertRow();

    const titleCell = row.insertCell(0);
    const descCell = row.insertCell(1);
    const dateTimeCell = row.insertCell(2);
    const actionCell = row.insertCell(3);

    titleCell.innerText = reminder.title;
    descCell.innerText = reminder.description;
    dateTimeCell.innerText = reminder.datetime;

    if (reminder.completed) {
        row.classList.add("completed");
    }

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.onclick = () => {
        table.deleteRow(row.rowIndex - 1);
        reminders = reminders.filter(rem => !(rem.title === reminder.title && rem.datetime === reminder.datetime));
        localStorage.setItem("reminders", JSON.stringify(reminders));
    };

    // Complete button
    const completeBtn = document.createElement("button");
    completeBtn.innerText = reminder.completed ? "Completed" : "Mark as Completed";
    completeBtn.disabled = reminder.completed;
    completeBtn.onclick = () => {
        reminder.completed = true;
        row.classList.add("completed");
        completeBtn.disabled = true;
        completeBtn.innerText = "Completed";
        localStorage.setItem("reminders", JSON.stringify(reminders));
    };

    // Add buttons
    actionCell.appendChild(completeBtn);
    actionCell.appendChild(document.createTextNode(" "));
    actionCell.appendChild(delBtn);
}

// Reminder check every minute
setInterval(() => {
    const now = new Date();
    const currentTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    reminders.forEach(reminder => {
        if (!reminder.completed && reminder.datetime === currentTime) {
            document.getElementById("notify").play();

            if (Notification.permission === "granted") {
                new Notification(`⏰ Reminder: ${reminder.title}`, {
                    body: reminder.description,
                    icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
                });
            }

            alert(`Reminder: ${reminder.title}\n${reminder.description}`);
        }
    });
}, 60000);

function pad(num) {
    return num < 10 ? '0' + num : num;
}
