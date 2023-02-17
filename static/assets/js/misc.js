function setup_step(id) {
    document.querySelectorAll("#setup .card-body").forEach((node) => {
        node.style.display = "none";
    });

    document.querySelector("#setup .card-body#" + id).style.display = "block";
}

async function plan_generate(day = 0, dayIsAbsolute = false) {
    let now = new Date();
    if (!dayIsAbsolute) {
        day = Math.floor(now / 8.64e7) + day;
    }

    let today = new Date().toISOString().substring(0, 10);
    let dateEl = document.querySelector("#plan-add-day");
    dateEl.min = today;
    dateEl.value = now.toISOString().substring(0, 10);

    let container = document.querySelector(".page#home tbody");
    container.innerHTML = `<tr><td class="text-center w-100" colspan="6"><span class="spinner-border text-primary"></span></td></tr>`;

    let data;
    try {
        data = await api(`plan/${day}`);
    } catch (e) {
        if (e.code == 404) {
            document.querySelector(".page#home tbody td").innerText =
                _("plan.empty");
            return;
        }
        throw e;
    }

    if (data.length == 0) {
        document.querySelector(".page#home tbody td").innerText =
            _("plan.empty");
        return;
    }

    container.innerHTML = "";

    console.log(data);

    for (let index = 0; index < data.length; index++) {
        const entry = data[index];

        let row = document.createElement("tr");

        let group = document.createElement("td");
        group.innerText = entry.group;
        if (perm.includes("admin")) {
            let btn = document.createElement("button");
            btn.classList.add("btn", "btn-danger", "btn-sm", "py-0", "me-3");
            btn.innerText = _("generic.delete");
            btn.onclick = () => {
                plan_remove(day, index);
            };
            group.prepend(btn);
        }
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
async function plan_add() {
    let day = new Date(document.querySelector("#plan-add-day").valueAsNumber);
    day = Math.floor(day / 8.64e7);

    let data = {
        group: document.querySelector("#plan-add-group").value,
        lesson: document.querySelector("#plan-add-lesson").value,
        subject: document.querySelector("#plan-add-subject").value,
        teacher: document.querySelector("#plan-add-teacher").value,
        room: document.querySelector("#plan-add-room").value,
        note: document.querySelector("#plan-add-note").innerText,
    };
    await api(`admin/plan/${day}/add`, data);
    await plan_generate(day, true);
    document.querySelector("#plan-add form").reset();
}
async function plan_remove(day, number) {
    await api(`admin/plan/${day}/remove/${number}`);
    await plan_generate(day, true);
}
document.querySelector("#plan-add form").addEventListener("submit", (e) => {
    e.preventDefault();
    plan_add();
});
