function setup_step(id) {
    document.querySelectorAll("#setup .card-body").forEach((node) => {
        node.style.display = "none";
    });

    document.querySelector("#setup .card-body#" + id).style.display = "block";
}

let plan_offsetCurrent;
async function plan_generate(
    day = 0,
    dayIsAbsolute = false,
    reverseWeekendHandling = false
) {
    let now = new Date();
    if (!dayIsAbsolute) {
        plan_offsetCurrent = day;
        day = Math.floor(now / 8.64e7) + day;
    }

    let today = new Date().toISOString().substring(0, 10);
    let dateEl = document.querySelector("#plan-add-day");
    dateEl.min = today;
    dateEl.value = now.toISOString().substring(0, 10);

    //Set date string
    let date = new Date(Math.floor(day * 8.64e7));
    document.querySelector("#home.page .date").innerText =
        date.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    if (date.getDay() > 5 || date.getDay() == 0) {
        console.log("Weekend!");
        if (reverseWeekendHandling) {
            plan_offsetCurrent--;
            plan_generate(day - 1, true, true);
        } else {
            plan_offsetCurrent++;
            plan_generate(day + 1, true, false);
        }
        return;
    }

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
        note: document.querySelector("#plan-add-note").value,
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

function plan_move(by) {
    let mod = plan_offsetCurrent + by;
    plan_generate(mod, false, by < 0);
}

function newLessonChange() {
    newChangeShared();
    document
        .querySelector("#plan-add-group")
        .parentElement.classList.remove("d-none");
    document.querySelector("[for='plan-add-lesson']").innerText =
        _("plan.header.lesson");
    document
        .querySelector("#plan-add-subject")
        .parentElement.classList.remove("d-none");
    document.querySelector("[for='plan-add-room']").innerText =
        _("plan.header.room");
}
function newSupervisorChange() {
    newChangeShared();
    document
        .querySelector("#plan-add-group")
        .parentElement.classList.add("d-none");
    document.querySelector("[for='plan-add-lesson']").innerText =
        _("plan.header.time");
    document
        .querySelector("#plan-add-subject")
        .parentElement.classList.add("d-none");
    document.querySelector("[for='plan-add-room']").innerText = _(
        "plan.header.location"
    );
    document.querySelector("#plan-add-subject").value = _(
        "plan.default.supervisor"
    );
}
function newChangeShared() {
    document.querySelector("#plan-add").classList.remove("d-none");
    document.querySelector("#plan-add form").reset();
    document.querySelector("#plan-add-day").value = new Date()
        .toISOString()
        .substring(0, 10);
}

async function keys_list() {
    page("keys");
    let secrets = await api("admin/secrets/list");

    let container = document.querySelector("#key-list tbody");
    container.innerHTML = "";

    for (const secret of secrets) {
        let row = document.createElement("tr");

        let name = document.createElement("td");
        name.innerText = secret.name || "-";
        row.append(name);

        let permissions = document.createElement("td");
        permissions.innerText = secret.permissions.join(", ");
        row.append(permissions);

        let actions = document.createElement("td");
        let btn_delete = document.createElement("button");
        btn_delete.addEventListener("click", async () => {
            await api("admin/secret/remove", { key: secret.hash });
            keys_list();
        });
        btn_delete.classList.add("btn", "btn-danger", "btn-sm", "py-0", "me-3");
        btn_delete.innerText = _("generic.delete");
        if (secret.permissions.includes("superadmin")) {
            btn_delete.disabled = true;
        }
        actions.append(btn_delete);
        row.append(actions);

        container.append(row);
    }
}

document.querySelector("#key-add-form").addEventListener("submit", key_add);
async function key_add(e) {
    e.preventDefault();
    await api("admin/secret/add", {
        key: document.querySelector("#key-add-secret").value,
        name: document.querySelector("#key-add-name").value,
        permissions: document.querySelector("#key-add-permissions").value,
    });
    document.querySelector("#key-add-form").reset();
    keys_list();
}
