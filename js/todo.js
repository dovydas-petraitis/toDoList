// Paskutinio redagavimo laikas
const lastModified = {
    dateTime: ''
};

// Užduočių krovimas iš local storage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const tableBody = document.querySelector('tbody');

    tasks.forEach(task => {
        const newRow = tableBody.insertRow();

        newRow.lastModified = {
            dateTime: task.dateTime
        };

        newRow.innerHTML = `
            <th scope="row"><img class="pt-1 table-icons check-icon" src="${task['check-img'] || 'img/not-check.png'}"></th>
            <td><div class="checkBtn d-flex align-items-center"><p class="title">${task.taskTitle}</p></div></td>
            <td scope="row" class="priority" onclick="changePriority(this)">
                <div class="${getPriorityClass(task.priority)}">${getPriorityText(task.priority)}</div>
            </td>
            <td scope="row">${task.dueDate}</td>
            <td scope="row" class="align-middle status ${getStatusClass(task.status)}">${task.status}</td>
            <td scope="row" class="percent">
                <div class="row align-items-center">
                    <div class="col-2"><p class="m-0 progress-text">${task.progress}%</p></div>
                    <div class="col-10">
                        <div class="progress">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${task.progress}%" aria-valuenow="${task.progress}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            </td>
            <td scope="row" class="date">${task.dateTime}</td>
            <td scope="row"><button type="button" class="text-center btn btn-danger delete-btn">Pašalinti</button></td>
        `;

        const deleteBtn = newRow.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function () {
            tableBody.removeChild(newRow);
            updateLocalStorage();
        });

        const titleDiv = newRow.querySelector('.title');
        const checkIcon = newRow.querySelector('.check-icon');
        const progressCell = newRow.querySelector('.percent');
        const statusCell = newRow.querySelector('.status');

        titleDiv.addEventListener('click', function () {
            toggleTaskCompletion(titleDiv, checkIcon, progressCell, statusCell);
            updateLastModified(newRow);
            updateLocalStorage();
        });

        checkIcon.addEventListener('click', function () {
            toggleTaskCompletion(titleDiv, checkIcon, progressCell, statusCell);
            updateLastModified(newRow);
            updateLocalStorage();
        });

        progressCell.addEventListener('click', function () {
            const newProgress = prompt('Užduoties baigtumas (nuo 0 iki 100%):', task.progress);
            if (newProgress !== null && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
                updateProgress(newProgress);
                updateLastModified(newRow);
                updateLocalStorage();
            }
        });

        function updateProgress(newProgress) {
            const progressText = progressCell.querySelector('.progress-text');
            const progressBar = progressCell.querySelector('.progress-bar');

            progressText.textContent = newProgress + '%';
            progressBar.style.width = newProgress + '%';

            statusCell.textContent = newProgress === '100' ? 'Completed' : (newProgress === '0' ? 'New' : 'In progress');
            statusCell.className = `status ${getStatusClass(statusCell.textContent)}`;

            titleDiv.classList.remove('completed-title');
            const checkIcon = newRow.querySelector('.check-icon');
            if (newProgress === '100') {
                titleDiv.classList.add('completed-title');
                checkIcon.src = 'img/check.png';
                task['check-img'] = 'img/check.png';
                task['completed-title'] = true;
            } else {
                titleDiv.classList.remove('completed-title');
                checkIcon.src = 'img/not-check.png';
                task['check-img'] = 'img/not-check.png';
                task['completed-title'] = false;
            }
            updateLastModified(newRow);
        }
    });
}

// Užduočių išsaugojimas į local storage
function updateLocalStorage() {
    let tasks = [];
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach((row, index) => {
        const titleDiv = row.querySelector('.title');
        const checkIcon = row.querySelector('.check-icon');

        tasks.push({
            taskTitle: titleDiv.textContent,
            priority: getPriorityValue(row.querySelector('.priority div').textContent),
            dueDate: row.querySelector(':nth-child(4)').textContent,
            status: row.querySelector('.status').textContent,
            progress: parseInt(row.querySelector('.progress-text').textContent),
            dateTime: row.querySelector('.date').textContent,
            'check-img': checkIcon.src,
            'completed-title': titleDiv.classList.contains('completed-title')
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Puslapio krovimo metu įkeliam užduotis iš local storage
document.addEventListener('DOMContentLoaded', function () {
    loadTasksFromLocalStorage();
});

document.getElementById('addTaskBtn').addEventListener('click', function () {
    const taskTitle = document.getElementById('Task-Title').value;
    const priority = document.getElementById('priority-pick').value;
    const dueDate = document.getElementById('pick-date').value;

    if (taskTitle=="") {
        alert('Pamiršote įvesti užduoties pavadinimą.');
        return;
    }

    const tableBody = document.querySelector('tbody');
    const newRow = tableBody.insertRow();

    newRow.lastModified = {
        dateTime: ''
    };

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

    document.getElementById('Task-Title').value = '';
    document.getElementById('priority-pick').value = '1';
    document.getElementById('pick-date').value = '';

    const deleteBtn = newRow.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function () {
        tableBody.removeChild(newRow);
        updateLocalStorage();
    });

    const titleDiv = newRow.querySelector('.title');
    const checkIcon = newRow.querySelector('.check-icon');
    const progressCell = newRow.querySelector('.percent');
    const statusCell = newRow.querySelector('.status');

    titleDiv.addEventListener('click', function () {
        toggleTaskCompletion(titleDiv, checkIcon, progressCell, statusCell);
        updateLastModified(newRow);
        updateLocalStorage();
    });

    checkIcon.addEventListener('click', function () {
        toggleTaskCompletion(titleDiv, checkIcon, progressCell, statusCell);
        updateLastModified(newRow);
        updateLocalStorage();
    });

    progressCell.addEventListener('click', function () {
        const newProgress = prompt('Užduoties baigtumas (nuo 0 iki 100%):', progressCell.querySelector('.progress-text').textContent.replace('%', ''));
        if (newProgress !== null && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
            updateProgress(newProgress);
            updateLastModified(newRow);
            updateLocalStorage();
        }
    });

    function updateProgress(newProgress) {
        const progressText = progressCell.querySelector('.progress-text');
        const progressBar = progressCell.querySelector('.progress-bar');

        progressText.textContent = newProgress + '%';
        progressBar.style.width = newProgress + '%';

        statusCell.textContent = newProgress === '100' ? 'Completed' : (newProgress === '0' ? 'New' : 'In progress');
        statusCell.className = `status ${getStatusClass(statusCell.textContent)}`;

        titleDiv.classList.remove('completed-title');
        const checkIcon = newRow.querySelector('.check-icon');
        if (newProgress === '100') {
            titleDiv.classList.add('completed-title');
            checkIcon.src = 'img/check.png';
            task['check-img'] = 'img/check.png';
            task['completed-title'] = true;
        } else {
            titleDiv.classList.remove('completed-title');
            checkIcon.src = 'img/not-check.png';
            task['check-img'] = 'img/not-check.png';
            task['completed-title'] = false;
        }
    }
    updateLocalStorage();

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
        statusCell.className = `status ${getStatusClass(statusCell.textContent)}`;
    }
}

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

    prioritySelect.addEventListener('change', function () {
        const newPriority = prioritySelect.value;
        cell.innerHTML = `<div class="${getPriorityClass(newPriority)}">${getPriorityText(newPriority)}</div>`;
        updateLastModified(cell.closest('tr'));
        updateLocalStorage();
    });

    cell.innerHTML = '';
    cell.appendChild(prioritySelect);
}

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

function getStatusClass(status) {
    switch (status) {
        case 'New':
            return 'new';
        case 'In progress':
            return 'incomplete';
        case 'Completed':
            return 'completed';
        default:
            return '';
    }
}
