"use strict";
var taskState;
(function (taskState) {
    taskState["pending"] = "PENDING";
    taskState["fullfilled"] = "FULLFILLED";
})(taskState || (taskState = {}));
////////////////////////////////////////
function reranderTasks() {
    const ul = document.querySelector('ul');
    // копируем все ли из ул
    const liElementsArray = Array.from(ul.querySelectorAll('li'));
    const liElementsArrayClone = liElementsArray.map(li => li.cloneNode(true));
    // удаляем все ли со страницы
    if (liElementsArray !== null && liElementsArray.length !== 0) {
        liElementsArray.forEach(li => li.remove());
    }
    // сортируем скопированные ли
    liElementsArrayClone.sort((a, b) => {
        var _a, _b;
        const stateA = (_a = a.dataset.state) !== null && _a !== void 0 ? _a : '';
        const stateB = (_b = b.dataset.state) !== null && _b !== void 0 ? _b : '';
        return stateB.localeCompare(stateA);
    });
    // выводим на страницу заново и переименовываем кнопки
    liElementsArrayClone.forEach(li => {
        const stateButton = li.querySelector('#state');
        if (li.dataset.state === taskState.fullfilled) {
            stateButton.innerText = 'выполнено';
        }
        else {
            stateButton.innerText = 'не выполнено';
        }
        ul.append(li);
    });
}
const toggleStateClickHandler = function (e) {
    const target = e.target;
    if (!target || !(target instanceof HTMLButtonElement))
        return;
    const li = target.closest('li');
    if (target.id === 'state') {
        li.dataset.state = li.dataset.state === taskState.pending ? taskState.fullfilled : taskState.pending;
    }
    if (target.id === 'del') {
        li.remove();
    }
    reranderTasks();
};
const openModalClickHandler = function (e) {
    openModal(template);
};
function openModal(template) {
    if (template !== null) {
        const modalFragment = template === null || template === void 0 ? void 0 : template.content.cloneNode(true);
        document.body.append(modalFragment);
        const closeModalInput = document.querySelector('input[name="modal-cancel"]');
        closeModalInput.addEventListener('click', closeModal);
        const modalForm = document.forms[0];
        modalForm.addEventListener('submit', addTaskOnSubmitkHandler);
    }
}
const addTaskOnSubmitkHandler = function (e) {
    // e.preventDefault();
    const form = e.target;
    const textArea = form.elements.namedItem('modalTextarea');
    console.log(textArea);
    let text = '';
    if (textArea) {
        text = textArea.value.trim();
        if (!text) {
            closeModal();
            return false;
        }
        const taskTemplate = document.querySelector('#taskTemplate');
        if (taskTemplate !== null) {
            const taskFragment = taskTemplate === null || taskTemplate === void 0 ? void 0 : taskTemplate.content.cloneNode(true);
            const span = taskFragment.querySelector('span');
            span.innerText = text;
            const ul = document.querySelector('ul');
            ul.prepend(taskFragment);
        }
        closeModal();
        // reranderTasks();
        return false;
    }
    // closeModal();
    return false;
    // Отменить действие по-умолчанию
    // Проверить, что в текстАреа не пробелы
    // Скопировать данные из текстАреа в переменную
    // Создать li со всему необходимыми тегами и атрибутами (взять из темплэйт,
    // заполнить значениями и текстом)
    // Добавить li в ul
    // Закрыть модалку
    // Ререндер
};
function closeModal() {
    const modalDiv = document.querySelector('div.modal-wrapper');
    modalDiv.remove();
}
const tasksDiv = document.querySelector('.tasksDiv');
tasksDiv.addEventListener('click', toggleStateClickHandler);
const addButton = document.querySelector('#addButton');
addButton.addEventListener('click', openModalClickHandler);
const template = document.querySelector('#modalTemplate');
