enum taskState {
    pending = 'PENDING',
    fullfilled = 'FULLFILLED'
}

////////////////////////////////////////

function reranderTasks() {
    const ul: HTMLUListElement = document.querySelector('ul') as HTMLUListElement;
    // копируем все ли из ул
    const liElementsArray: HTMLLIElement[] = Array.from(ul.querySelectorAll('li'));
    const liElementsArrayClone: HTMLLIElement[] = liElementsArray.map(li => li.cloneNode(true) as HTMLLIElement)
    // удаляем все ли со страницы
    if (liElementsArray !== null && liElementsArray.length !== 0) {
        liElementsArray.forEach(li => li.remove());
    }
    // сортируем скопированные ли
    liElementsArrayClone.sort((a, b) => {
        const stateA = a.dataset.state ?? '';
        const stateB = b.dataset.state ?? '';
        return stateB.localeCompare(stateA);
    })
    // выводим на страницу заново и переименовываем кнопки
    liElementsArrayClone.forEach(li => {
        const stateButton = <HTMLButtonElement>li.querySelector('#state');
        if (li.dataset.state === taskState.fullfilled) {
            stateButton.innerText = 'выполнено'
        } else {
            stateButton.innerText = 'не выполнено'
        }
        ul.append(li)});
}

const toggleStateClickHandler: EventListener = function (e: Event) {
    const target = <HTMLButtonElement>e.target;

    if (!target || !(target instanceof HTMLButtonElement)) return

    const li = target.closest('li') as HTMLLIElement;

    if (target.id === 'state') {
        li.dataset.state = li.dataset.state === taskState.pending ? taskState.fullfilled : taskState.pending;
    }

    if (target.id === 'del') {
        li.remove();
    }

    reranderTasks();
}

const openModalClickHandler = function (e: MouseEvent) {
    openModal(template);
}

function openModal(template: HTMLTemplateElement) {
    if (template !== null) {
        const modalFragment = template?.content.cloneNode(true) as DocumentFragment;
        document.body.append(modalFragment);

        const closeModalInput = <HTMLInputElement>document.querySelector('input[name="modal-cancel"]');
        closeModalInput.addEventListener('click', closeModal);

        const modalForm = <HTMLFormElement>document.forms[0];
        modalForm.addEventListener('submit', addTaskOnSubmitkHandler);
    }
}

const addTaskOnSubmitkHandler = function (e: SubmitEvent) {
    // e.preventDefault();
    const form = e.target as HTMLFormElement;
    const textArea = form.elements.namedItem('modalTextarea') as HTMLTextAreaElement;
    console.log(textArea);
    

    let text: string = '';
    if (textArea) {
        text = textArea.value.trim();
        if (!text) {
            closeModal();
            return false;
        }
        const taskTemplate = <HTMLTemplateElement>document.querySelector('#taskTemplate');
        if (taskTemplate !== null) {
            const taskFragment = taskTemplate?.content.cloneNode(true) as DocumentFragment;
            const span = taskFragment.querySelector('span') as HTMLSpanElement;
            span.innerText = text;

            const ul: HTMLUListElement = document.querySelector('ul') as HTMLUListElement;
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
}

function closeModal() {
    const modalDiv = document.querySelector('div.modal-wrapper') as HTMLDivElement;
    modalDiv.remove();
}

const tasksDiv = document.querySelector('.tasksDiv') as HTMLDivElement;
tasksDiv.addEventListener('click', toggleStateClickHandler);

const addButton = document.querySelector('#addButton') as HTMLButtonElement;
addButton.addEventListener('click', openModalClickHandler);

const template = <HTMLTemplateElement>document.querySelector('#modalTemplate');
