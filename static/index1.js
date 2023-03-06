const DEFAULT_URL = 'https://edu.std-900.ist.mospolytech.ru/api';
const API_KEY = 'cfaebacb-7240-41af-9d68-b704ddb0f4fd';
const ON_ONE_PAGE = 10;
const ruble = "₽";
const alertLifetime = 5000;
const adminSorce = '<a href="admin.html">Личный кабинет</a>';

let alertHolder = document.querySelector('.alert-holder');
let templateAlert = document.querySelector('#alert-template');
let successAlert = document.querySelector('#alert-success');
let dangerAlert = document.querySelector('#alert-danger');
let templateRoutes = document.querySelector('#table-walking-routes');
let tableRoutes = document.querySelector('.table-walking-routes');
let templateGuides = document.querySelector('#table-guides');
let tableGuides = document.querySelector('.table-guides');
let searchBlock = document.querySelector('.search-field');
let pageBar = document.querySelector('.pagination-bar');
let sightSelect = document.querySelector('#landmark-select');
let selectedRoute = 0;
let buttonSendRequest = document.querySelector('#buttonSendRequest');

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

async function serverRequest(method, type, params, id) {
    let error = false;
    let data = {};
    let url;
    if (method != undefined && type != undefined) {
        if (method == 'get') {
            if (type == 'routes') {
                if (id != undefined) {
                    url = new URL(`${DEFAULT_URL}/routes/${id}/guides`);
                } else {
                    url = new URL(`${DEFAULT_URL}/routes`);
                }
            };
            if (type == 'orders') {
                if (id != undefined) {
                    url = new URL(`${DEFAULT_URL}/orders/${id}`);
                } else {
                    // получить спсок заявок
                    url = new URL(`${DEFAULT_URL}/orders`);
                }
            }
            if (type == 'guide') {
                if (id != undefined) {
                    url = new URL(`${DEFAULT_URL}/guides/${id}`);
                } else {
                    error = true;
                }
            }
            if (type == 'route') {
                if (id != undefined) {
                    url = new URL(`${DEFAULT_URL}/routes/${id}`);
                } else {
                    error = true;
                }
            }
        }
        if (method == 'post' && type == 'orders') {
            url = new URL(`${DEFAULT_URL}/orders`);
        }
        if ((method == 'put' || method == 'delete')
            && type == 'orders' && id != undefined) {
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
        data = await fetch(url, {
            method: method.toUpperCase(),
            body: bodyParams,
        }).then(response => response.json()).then(answer => {
            return answer;
        });
    } else {
        error = true;
    }
    if (error) console.log("Произошла ошибка");
    return data;
}

function calculateSummary(guideServiceCost,
    hoursNumber, isThisDayOff, isItMorning,
    isItEvening, numberOfVisitors) {
    let total = 1;
    total *= guideServiceCost;
    total *= hoursNumber;
    if (isThisDayOff) {
        total *= 1.5;
    }
    if (isItMorning) {
        total += 400;
    }
    if (isItEvening) {
        total += 1000;
    }
    if (numberOfVisitors > 5 && numberOfVisitors <= 10) {
        total += 1000;
    }
    if (numberOfVisitors > 10 && numberOfVisitors <= 20) {
        total += 1500;
    }
    return total;
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
    let modalWindow = document.querySelector("#createRequest");
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

async function chooseGuide(guideId, el) {
    let allGuides = tableGuides.querySelectorAll(".btn-guides")
    for(let i = 0; i < allGuides.length; i++){
        allGuides[i].innerHTML = "Выбрать!"
        allGuides[i].classList.remove('btn-success')
        allGuides[i].classList.add('btn-light')
    }
    el.innerHTML = "Выбрано!"
    el.classList.remove('btn-light')
    el.classList.add('btn-success')
    let dataGuide = await serverRequest('get',
        'guide', {}, guideId);
    let dataRoute = await serverRequest('get',
        'route', {}, dataGuide.route_id);
    let modalWindow = document.querySelector("#createRequest");
    modalWindow.querySelector('form').reset();
    let formInputs = modalWindow.querySelector("form").elements;
    let guideName = formInputs['guide-name'];
    let idGuide = formInputs['idGuide'];
    let priceGuide = formInputs['priceGuide'];
    let routeName = formInputs['route-name'];
    let idRoute = formInputs['idRoute'];
    let date = formInputs['date'];
    guideName.value = dataGuide.name;
    idGuide.value = dataGuide.id;
    priceGuide.value = dataGuide.pricePerHour;
    routeName.value = dataRoute.name;
    idRoute.value = dataRoute.id;
    date.value = getTodayDate();
    updateModal();
}


async function sendRequest(event) {
    let modalWindow = event.target.closest(".modal");
    let formInputs = modalWindow.querySelector("form").elements;
    if (formInputs['date'].value != '' &&
        formInputs['begins-at'].value) {
        let params = {
            'guide_id': formInputs['idGuide'].value,
            'route_id': formInputs['idRoute'].value,
            'date': formInputs['date'].value,
            'time': formInputs['begins-at'].value.slice(0, 5),
            'duration': formInputs['duration'].value,
            'persons': formInputs['amount-of-people'].value,
            'duration': formInputs['duration'].value,
            'price': formInputs['summary'].value.split(' ')[0],
            'optionFirst': Number(formInputs['option-1'].checked),
            'optionSecond': Number(formInputs['option-2'].checked),
        };
        let data = await serverRequest('post', 'orders', params);
        if (alertHolder.querySelector('.alert-item')) {
            alertHolder.querySelector('.alert-item').remove();
        }
        if (data.id != undefined) {
            let text = `Заявка создана!<br>\
            Перейти в ${adminSorce}`;
            createAlert('success', text);
        } else {
            let text = `Ошибка<br>\
            Перейти на ${adminSorce}`;
            createAlert('danger', text);
        }
    } else {
        if (alertHolder.querySelector('.alert-item')) {
            alertHolder.querySelector('.alert-item').remove();
        }
        let text = 'Заполните все необходимые поля.';
        createAlert('warning', text);
    }
}

function fillTableGuides(data) {
    tableGuides.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        let item =
            templateGuides.content.firstElementChild.cloneNode(true);
        item.dataset.idGuide =
            data[i]['id'];
        item.querySelector('.name').innerHTML =
            data[i]['name'];
        if (data[i]['language'].includes(' ')) {
            let splitedLanguages = data[i]['language'].split(' ');
            let langContainer = document.createElement('div');
            langContainer.classList.add('lang-container');
            for (let j = 0; j < splitedLanguages.length; j++) {
                let langItem = document.createElement('div');
                langItem.classList.add('lang-item');
                langItem.innerHTML = splitedLanguages[j];
                langContainer.append(langItem);
            }
            item.querySelector('.lang').innerHTML = '';
            item.querySelector('.lang').append(langContainer);
        } else {
            item.querySelector('.lang').innerHTML =
                data[i]['language'];
        }
        let exp = data[i]['workExperience'];
        if (exp == 1) {
            item.querySelector('.exp').innerHTML =
                exp + ' год';
        } else {
            if (exp < 5) {
                item.querySelector('.exp').innerHTML =
                    exp + ' года';
            }
            if (exp >= 5) {
                item.querySelector('.exp').innerHTML =
                    exp + ' лет';
            }

        }
        item.querySelector('.price').innerHTML =
            data[i]['pricePerHour'];
        let choose = item.querySelector('.choose');
        choose.classList.remove('choose');
        choose.classList.add('choose-btn');
        choose.classList.add('d-flex');
        choose.classList.add('justify-content-center');
        choose.classList.add('align-items-center');
        let button = `<button class="btn btn-light btn-guides" data-bs-toggle="modal" data-bs-target="#createRequest" onclick="chooseGuide(${item.dataset.idGuide}, this)">Выбрать</button>`;
        choose.innerHTML = '';
        choose.innerHTML = button;
        tableGuides.innerHTML += `<tr><th scope="col">${item.dataset.idGuide}</th>
                                   <td scope="col">${item.querySelector('.name').innerHTML}</td>
                                   <td scope="col">${item.querySelector('.lang').innerHTML}</td>
                                   <td scope="col">${item.querySelector('.exp').innerHTML}</td>
                                   <td scope="col">${item.querySelector('.price').innerHTML}</td>
                                   <td scope="col">${choose.innerHTML}</td></tr>`
    }
}

function generateGuides(data) {
    fillTableGuides(data);
}

async function chooseRoute(idRoute, el) {
    let allRoutes = tableRoutes.querySelectorAll(".btn-routes")
    for(let i = 0; i < allRoutes.length; i++){
        allRoutes[i].innerHTML = "Выбрать!"
        allRoutes[i].classList.remove('btn-success')
        allRoutes[i].classList.add('btn-light')
    }
    el.innerHTML = "Выбрано!"
    el.classList.remove('btn-light')
    el.classList.add('btn-success')
    let dataRoute = await serverRequest('get', 'route',
        {}, idRoute);
    let data = await serverRequest('get', 'routes', {}, idRoute);
    let nameRoute = '"' + dataRoute["name"] + '"';
    document.querySelector('.route-name').innerHTML = nameRoute;
    generateGuides(data);
}

function fillRoutesTable(data) {
    tableRoutes.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        let item =
            templateRoutes.content.firstElementChild.cloneNode(true);
        item.dataset.idRoute =
            data[i]['id'];
        selectedRoute = data[i]['id'];
        item.querySelector('.name').innerHTML =
            data[i]['name'];
        item.querySelector('.desc').innerHTML =
            data[i]['description'];
        item.querySelector('.main-object').innerHTML =
            data[i]['mainObject'];
        let choose = item.querySelector('.choose');
        choose.classList.remove('choose');
        choose.classList.add('choose-btn');
        choose.classList.add('d-flex');
        choose.classList.add('justify-content-center');
        choose.classList.add('align-items-center');
        let button = `<a href="#list-of-guides" class="btn btn-light btn-routes" onclick="chooseRoute(${item.dataset.idRoute}, this)">Выбрать</a>`
        choose.innerHTML = '';
        choose.innerHTML = button;
        tableRoutes.innerHTML += `<tr><th scope="col">${item.dataset.idRoute-1}</th>
                                   <td scope="col">${item.querySelector('.name').innerHTML}</td>
                                   <td scope="col">${item.querySelector('.desc').innerHTML}</td>
                                   <td scope="col">${item.querySelector('.main-object').innerHTML}</td>
                                   <td scope="col">${choose.innerHTML}</td></tr>`
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

function filteredRoutes(data) {
    let mainObj = new Set();
    for (let i = 0; i < Object.keys(data).length; i++) {
        let mainObject = data[i]['mainObject'];
        if (mainObject.includes('-')) {
            mainObject = mainObject.split('-');
            for (let j = 0; j < mainObject.length; j++) {
                mainObj.add(mainObject[j]);
            }
        }
    }
    let resultMainObject = [];
    mainObj.forEach((value) => {
        resultMainObject.push(value);
    });
    resultMainObject.sort();
    let temp = sightSelect.value;
    sightSelect.innerHTML = '';
    let optionElem = document.createElement('option');
    optionElem.innerHTML = '';
    sightSelect.append(optionElem);
    for (let i = 0; i < resultMainObject.length; i++) {
        let optionElem = document.createElement('option');
        optionElem.innerHTML = resultMainObject[i];
        sightSelect.append(optionElem);
    }
    sightSelect.value = temp;
}

async function filterData(qParam) {
    let data = await serverRequest('get', 'routes');
    if (qParam) {
        data = data.filter(value =>
            value['name'].toUpperCase().includes(qParam.toUpperCase()));
    }
    data = data.filter(value =>
        value['mainObject'].includes(sightSelect.value));
    return data;
}

async function fillAvailableRoutes(page, perPage, qParam) {
    let data = await filterData(qParam);
    let renderedData = [];
    let totalPages = Math.ceil(data.length / perPage);
    if (alertHolder.querySelector('.alert-item')) {
        alertHolder.querySelector('.alert-item').remove();
    }
    if (page > totalPages && page < 1) {
        tableRoutes.innerHTML = 'Ошибка: выход за пределы доступных страниц';
    } else {
        if (Object.keys(data).length == 0) {
            tableRoutes.innerHTML = '';
            pageBar.innerHTML = '';
            let text = 'По данному запросу "' + qParam + '" ничего не \
            найдено :(\<br>Пожалуйста, попробуйте изменить запрос \
                    или зайдите позже.';
            createAlert('warning', text);
            return;
        }
        let max = Math.min(page * perPage, data.length);
        for (let i = (page - 1) * perPage; i < max; i++) {
            renderedData.push(data[i]);
        }
        fillRoutesTable(renderedData);
        fillPagination(page, totalPages);
    }
}

function selectionOfRoutes(event) {
    fillAvailableRoutes(1, ON_ONE_PAGE, searchBlock.value);
}

function paginationUsage(event) {
    if (!event.target.classList.contains('page-link')) return;
    if (event.target.classList.contains('disabled')) return;
    fillAvailableRoutes(event.target.dataset.page,
        ON_ONE_PAGE,
        searchBlock.value);
}

async function makeSelection() {
    let data = await filterData(searchBlock.value);
    filteredRoutes(data);
}
async function searchBlockHandler(event) {
    fillAvailableRoutes(1,
        ON_ONE_PAGE,
        event.target.value);
    makeSelection();
}



window.onload = function () {
    fillAvailableRoutes(1, ON_ONE_PAGE);
    makeSelection();
    document.querySelector('.pagination-bar').onclick = paginationUsage;
    searchBlock.oninput = searchBlockHandler;
    sightSelect.onchange = selectionOfRoutes;
    buttonSendRequest.onclick = sendRequest;
    document.querySelector('#date').onchange =
        updateModal;
    document.querySelector('#begins-at').onchange =
        updateModal;
    document.querySelector('#duration').onchange =
        updateModal;
    document.querySelector('#amount-of-people').onchange =
        updateModal;
    document.querySelector('#option-1').onchange =
        updateModal;
    document.querySelector('#option-2').onchange =
        updateModal;
    document.querySelector('#buttonCancel').onclick = function () {
        if (alertHolder.querySelector('.alert-item')) {
            alertHolder.querySelector('.alert-item').remove();
        };
    };
};