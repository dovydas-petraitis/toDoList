// Paskutinio redagavimo laikas
const lastModified = {
    dateTime: ''
};

document.getElementById('addTaskBtn').addEventListener('click', function () {

    //Informaciją iš įvesties
    const taskTitle = document.getElementById('Task-Title').value;
    const priority = document.getElementById('priority-pick').value;
    const dueDate = document.getElementById('pick-date').value;

    // Iterpiame naują eilute
    const tableBody = document.querySelector('tbody');
    const newRow = tableBody.insertRow();

    // Nauja modified date kiekvienam naujam įrašui
    newRow.lastModified = {
        dateTime: ''
    };

    // Naujos eilutės užpildymas į lentelę su atitinkama informacija
    newRow.innerHTML = `
        <th scope="row"><img class="pt-1 table-icons check-icon" src="img/not-check.png"></th>
        <td><div class="checkBtn d-flex align-items-center"><p class="title">${taskTitle}</p></div></td>
        <td scope="row" class="priority" onclick="changePriority(this)">
            <div class="${getPriorityClass(priority)}">${getPriorityText(priority)}</div>
        </td>
        <td scope="row">${dueDate}</td>
        <td scope="row" class="align-middle status new">New</td>
        <td scope="row" class="percent">
            <div class="row align-items-center">
                <div class="col-2"><p class="m-0 progress-text">0%</p></div>
                <div class="col-10">
                    <div class="progress">
                        <div class="progress-bar bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </div>
        </td>
        <td scope="row" class="date">${newRow.lastModified.dateTime}</td>
        <td scope="row"><button type="button" class="text-center btn btn-danger delete-btn">Pašalinti</button></td>
    `;

    // Resetinam įvesties laukus po įvykdymo
    document.getElementById('Task-Title').value = '';
    document.getElementById('priority-pick').value = '1';
    document.getElementById('pick-date').value = '';

    // Delete mygtuko funkcionalumas
    const deleteBtn = newRow.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function () {
        tableBody.removeChild(newRow);
    });

    // Naujai eilutei
    const titleDiv = newRow.querySelector('.title');
    const checkIcon = newRow.querySelector('.check-icon');
    const progressCell = newRow.querySelector('.percent');
    const statusCell = newRow.querySelector('.status');

    // Checkinam ar paspausta ant pavadinimo
    titleDiv.addEventListener('click', function () {
        toggleTaskCompletion(titleDiv, checkIcon, progressCell, statusCell);
        updateLastModified(newRow);
    });

    // Checkinam ar paspausta ant iconeles
    checkIcon.addEventListener('click', function () {
        toggleTaskCompletion(titleDiv, checkIcon, progressCell, statusCell);
        updateLastModified(newRow);
    });

    // Progress bar keitimas per Prompt'ą
    progressCell.addEventListener('click', function () {
        const newProgress = prompt('Užduoties baigtumas (nuo 0 iki 100%):', progressCell.querySelector('.progress-text').textContent.replace('%', ''));
        if (newProgress !== null && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
            updateProgress(newProgress);
            updateLastModified(newRow);
        }
    });

    // Funkcija, atnaujinanti progreso langelį pagal naują reikšmę
    function updateProgress(newProgress) {
        const progressText = progressCell.querySelector('.progress-text');
        const progressBar = progressCell.querySelector('.progress-bar');

        progressText.textContent = newProgress + '%';
        progressBar.style.width = newProgress + '%';

        statusCell.textContent = newProgress === '100' ? 'Completed' : (newProgress === '0' ? 'New' : 'In progress');
        statusCell.className = `status ${newProgress === '100' ? 'completed' : (newProgress === '0' ? 'new' : 'incomplete')}`;

        titleDiv.classList.remove('completed-title');
        const checkIcon = newRow.querySelector('.check-icon');
        if (newProgress === '100') {
            titleDiv.classList.add('completed-title');
            checkIcon.src = 'img/check.png';
        } else {
            titleDiv.classList.remove('completed-title');
            checkIcon.src = 'img/not-check.png';
        }
    }
});

function toggleTaskCompletion(titleDiv, checkIcon, progressCell, statusCell) {
    if (!titleDiv.classList.contains('completed-title')) {
        titleDiv.classList.add('completed-title');
        checkIcon.src = 'img/check.png';
        statusCell.textContent = 'Completed';
        progressCell.querySelector('.progress-text').textContent = '100%';
        progressCell.querySelector('.progress-bar').style.width = '100%';
        statusCell.className = 'status completed';
    } else {
        titleDiv.classList.remove('completed-title');
        checkIcon.src = 'img/not-check.png';
        statusCell.textContent = progressCell.querySelector('.progress-text').textContent === '0%' ? 'New' : 'In progress';
        const currentProgress = parseInt(progressCell.querySelector('.progress-text').textContent);
        progressCell.querySelector('.progress-bar').style.width = currentProgress + '%';
        statusCell.className = `status ${progressCell.querySelector('.progress-text').textContent === '0%' ? 'new' : 'incomplete'}`;
    }
}

// Funkcija, kuri keičia užduoties prioriteto langelį į dropdown meniu
function changePriority(cell) {
    const currentPriority = cell.querySelector('div').textContent;

    const prioritySelect = document.createElement('select');
    prioritySelect.classList.add('form-select');
    prioritySelect.innerHTML = `
        <option value="1">Low</option>
        <option value="2">Medium</option>
        <option value="3">High</option>
    `;
    prioritySelect.value = getPriorityValue(currentPriority);

    // Checkinam ar paspausta ant mygtuko
    prioritySelect.addEventListener('change', function () {
        const newPriority = prioritySelect.value;
        cell.innerHTML = `<div class="${getPriorityClass(newPriority)}">${getPriorityText(newPriority)}</div>`;
        updateLastModified(cell.closest('tr'));
    });

    cell.innerHTML = '';
    cell.appendChild(prioritySelect);
}

// Update paskutinio redagavimo laiką
function updateLastModified(row) {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const period = now.getHours() >= 12 ? 'PM' : 'AM';
    const dateTime = `${month}/${day}/${year} ${hour}:${minute} ${period}`;
    row.lastModified.dateTime = dateTime;
    row.querySelector('.date').textContent = dateTime;
}


// Return atitinkamos reikšmes

function getPriorityValue(priorityText) {
    switch (priorityText) {
        case 'Low':
            return '1';
        case 'Medium':
            return '2';
        case 'High':
            return '3';
        default:
            return '';
    }
}

function getPriorityText(priority) {
    switch (priority) {
        case '1':
            return 'Low';
        case '2':
            return 'Medium';
        case '3':
            return 'High';
        default:
            return '';
    }
}

function getPriorityClass(priority) {
    switch (priority) {
        case '1':
            return 'low_priority';
        case '2':
            return 'normal_priority';
        case '3':
            return 'high_priority';
        default:
            return '';
    }
}
