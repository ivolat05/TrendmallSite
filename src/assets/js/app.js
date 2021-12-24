//= components/jquery.mCustomScrollbar.js
//= components/jquery.maskedinput.min.js
//= components/jquery.magnific-popup.js
//= components/datepicker.min.js
//= components/jquery.timepicker.min.js
//= components/slick.min.js

//= components/nouislider.min.js

// ползунок выбора цен
let filterSlaiderLine = document.getElementById('filter-slaider-line');
if (filterSlaiderLine) {
    noUiSlider.create(filterSlaiderLine, {
        start: [209, 2090],
        connect: true,
        step: 1,
        range: {
            'min': 0,
            'max': 3000

        }
    });

    let filterSlaiderOne = document.getElementById('filter-slaider-1');
    let filterSlaiderTwo = document.getElementById('filter-slaider-2');
    let filterList = [filterSlaiderOne, filterSlaiderTwo];
    let filterSlaiderLineRemove = document.querySelectorAll('.filter__line-remove')
    let filterInfoBox = document.querySelectorAll('.filter__info-box');

    filterSlaiderLine.noUiSlider.on('update', function (values, handle) {
        filterList[handle].value = Math.round(values[handle]);
    });

    const setfilterSlaider = (i, value) => {
        let arr = [null, null];
        arr[i] = value;
        filterSlaiderLine.noUiSlider.set(arr);
    }

    filterSlaiderLineRemove.forEach((item) => {
        item.addEventListener('click', function () {
            filterSlaiderLine.noUiSlider.set([209, 2090]);
        });
    });

    filterList.forEach((item, index) => {
        item.addEventListener('change', (e) => {
            setfilterSlaider(index, e.currentTarget.value);
        })
    })

    filterInfoBox.forEach((item) => {
        item.addEventListener("click", function () {
            document.querySelector('.filter__price-close').classList.remove('--active');
        })
    })

}

$('.add__share-time').timepicker({
    timeFormat: 'H:mm',
    interval: 10,
    minTime: '0',
    maxTime: '23:59',
    startTime: '00:00',
});
$('.firms__slaider').slick({
    slidesToShow: 8,
    slidesToScroll: 1,
    arrows: false,
    dots: false
});


$('.add__share-date').datepicker();

$(function () {
    $("#telForm").mask("+3(999) 999-99-99");
    $(".telForm-2").mask("+3(999) 999-99-99");
    $(".order__tell").mask("+3(999) 999-99-99");
    $('.popup-content').magnificPopup({
        type: 'inline',
        mainClass: 'mfp-fade'
    });

    // popup close


});
$(window).on("load", function () {
    $(".chat__message-box").mCustomScrollbar({
    });
    $(".chat__user-box").mCustomScrollbar({
    });
    $(".select-checkbox").mCustomScrollbar({
    });
});


function closePopup() {
    $.magnificPopup.close();
}


// select
let select = function () {
    let selectHeader = document.querySelectorAll('.select__header');

    let selectItem = document.querySelectorAll('.select__item');

    selectHeader.forEach((item) => {
        item.addEventListener('click', selectToggle)
    })

    selectItem.forEach((item) => {
        item.addEventListener('click', selectChoose)
    })

    function selectToggle() {
        this.parentElement.classList.toggle('is-active');
    }

    function selectChoose() {
        let text = this.innerText;
        let select = this.closest('.select');
        let currentText = select.querySelector(".select__current");
        currentText.innerText = text;
        select.classList.remove('is-active');
    }


}

// показывать скрывать пароль
function showPassword() {
    let btn = document.querySelectorAll('.cabinet__password-btn');
    let inputPassword = document.querySelectorAll('.input-password');
    btn.forEach((item) => {
        item.addEventListener('click', function () {
            let passwordId = item.getAttribute('data-password');
            let showPassword = document.querySelector(passwordId);
            item.classList.toggle('cabinet__password-btn--active')
            if (showPassword.getAttribute('type') === 'password') {
                showPassword.type = 'text';
            } else {
                showPassword.type = 'password';
            }
        })
    })
}

// tabs 
function tabs() {
    const cabinetBtn = document.querySelectorAll('.cabinet__btn');
    const cabinetTab = document.querySelectorAll('.cabinet__tab');

    cabinetBtn.forEach((item) => {
        item.addEventListener('click', function () {
            let tabId = item.getAttribute('data-tab');
            let currentTab = document.querySelector(tabId);

            cabinetBtn.forEach(function (item) {
                item.classList.remove('cabinet__btn-acive')
            })

            cabinetTab.forEach(function (item) {
                item.classList.remove('cabinet__tab-active')
            })
            item.classList.add('cabinet__btn-acive');
            currentTab.classList.add('cabinet__tab-active');
        });
    });

}

// открытие меню изменения данных
function dataMenuHidden() {
    let cabinetBtnSave = document.querySelector('.cabinet__btn-save');
    let cabinetBtnChange = document.querySelector('.cabinet__btn-change');
    let cabinetDataBox = document.querySelector('.cabinet__data-box ');
    let cabinetDataInner = document.querySelector('.cabinet__data-inner');

    cabinetBtnChange.addEventListener('click', function () {
        cabinetBtnChange.classList.add('cabinet__tab-data--hidden');
        cabinetDataInner.classList.add('cabinet__tab-data--hidden');
        cabinetDataBox.classList.remove('cabinet__tab-data--hidden');
    })
    cabinetBtnSave.addEventListener('click', function () {
        cabinetBtnChange.classList.remove('cabinet__tab-data--hidden');
        cabinetDataInner.classList.remove('cabinet__tab-data--hidden');
        cabinetDataBox.classList.add('cabinet__tab-data--hidden');
    })
};


// product like

function productLike() {
    let productLike = document.querySelectorAll('.product-like');
    productLike.forEach((item) => {
        item.addEventListener('click', function () {
            item.classList.toggle('product-like-active');
        })
    })
}
// product size active
function productSize() {
    let productSizeColl = document.querySelectorAll('.product-size-coll');
    productSizeColl.forEach((item) => {
        item.addEventListener('click', function () {
            item.classList.toggle('product-size-coll--active');
        })
    })
}


// delite document

function fileDell(buttonDell, dataAtr) {
    const myDocumentDell = document.querySelectorAll(buttonDell);
    myDocumentDell.forEach((item) => {
        item.addEventListener('click', function () {
            let tabId = item.getAttribute(dataAtr);
            let myDocument = document.querySelector(tabId);
            myDocument.remove();
        });
    });
}

// btn создания товара

function productCreation() {
    let productCreationBtn = document.querySelector('.product__creation-btn');
    let productPublishBtn = document.querySelector('.product__publish-btn');
    let productCreation = document.querySelector('.product__creation');
    let product__management = document.querySelector('.product__management');

    productCreationBtn.addEventListener('click', function () {
        productCreation.classList.remove('product__creation-hidden');
        product__management.classList.add('product__creation-hidden');
    });

    productPublishBtn.addEventListener('click', function () {
        productCreation.classList.add('product__creation-hidden');
        product__management.classList.remove('product__creation-hidden');
    });
};

// accardion

function accardion() {
    let accordionBtn = document.querySelectorAll('.accordion-btn');
    accordionBtn.forEach((item) => {
        item.addEventListener('click', function () {
            item.classList.toggle('accordion-btn-active');
        })
    })
};


// checboc select
function selectChecbox(inputChecbox, listHtml) {
    let selectChoiseLabel = document.querySelectorAll('.select__choise-label');
    let selectChoiseCheckbox = document.querySelectorAll(inputChecbox)
    selectChoiseLabel.forEach((item) => {
        item.addEventListener('click', function () {
            let choise__list = '';
            for (let i = 0; i < selectChoiseCheckbox.length; i++) {
                if (selectChoiseCheckbox[i].checked == true) {

                    choise__list += selectChoiseCheckbox[i].value;
                    choise__list += ', ';

                }
            }
            document.querySelector(listHtml).innerHTML = choise__list.slice(0, -2)

        })
    })
}


// checkbox filter select

function filterChecbox(inputChecbox, listHtmls, headNums) {
    let selectChoiseLabel = document.querySelectorAll('.select__choise-label');
    let selectChoiseCheckbox = document.querySelectorAll(inputChecbox);
    let listHtml = document.querySelector(listHtmls);
    let selectCheckboxBtnDell = document.querySelectorAll('.select-checkbox-btn-dell');
    let headNum = document.querySelector(headNums);
    selectChoiseLabel.forEach((item) => {
        item.addEventListener('click', function () {

            let sumSize = 0;
            let sumMaterial = 0;
            let sumColor = 0;

            let sumBrand = 0;
            let sumSeason = 0;
            let sumSale = 0;
            let choise__list = [];
            let x = 0;
            for (let i = 0; i < selectChoiseCheckbox.length; i++) {
                if (selectChoiseCheckbox[i].checked == true) {
                    x += 1
                    selectChoiseCheckbox[i].id = 'check_' + x;
                    choise__list.push(selectChoiseCheckbox[i].value)


                    if ('select__choise-size' == selectChoiseCheckbox[i].classList[1]) {
                        sumSize += 1;
                        headNum.innerHTML = sumSize;

                    }
                    if ('select__choise-material' == selectChoiseCheckbox[i].classList[1]) {
                        sumMaterial += 1;
                        document.querySelector('.select__choise-material-title').textContent += sumMaterial;

                    }
                    if ('select__choise-color' == selectChoiseCheckbox[i].classList[1]) {
                        sumColor += 1;
                        document.querySelector('.select__choise-color-title').textContent += sumColor;

                    }

                    if ('select__choise-brand' == selectChoiseCheckbox[i].classList[1]) {
                        sumBrand += 1;
                        document.querySelector('.select__choise-brand-title').textContent += sumBrand;

                    }
                    if ('select__choise-season' == selectChoiseCheckbox[i].classList[1]) {
                        sumSeason += 1;
                        document.querySelector('.select__choise-season-title').textContent += sumSeason;

                    } if ('select__choise-sale' == selectChoiseCheckbox[i].classList[1]) {
                        sumSale += 1;
                        document.querySelector('.select__choise-sale-title').textContent += sumSale;
                    }
                }
            }
            if (headNum.textContent.length > 0) {
                headNum.textContent = '(' + sumSize + ')';
            }
            if (document.querySelector('.select__choise-material-title').textContent.length > 0) {
                document.querySelector('.select__choise-material-title').textContent = '(' + sumMaterial + ')';
            }



            if (document.querySelector('.select__choise-color-title').textContent.length > 0) {
                document.querySelector('.select__choise-color-title').textContent = '(' + sumColor + ')';
            }



            if (document.querySelector('.select__choise-brand-title').textContent.length > 0) {
                document.querySelector('.select__choise-brand-title').textContent = '(' + sumBrand + ')';
            }

            if (document.querySelector('.select__choise-season-title').textContent.length > 0) {
                document.querySelector('.select__choise-season-title').textContent = '(' + sumSeason + ')';
            }

            if (document.querySelector('.select__choise-sale-title').textContent.length > 0) {
                document.querySelector('.select__choise-sale-title').textContent = '(' + sumSale + ')';
            }

            listHtml.textContent = '';
            let y = 0;
            for (let i = 0; i < choise__list.length; i++) {
                let cabinetInputContainer = document.createElement('div');
                y += 1;
                cabinetInputContainer.innerHTML = choise__list[i] + '<button class="filtr__list-close" data-check="check_' + y + '"></button>';
                listHtml.appendChild(cabinetInputContainer);


            }

            function t() {
                let filtrListClose = document.querySelectorAll('.filtr__list-close');
                filtrListClose.forEach((item) => {
                    item.addEventListener('click', () => {
                        let tabId = item.getAttribute('data-check');
                        let currentTab = document.getElementById(tabId);
                        let filtrListClose = document.querySelectorAll('.filtr__list-close');
                        currentTab.checked = false;
                        item.parentElement.remove();
                        if (filtrListClose.length <= 1) {
                            document.querySelector('.filter__list').classList.remove('filter--active');
                        }

                        if (currentTab.classList[1] == 'select__choise-size') {
                            let sizex = document.querySelector('.select__choise-size-title').textContent;
                            let sizey = Number(sizex.replace(')', '').replace('(', '')) - 1;
                            if (sizey <= 0) {
                                document.querySelector('.select__choise-size-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-size-title').textContent = '(' + sizey + ')';
                            }
                        }
                        if (currentTab.classList[1] == 'select__choise-material') {
                            let materialx = document.querySelector('.select__choise-material-title').textContent;
                            let materialy = Number(materialx.replace(')', '').replace('(', '')) - 1;
                            if (materialy <= 0) {
                                document.querySelector('.select__choise-material-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-material-title').textContent = '(' + materialy + ')';
                            }
                        }
                        if (currentTab.classList[1] == 'select__choise-color') {
                            let colorx = document.querySelector('.select__choise-color-title').textContent;
                            let colory = Number(colorx.replace(')', '').replace('(', '')) - 1;
                            if (colory <= 0) {
                                document.querySelector('.select__choise-color-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-color-title').textContent = '(' + colory + ')';
                            }
                        }

                        if (currentTab.classList[1] == 'select__choise-brand') {
                            let brandx = document.querySelector('.select__choise-brand-title').textContent;
                            let brandy = Number(brandx.replace(')', '').replace('(', '')) - 1;
                            if (brandy <= 0) {
                                document.querySelector('.select__choise-brand-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-brand-title').textContent = '(' + brandy + ')';
                            }
                        }
                        if (currentTab.classList[1] == 'select__choise-season') {
                            let seasonx = document.querySelector('.select__choise-season-title').textContent;
                            let seasony = Number(seasonx.replace(')', '').replace('(', '')) - 1;
                            if (seasony <= 0) {
                                document.querySelector('.select__choise-season-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-season-title').textContent = '(' + seasony + ')';
                            }
                        }
                        if (currentTab.classList[1] == 'select__choise-sale') {
                            let salex = document.querySelector('.select__choise-sale-title').textContent;
                            let saley = Number(salex.replace(')', '').replace('(', '')) - 1;
                            if (saley <= 0) {
                                document.querySelector('.select__choise-sale-title').textContent = '';
                            } else {
                                document.querySelector('.select__choise-sale-title').textContent = '(' + saley + ')';
                            }
                        }


                    })
                })

            }
            t();


        })

        document.querySelectorAll('.select-checkbox-btn').forEach((item) => {
            item.addEventListener('click', () => {
                listHtml.classList.add('filter--active');
            })
        })
        document.querySelector('.filter__btn-dell').addEventListener('click', () => {
            listHtml.classList.remove('filter--active');
            for (let i = 0; i < selectChoiseCheckbox.length; i++) {
                if (selectChoiseCheckbox[i].checked == true) {
                    selectChoiseCheckbox[i].checked = false;
                }
                headNum.textContent = '';
                listHtml.textContent = '';
                document.querySelector('.select__choise-material-title').textContent = '';
                document.querySelector('.select__choise-color-title').textContent = '';

                document.querySelector('.select__choise-brand-title').textContent = '';
                document.querySelector('.select__choise-season-title').textContent = '';
                document.querySelector('.select__choise-sale-title').textContent = '';
            }
        })

        selectCheckboxBtnDell.forEach((item) => {
            item.addEventListener('click', () => {

                item.parentElement.parentElement.classList.remove('--active');
                listHtml.classList.remove('filter--active');
                headNum.textContent = '';
                listHtml.textContent = '';
                document.querySelector('.select__choise-material-title').textContent = '';
                document.querySelector('.select__choise-color-title').textContent = '';

                document.querySelector('.select__choise-brand-title').textContent = '';
                document.querySelector('.select__choise-season-title').textContent = '';
                document.querySelector('.select__choise-sale-title').textContent = '';
                for (let i = 0; i < selectChoiseCheckbox.length; i++) {
                    if (selectChoiseCheckbox[i].checked == true) {
                        selectChoiseCheckbox[i].checked = false;
                    }
                }
            })
        })


    })
}



function selectCheckboxActive() {
    let selectCheckboxHeader = document.querySelectorAll('.select-checkbox-header');
    let selectCheckboxBtn = document.querySelectorAll('.select-checkbox-btn');
    selectCheckboxHeader.forEach((item) => {
        item.addEventListener('click', selectToggle)
    })
    function selectToggle() {
        this.parentElement.classList.toggle('--active');
    }
    selectCheckboxBtn.forEach((item) => {
        item.addEventListener('click', selectClose)
    })
    function selectClose() {
        this.parentElement.parentElement.classList.toggle('--active');
    }

}

// удаление добовление placholder creation__textarea

function creationPlacholer() {
    let creationDescriptionTextarea = document.querySelectorAll('.creation__description-textarea');

    creationDescriptionTextarea.forEach((item) => {
        item.addEventListener('click', function () {
            item.classList.add('placholder-del');

        })

        document.addEventListener('click', (e) => { // Вешаем обработчик на весь документ
            creationDescriptionTextarea.forEach((item) => {

                if (!$(item).is(":focus") && item.value == '') {
                    item.classList.remove('placholder-del');
                }
            });
        });

    });

}

// open and close product__promotion 
//btnOpenWindow кнопка открытия скрытого первоночально элемента
//windowHide блок который скрывается
// hideWindow скрытое окно 
// retrunBtn возврощение в первоночальное состояние

function openPromotion(btnOpenWindow, windowHide, hideWindow, retrunBtn) {
    let managementRowBtn = document.querySelectorAll(btnOpenWindow);
    let productManagement = document.querySelector(windowHide);
    let productPromotion = document.querySelector(hideWindow);
    let productPromotionBtn = document.querySelector(retrunBtn);


    managementRowBtn.forEach((item) => {
        item.addEventListener('click', () => {
            productManagement.classList.add('product__creation-hidden');
            productPromotion.classList.remove('product__creation-hidden');
        })
    })

    productPromotionBtn.addEventListener('click', () => {
        productManagement.classList.remove('product__creation-hidden');
        productPromotion.classList.add('product__creation-hidden');
    })

};
// добовлние  точки выдочи заказа
function myDataInsert() {
    let myDataInsertBtn = document.querySelector('.my__data-insert-btn');
    let myDataInsert = document.querySelector('.my__data-insert');
    myDataInsertBtn.addEventListener('click', () => {
        let cabinetInputContainer = document.createElement('span');
        cabinetInputContainer.innerHTML = '<input class="cabinet-input" type="text">'
        myDataInsert.appendChild(cabinetInputContainer);

    })
}


// sale tabs 
function saleTabs() {
    const cabinetBtn = document.querySelectorAll('.sale__tab-btn');
    const cabinetTab = document.querySelectorAll('.sale__tab-wrapp');

    cabinetBtn.forEach((item) => {
        item.addEventListener('click', function () {
            let tabId = item.getAttribute('data-sale');
            let currentTab = document.querySelector(tabId);

            cabinetBtn.forEach(function (item) {
                item.classList.remove('sale__btn-acive')
            })

            cabinetTab.forEach(function (item) {
                item.classList.remove('sale__tab-active')
            })
            item.classList.add('sale__btn-acive');
            currentTab.classList.add('sale__tab-active');
            this.parentElement.parentElement.classList.toggle('--sale__tab-title-hide');
        });
    });

}

// add__share-change tabs 
function saleTabs() {
    const cabinetBtn = document.querySelectorAll('.add__share-change-btn');
    const cabinetTab = document.querySelectorAll('.share-change-tab');

    cabinetBtn.forEach((item) => {
        item.addEventListener('click', function () {
            let tabId = item.getAttribute('data-block');
            let currentTab = document.querySelector(tabId);



            cabinetTab.forEach(function (item) {
                item.classList.remove('share-change-tab--active')
            })

            currentTab.classList.add('share-change-tab--active');

        });
    });

}

function postoffice() {
    let newPostoffice = document.querySelector('.new-postoffice');
    let justinPostoffice = document.querySelector('.justin-postoffice');
    let ykrPostoffice = document.querySelector('.ykr-postoffice');
    let orderPickup = document.querySelector('.orderpickup');
    let labelOrderCheckbox = document.querySelectorAll('.postoffice-check');
    let orderRegistrationRow = document.querySelectorAll('.order__registration-row');

    labelOrderCheckbox.forEach((item) => {
        item.addEventListener('click', () => {
            for (let i = 0; i < labelOrderCheckbox.length; i++) {
                labelOrderCheckbox[i].checked = false;
            }
            item.checked = true;
            for (let i = 0; i < orderRegistrationRow.length; i++) {
                if (orderRegistrationRow[i].classList.contains('order__plasholder-active')) {
                    orderRegistrationRow[i].classList.remove('order__plasholder-active');
                }

            }



            if (newPostoffice.checked) {
                document.querySelector('.new-postoffice-block').classList.add('order__plasholder-active');
            } else if (justinPostoffice.checked) {
                document.querySelector('.justin-postoffice-block').classList.add('order__plasholder-active');
            } else if (ykrPostoffice.checked) {
                document.querySelector('.ykr-postoffice-block').classList.add('order__plasholder-active');
            } else if (orderPickup.checked) {
                document.querySelector('.orderpickup-block').classList.add('order__plasholder-active');
            }
        })

    })
};

function orderBuyChek() {
    const orderBuyChekOne = document.querySelector('.order__buy-chek-1');
    const orderBuyChekTwo = document.querySelector('.order__buy-chek-2');

    orderBuyChekOne.addEventListener('click', () => {
        if (orderBuyChekTwo.checked) {
            orderBuyChekTwo.checked = false;
        }
    })
    orderBuyChekTwo.addEventListener('click', () => {
        if (orderBuyChekOne.checked) {
            orderBuyChekOne.checked = false;
        }
    })

}
// accardion();
// tabs();
// selectCheckboxActive();
// selectChecbox('.select__choise-size', '.select__output-size');
// selectChecbox('.select__checkbox-color', '.select__output-color');
// select();
// showPassword();

// dataMenuHidden();
// productLike();
// productSize();
// myDataInsert();
// fileDell('.my__document-dell', 'data-document');
// fileDell('.foto-dell', 'data-foto');
// productCreation();

// creationPlacholer();
// saleTabs();
// openPromotion('.management__row-btn', '.product__management', '.product__promotion', '.product__promotion-btn');
// openPromotion('.salwsman__order-open', '.salesman__order-container', '.selesman__order-window ', '.order__return-btn');
// openPromotion('.salesman__sale-btn', '.salesman__sale', '.add__share', '.add__share-btn');
// openPromotion('.salesman__sale-btn-2', '.salesman__sale', '.add__share-2', '.add__share-btn-2');
// filterChecbox(".select__choise-checkbox", '.filter__list', '.select__choise-size-title');