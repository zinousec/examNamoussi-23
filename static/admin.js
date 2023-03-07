const DEFAULT_URL = 'https://edu.std-900.ist.mospolytech.ru/api';
const API_KEY = '5c379d66-04f3-44da-95ae-394eb02f2e33';
const ON_ONE_PAGE = 3;
const MAX_TEXT_SELECT_SIZE = 30;
const alertLifetime = 5000;
const adminSorce = '<a href="#">Личный кабинет</a>';
const ruble = "₽";

let alertHolder = document.querySelector('.alert-holder');
let templateAlert = document.querySelector('#alert-template');
let successAlert = document.querySelector('#alert-success');
let dangerAlert = document.querySelector('#alert-danger');
let idRequestDelete =
    document.querySelector('#delete-request').querySelector('.id-request');
let showRequest = document.querySelector('#show-request');
let editRequest = document.querySelector('#edit-request');
let idValue = document.querySelector('#request-id');
let delRequestBtn = document.querySelector('.del-request-btn');
let itemOfAvailableRequests =
    document.querySelector('#template-available-requests');
let availableRequests = document.querySelector('.table-available-requests');
let controlItems = document.querySelector('#control-items');
let templateGuides = document.querySelector('#table-of-guides');
let tableGuides = document.querySelector('.table-guides');
let pageBar = document.querySelector('.pagination-bar');
let sendRequest = document.querySelector('#buttonSendRequest');

async function serverRequest(method, type, params, id) {
    let error = false;
    let data = {};
    let url;
    if (method != undefined && type != undefined) {
        if (method == 'get') {
            if (type == 'routes') {
                if (id != undefined) {
                    // получить список гидов
                    url = new URL(`${DEFAULT_URL}/routes/${id}/guides`);
                } else {
                    // получить список маршрутов
                    url = new URL(`${DEFAULT_URL}/routes`);
                }
            };
            if (type == 'orders') {
                if (id != undefined) {
                    // посмотреть заявку
                    url = new URL(`${DEFAULT_URL}/orders/${id}`);
                } else {
                    // получить спсок заявок
                    url = new URL(`${DEFAULT_URL}/orders`);
                }
            }
            // если нужно получить информацию о конкретном гиде
            if (type == 'guide') {
                if (id != undefined) {
                    url = new URL(`${DEFAULT_URL}/guides/${id}`);
                } else {
                    error = true;
                }
            }
            // если нужно получить информацию о конкретном маршруте
            if (type == 'route') {
                if (id != undefined) {
                    url = new URL(`${DEFAULT_URL}/routes/${id}`);
                } else {
                    error = true;
                }
            }
        }
        if (method == 'post' && type == 'orders') {
            // добавить заявку
            url = new URL(`${DEFAULT_URL}/orders`);
        }
        if ((method == 'put' || method == 'delete')
            && type == 'orders' && id != undefined) {
            // редактировать или удалить заявку
            url = new URL(`${DEFAULT_URL}/orders/${id}`);
        }
    } else {
        error = true;
    }
    let bodyParams;
    if (params && Object.keys(params).length > 0) {
        bodyParams = new URLSearchParams();
        for (let i = 0; i < Object.keys(params).length; i++) {
            bodyParams.set(Object.keys(params)[i],
                params[Object.keys(params)[i]]);
        }
    }
    if (url != undefined) {
        url.searchParams.append('api_key', API_KEY);
        // отправка запросов
        data = await fetch(url, {
            method: method.toUpperCase(),
            body: bodyParams,
        }).then(response => response.json()).then(answer => {
            return answer;
        });
    } else {
        error = true;
    }
    if (error) console.log("Произошла ошибка при обмене данными с сервером");
    return data;
}


function createAlert(type, text) {
    let item = templateAlert.content.firstElementChild.cloneNode(true);
    let alertStyle = item.querySelector('#alertStyle');
    alertStyle.classList.remove('alert-warning');
    alertStyle.classList.remove('alert-success');
    alertStyle.classList.remove('alert-danger');
    if (type == 'warning') {
        alertStyle.classList.add('alert-warning');
        item.querySelector('.text-alert-item').innerHTML = text;
    }
    if (type == 'success') {
        alertStyle.classList.add('alert-success');
        item.querySelector('.text-alert-item').innerHTML = text;
    }
    if (type == 'danger') {
        alertStyle.classList.add('alert-danger');
        item.querySelector('.text-alert-item').innerHTML = text;

    }
    alertHolder.append(item);
    setTimeout(() => item.remove(), alertLifetime);
}

function calculateSummary(guideServiceCost,
    hoursNumber, isThisDayOff, isItMorning,
    isItEvening, numberOfVisitors) {
    let totalCost = 1;
    totalCost *= guideServiceCost;
    totalCost *= hoursNumber;
    if (isThisDayOff) {
        totalCost *= 1.5;
    }
    if (isItMorning) {
        totalCost += 400;
    }
    if (isItEvening) {
        totalCost += 1000;
    }
    if (numberOfVisitors > 5 && numberOfVisitors <= 10) {
        totalCost += 1000;
    }
    if (numberOfVisitors > 10 && numberOfVisitors <= 20) {
        totalCost += 1500;
    }
    return totalCost;
}

function getStartTime(concatDate) {
    let hour = concatDate.getHours();
    let minute = concatDate.getMinutes();
    if (minute % 30 != 0) {
        if (minute > 30) {
            minute = '00';
            hour += 1;
        } else {
            minute = '30';
        }
    }
    if (hour < 9) {
        hour = '09';
        minute = '00';
        return `${hour}:${minute}`;
    }
    if (hour + Number(duration.value) > 23) {
        hour = `${23 - Number(duration.value)}`;
        minute = '00';
    }
    if (minute == 0) minute = '00';
    if (hour < 10) hour = `0${hour}`;
    return `${hour}:${minute}`;
}

function getStartTime(concatDate) {
    let hour = concatDate.getHours();
    let minute = concatDate.getMinutes();
    if (minute % 30 != 0) {
        if (minute > 30) {
            minute = '00';
            hour += 1;
        } else {
            minute = '30';
        }
    }
    if (hour < 9) {
        hour = '09';
        minute = '00';
        return `${hour}:${minute}`;
    }
    if (hour + Number(duration.value) > 23) {
        hour = `${23 - Number(duration.value)}`;
        minute = '00';
    }
    if (minute == 0) minute = '00';
    if (hour < 10) hour = `0${hour}`;
    return `${hour}:${minute}`;
}

function getTodayDate() {
    let dateNow = new Date();
    let year = `${dateNow.getFullYear()}`;
    let month = dateNow.getMonth() + 1 >= 10 ? `${dateNow.getMonth()}` :
        `0${dateNow.getMonth() + 1}`;
    let day = dateNow.getDate() + 1 >= 10 ? `${dateNow.getDate() + 1}` :
        `0${dateNow.getDate() + 1}`;
    return year + "-" + month + "-" + day;
}


function updateModal(event) {
    let modalWindow = document.querySelector("#edit-request");
    let formInputs = modalWindow.querySelector("form").elements;
    let priceGuide = formInputs['priceGuide'];
    let date = formInputs['date'];
    let beginsAt = formInputs['begins-at'];
    let duration = formInputs['duration'];
    let amountOfPeople = formInputs['amount-of-people'];
    let option1 = formInputs['option-1'];
    let option2 = formInputs['option-2'];
    let total = formInputs['summary'];
    let concatDate = new Date(date.value + ' ' + beginsAt.value);
    let dateNow = new Date();
    if (concatDate <= dateNow) {
        date.value = getTodayDate();
        concatDate = new Date(date.value + ' ' + beginsAt.value);
    };
    beginsAt.value = getStartTime(concatDate);
    if (date.value != '' && beginsAt.value != '') {
        let isThisDayOff = concatDate.getDay() == 6 || concatDate.getDay() == 0;
        let isItMorning = concatDate.getHours() >= 9 &&
            concatDate.getHours() <= 12;
        let isItEvening = concatDate.getHours() >= 20 &&
            concatDate.getHours() <= 23;
        let calculatedSummary = calculateSummary(priceGuide.value,
            duration.value, isThisDayOff, isItMorning,
            isItEvening, amountOfPeople.value);
        if (option1.checked) calculatedSummary *= 0.75;
        if (option2.checked) calculatedSummary += (amountOfPeople.value * 500);
        total.value = String(Math.ceil(calculatedSummary)) +
            ' ' + ruble;
        buttonSendRequest.dataset.bsDismiss = 'modal';
    } else {
        delete buttonSendRequest.dataset.bsDismiss;
        console.log('Заполните, пожалуйста все поля');
    }
}


async function controlHandler(event) {
    let action = event.target.dataset.action;
    if (action) {
        let clickOnRow = event.target.closest('.row');
        let idRequest = clickOnRow.querySelector('.id').innerHTML;
        if (action == 'delete') {
            idRequestDelete.innerHTML = `№ ${idRequest}`;
            idValue.value = idRequest;
        }
        if (action == 'show') {
            document.querySelector('#id-request-show').innerHTML = idRequest;
            let dataRequest =
                await serverRequest('get', 'orders', {}, idRequest);
            let dataGuide =
                await serverRequest('get', 'guide', {},
                    dataRequest.guide_id);
            let dataRoute =
                await serverRequest('get', 'route', {},
                    dataRequest.route_id);
            let formInputs = showRequest.querySelector("form").elements;
            let nameGuide = formInputs['guide-name-show'];
            let nameRoute = formInputs['route-name-show'];
            let dateExcursion = formInputs['date-show'];
            let startTime = formInputs['begins-at-show'];
            let duration = formInputs['duration-show'];
            let numberOfPeople = formInputs['amount-of-people-show'];
            let option1 = formInputs['option-1-show'];
            let option2 = formInputs['option-2-show'];
            let totalCost = formInputs['summary-show'];
            nameGuide.value = dataGuide.name;
            nameRoute.value = dataRoute.name;
            dateExcursion.value = dataRequest.date;
            startTime.value = dataRequest.time;
            duration.value = dataRequest.duration;
            numberOfPeople.value = dataRequest.persons;
            option1.checked = Boolean(dataRequest.optionFirst);
            option2.checked = Boolean(dataRequest.optionSecond);
            totalCost.value = dataRequest.price;
        }
        if (action == 'edit') {
            document.querySelector('#id-request-edit').innerHTML = idRequest;
            let dataRequest =
                await serverRequest('get', 'orders', {}, idRequest);
            let dataGuide =
                await serverRequest('get', 'guide', {},
                    dataRequest.guide_id);
            let dataRoute =
                await serverRequest('get', 'route', {},
                    dataRequest.route_id);
            let formInputs = editRequest.querySelector("form").elements;
            let nameGuide = formInputs['guide-name'];
            let priceGuide = formInputs['priceGuide'];
            let nameRoute = formInputs['route-name'];
            let dateExcursion = formInputs['date'];
            let startTime = formInputs['begins-at'];
            let duration = formInputs['duration'];
            let numberOfPeople = formInputs['amount-of-people'];
            let option1 = formInputs['option-1'];
            let option2 = formInputs['option-2'];
            let totalCost = formInputs['summary'];
            nameGuide.value = dataGuide.name;
            priceGuide.value = dataGuide.pricePerHour;
            nameRoute.value = dataRoute.name;
            dateExcursion.value = dataRequest.date;
            dateExcursion.dataset.oldDate = dataRequest.date;
            startTime.value = dataRequest.time;
            startTime.dataset.oldTime = dataRequest.time.slice(0, 5);
            duration.value = dataRequest.duration;
            duration.dataset.oldDuration = dataRequest.duration;
            numberOfPeople.value = dataRequest.persons;
            numberOfPeople.dataset.oldPersons = dataRequest.persons;
            option1.checked = Boolean(dataRequest.optionFirst);
            option1.dataset.oldOption1 = Number(dataRequest.optionFirst);
            option2.checked = Boolean(dataRequest.optionSecond);
            option2.dataset.oldOption2 = Number(dataRequest.optionSecond);
            totalCost.value = dataRequest.price + ' ' + ruble;
            totalCost.dataset.oldTotalCost = dataRequest.price;
        }
    }
}


function createPaginationBtns(page, classes = []) {
    let btn = document.createElement('a');
    for (cls of classes) {
        btn.classList.add(cls);
    }
    btn.classList.add('page-link');
    btn.classList.add('d-flex');
    btn.classList.add('align-items-center');
    btn.dataset.page = page;
    btn.innerHTML = page;
    btn.href = '#label-search-field';
    return btn;
}


async function fillAvailableRoutes(data) {
    availableRequests.innerHTML = '';
    let item =
        itemOfAvailableRequests.content.firstElementChild.cloneNode(true);
    availableRequests.append(item);
    for (let i = 0; i < data.length; i++) {
        item =
            itemOfAvailableRequests.content.firstElementChild.cloneNode(true);
        item.querySelector('.id').innerHTML =
            data[i]['id'];
        let nameRoute = await serverRequest('get',
            'route', {}, data[i]['route_id']);
        item.querySelector('.name').innerHTML =
            nameRoute.name;
        item.querySelector('.date').innerHTML =
            data[i]['date'];
        item.querySelector('.cost').innerHTML =
            data[i]['price'];
        let choose = item.querySelector('.control');
        choose.innerHTML = '';
        choose.onclick = controlHandler;
        itemControl = controlItems.content.firstElementChild.cloneNode(true);
        choose.append(itemControl);
        availableRequests.append(item);
    }
}

function fillPagination(currentPage, totalPages) {
    currentPage = parseInt(currentPage);
    totalPages = parseInt(totalPages);
    let btn;
    let li;
    pageBar.innerHTML = '';
    let buttonsContainer = document.createElement('ul');
    buttonsContainer.classList.add('pagination');
    btn = createPaginationBtns(1, ['first-page-btn']);
    btn.innerHTML = 'Первая';
    li = document.createElement('li');
    li.classList.add('page-item');
    if (currentPage == 1) {
        li.classList.add('disabled');
    }
    li.append(btn);
    buttonsContainer.append(li);
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(currentPage + 2, totalPages);
    for (let i = start; i <= end; i++) {
        let li = document.createElement('li');
        li.classList.add('page-item');
        btn = createPaginationBtns(i, i == currentPage ? ['active'] : []);
        li.append(btn);
        buttonsContainer.append(li);
    }

    btn = createPaginationBtns(totalPages, ['last-page-btn']);
    btn.innerHTML = 'Последняя';
    li = document.createElement('li');
    li.classList.add('page-item');
    if (currentPage == totalPages || totalPages == 0) {
        li.classList.add('disabled');
    }
    li.append(btn);
    buttonsContainer.append(li);
    pageBar.append(buttonsContainer);
}


async function fillAvailableRequest(page, perPage, qParam) {
    let data = await serverRequest('get', 'orders');
    document.querySelector('#allRequests').innerHTML =
        `Заявок: ${data.length}`;
    let renderedData = [];
    let totalPages = Math.ceil(data.length / perPage);
    if (page > totalPages && page < 1) {
        availableRequests.innerHTML = 'Ошибка: выход за \
        пределы доступных страниц';
    } else {
        if (Object.keys(data).length == 0) {
            availableRequests.innerHTML = '';
            pageBar.innerHTML = '';
            let text = 'Заявки не найдены<br>\
                    Чтобы создать заявку, перейдите на \
                    <a href="index.html">главную страницу</a>';
            createAlert('warning', text);
            return;
        }
        let max = Math.min(page * perPage, data.length);
        for (let i = (page - 1) * perPage; i < max; i++) {
            renderedData.push(data[i]);
        }
        await fillAvailableRoutes(renderedData);
        fillPagination(page, totalPages);
    }
}

async function buttonSendRequestHandler(event) {
    let modalWindow = event.target.closest(".modal");
    let form = modalWindow.querySelector("form");
    let formInputs = form.elements;
    if (formInputs['date'].value != '' &&
        formInputs['begins-at'].value) {
        let params = {};
        let dateExcursion = formInputs['date'];
        let startTime = formInputs['begins-at'];
        let duration = formInputs['duration'];
        let numberOfPeople = formInputs['amount-of-people'];
        let option1 = formInputs['option-1'];
        let option2 = formInputs['option-2'];
        let totalCost = formInputs['summary'];
        if (dateExcursion.value != dateExcursion.dataset.oldDate) {
            params.date = dateExcursion.value;
        }
        if (startTime.value.slice(0, 5) != startTime.dataset.oldTime) {
            params.time = startTime.value.slice(0, 5);
        }
        if (duration.value != duration.dataset.oldDuration) {
            params.duration = duration.value;
        }
        if (numberOfPeople.value != numberOfPeople.dataset.oldPersons) {
            params.persons = numberOfPeople.value;
        }
        if (Number(option1.checked) != option1.dataset.oldOption1) {
            params.optionFirst = Number(option1.checked);
        }
        if (Number(option2.checked) != option2.dataset.oldOption2) {
            params.optionSecond = Number(option2.checked);
        }
        if (totalCost.value.split(' ')[0] != totalCost.dataset.oldTotalCost) {
            params.price = totalCost.value.split(' ')[0];
        }
        let idRequest = modalWindow.querySelector('#id-request-edit').innerHTML;
        data = await serverRequest('put', 'orders', params,
            idRequest);
        form.reset();
        // первоначальная загрузка доступных маршрутов и селектора
        fillAvailableRequest(1, ON_ONE_PAGE);
        if (data.id != undefined) {
            let text = `Заявка успешно отредактирована!`;
            createAlert('success', text);
        } else {
            let text = `При редактировании заявки возникла ошибка! <br>\
                    Пожалуйста, попробуйте еще раз.`;
            createAlert('danger', text);
        }
    } else {
        let text = 'Заявка не может быть создана<br>\
                3аполните все необходимые поля.';
        createAlert('warning', text);
    }
}

function fillTableGuides(data) {
    tableGuides.innerHTML = '';
    let itemGuides =
        templateGuides.content.firstElementChild.cloneNode(true);
    tableGuides.append(itemGuides);
    for (let i = 0; i < data.length; i++) {
        itemGuides =
            templateGuides.content.firstElementChild.cloneNode(true);
        itemGuides.dataset.idGuide =
            data[i]['id'];
        itemGuides.querySelector('.name').innerHTML =
            data[i]['name'];
        if (data[i]['language'].includes(' ')) {
            let newData = data[i]['language'].split(' ');
            let langContainer = document.createElement('div');
            langContainer.classList.add('lang-container');
            for (let j = 0; j < newData.length; j++) {
                let langItem = document.createElement('div');
                langItem.classList.add('lang-item');
                langItem.innerHTML = newData[j];
                langContainer.append(langItem);
            }
            itemGuides.querySelector('.lang').innerHTML = '';
            itemGuides.querySelector('.lang').append(langContainer);
        } else {
            itemGuides.querySelector('.lang').innerHTML =
                data[i]['language'];
        }

        itemGuides.querySelector('.exp').innerHTML =
            data[i]['workExperience'];
        itemGuides.querySelector('.price').innerHTML =
            data[i]['pricePerHour'];
        let choose = itemGuides.querySelector('.choose');
        choose.classList.remove('choose');
        choose.classList.add('choose-btn');
        choose.classList.add('d-flex');
        choose.classList.add('justify-content-center');
        choose.classList.add('align-items-center');
        let button = document.createElement('button');
        button.classList.add('button');
        button.dataset.bsToggle = 'modal';
        button.dataset.bsTarget = '#createRequest';
        button.innerHTML = 'Выбрать';
        choose.innerHTML = '';
        choose.append(button);
        tableGuides.append(itemGuides);
    }
}

function generateGuides(data) {
    fillTableGuides(data);
}


async function chooseRoute(event) {
    let row = event.target.closest('.row');
    let idRoute = row.dataset.idRoute;
    let data = await serverRequest('get', 'routes', {}, idRoute);
    let nameRoute = '"' + row.querySelector('.name').innerHTML + '"';
    document.querySelector('.guides-name-of-route').innerHTML = nameRoute;
    generateGuides(data);
}


function availableRoutesSelection(event) {
    fillAvailableRequest(1, ON_ONE_PAGE,);
}

function paginationUsage(event) {
    if (!event.target.classList.contains('page-link')) return;
    if (event.target.classList.contains('disabled')) return;
    fillAvailableRequest(event.target.dataset.page,
        ON_ONE_PAGE,
    );
}

async function searchFieldHandler(event) {
    fillAvailableRequest(1,
        ON_ONE_PAGE,
        event.target.value);
}

async function deleteRequest(event) {
    let id = event.target.closest('.modal').querySelector('#request-id').value;
    let response = await serverRequest('delete', 'orders', {}, id);
    if (response.id == id) {
        let text = `Заявка № ${id} удалена.`;
        createAlert('success', text);
    } else {
        let text = `Возникла ошибка! <br>\
            Пожалуйста, попробуйте еще раз!`;
        createAlert('danger', text);
    }
    fillAvailableRequest(1, ON_ONE_PAGE);
}

window.onload = function () {
    fillAvailableRequest(1, ON_ONE_PAGE);
    document.querySelector('.pagination-bar').onclick = paginationUsage;
    sendRequest.onclick = buttonSendRequestHandler;
    document.querySelector('#date').onchange =
        updateModal;
    document.querySelector('#begins-at').onchange =
        updateModal;
    document.querySelector('#duration').onchange =
        updateModal;
    document.querySelector('#amount-of-people').onchange =
        updateModal;
    editRequest.querySelector('#option-1').onchange =
        updateModal;
    editRequest.querySelector('#option-2').onchange =
        updateModal;
    document.querySelector('#buttonCancel').onclick = function () {
        if (alertContainer.querySelector('.alert-item')) {
            alertContainer.querySelector('.alert-item').remove();
        };
    };
    delRequestBtn.onclick = deleteRequest;
};
