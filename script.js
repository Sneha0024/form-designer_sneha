const sampleData = [
    {
        "id": "c0ac49c5-871e-4c72-a878-251de465e6b4",
        "type": "input",
        "label": "Sample Label",
        "placeholder": "Sample placeholder"
    },
    {
        "id": "146e69c2-1630-4a27-9d0b-f09e463a66e4",
        "type": "select",
        "label": "Sample Label",
        "options": ["Sample Option", "Sample Option", "Sample Option"]
    },
    {
        "id": "45002ecf-85cf-4852-bc46-529f94a758f5",
        "type": "input",
        "label": "Sample Label",
        "placeholder": "Sample Placeholder"
    },
    {
        "id": "680cff8d-c7f9-40be-8767-e3d6ba420952",
        "type": "textarea",
        "label": "Sample Label",
        "placeholder": "Sample Placeholder"
    },
];

const formElementsContainer = document.getElementById('form-elements');

function renderFormElements() {
    formElementsContainer.innerHTML = '';
    sampleData.forEach(element => {
        const div = document.createElement('div');
        div.className = 'form-element';
        div.setAttribute('draggable', true);
        div.dataset.id = element.id;

        if (element.type === 'input') {
            div.innerHTML = `
                <label>${element.label}</label>
                <input type="text" placeholder="${element.placeholder}">
                <button class="delete-btn"><i class="fas fa-trash"></i>Delete</button>
            `;
        } else if (element.type === 'select') {
            const options = element.options.map(opt => `
                <option value="${opt}">${opt}</option>
            `).join('');
            div.innerHTML = `
                <label>${element.label}</label>
                <div class="select-wrapper">
            <i class="fas fa-chevron-down"></i>
                    <select>${options}</select>
                </div>
                <button class="add-option-btn"><i class="fas fa-plus"></i> Add Option</button>
                <button class="delete-btn"><i class="fas fa-trash"></i>Delete</button>
                <div class="options-container">
                    ${element.options.map(opt => `
                        <div class="select-option">
                            <span>${opt}</span>
                            <button class="delete-option-btn"><i class="fas fa-trash"></i>Delete Option</button>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (element.type === 'textarea') {
            div.innerHTML = `
                <label>${element.label}</label>
                <textarea placeholder="${element.placeholder}"></textarea>
                <button class="delete-btn"><i class="fas fa-trash"></i>Delete</button>
            `;
        }

        formElementsContainer.appendChild(div);
    });
    addDragAndDropHandlers();
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

document.getElementById('add-input').addEventListener('click', () => {
    sampleData.push({
        id: generateId(),
        type: 'input',
        label: 'New Input',
        placeholder: 'New Placeholder'
    });
    renderFormElements();
});

document.getElementById('add-select').addEventListener('click', () => {
    sampleData.push({
        id: generateId(),
        type: 'select',
        label: 'New Select',
        options: ['Option 1', 'Option 2', 'Option 3']
    });
    renderFormElements();
});

document.getElementById('add-textarea').addEventListener('click', () => {
    sampleData.push({
        id: generateId(),
        type: 'textarea',
        label: 'New Textarea',
        placeholder: 'New Placeholder'
    });
    renderFormElements();
});

formElementsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.parentElement.dataset.id;
        const index = sampleData.findIndex(element => element.id === id);
        sampleData.splice(index, 1);
        renderFormElements();
    } else if (e.target.classList.contains('delete-option-btn')) {
        const selectId = e.target.closest('.form-element').dataset.id;
        const optionText = e.target.previousElementSibling.textContent;
        const selectIndex = sampleData.findIndex(element => element.id === selectId);
        const optionIndex = sampleData[selectIndex].options.indexOf(optionText);
        sampleData[selectIndex].options.splice(optionIndex, 1);
        renderFormElements();
    } else if (e.target.classList.contains('add-option-btn')) {
        const selectId = e.target.parentElement.dataset.id;
        const selectIndex = sampleData.findIndex(element => element.id === selectId);
        sampleData[selectIndex].options.push('New Option');
        renderFormElements();
    }
});

document.getElementById('save-form').addEventListener('click', () => {
    console.log(JSON.stringify(sampleData, null, 2));
});

let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter() {
    this.classList.add('over');
}

function handleDragLeave() {
    this.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
        const srcId = dragSrcEl.dataset.id;
        const targetId = this.dataset.id;
        const srcIndex = sampleData.findIndex(element => element.id === srcId);
        const targetIndex = sampleData.findIndex(element => element.id === targetId);
        [sampleData[srcIndex], sampleData[targetIndex]] = [sampleData[targetIndex], sampleData[srcIndex]];
    }

    return false;
}

function handleDragEnd() {
    const formElements = document.querySelectorAll('.form-element');
    formElements.forEach(element => {
        element.classList.remove('dragging');
        element.classList.remove('over');
    });
}

function addDragAndDropHandlers() {
    const formElements = document.querySelectorAll('.form-element');
    formElements.forEach(element => {
        element.addEventListener('dragstart', handleDragStart, false);
        element.addEventListener('dragenter', handleDragEnter, false);
        element.addEventListener('dragover', handleDragOver, false);
        element.addEventListener('dragleave', handleDragLeave, false);
        element.addEventListener('drop', handleDrop, false);
        element.addEventListener('dragend', handleDragEnd, false);
    });
}

renderFormElements();
