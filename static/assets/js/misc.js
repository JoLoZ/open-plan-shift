function setup_step(id) {
    document.querySelectorAll("#setup .card-body").forEach((node) => {
        node.style.display = "none";
    });

    document.querySelector("#setup .card-body#" + id).style.display = "block";
}

async function plan_generate(dayOffset = 0) {
    let now = new Date();
    now = now;
    let day = Math.floor(now / 8.64e7);
    day += dayOffset;

    let data = await api(`plan/${day}`);

    let container = document.querySelector(".page#home tbody");

    container.innerHTML = "";

    console.log(data);

    for (const entry of data) {
        let row = document.createElement("tr");

        let group = document.createElement("td");
        group.innerText = entry.group;
        row.append(group);

        let lesson = document.createElement("td");
        lesson.innerText = entry.lesson;
        row.append(lesson);

        let subject = document.createElement("td");
        subject.innerText = entry.subject;
        row.append(subject);

        let teacher = document.createElement("td");
        teacher.innerText = entry.teacher;
        row.append(teacher);

        let room = document.createElement("td");
        room.innerText = entry.room;
        row.append(room);

        let note = document.createElement("td");
        note.innerText = entry.note;
        row.append(note);

        container.append(row);
    }
}
