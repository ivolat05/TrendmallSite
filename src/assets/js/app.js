//= components/jquery.mCustomScrollbar.js
//= components/jquery.maskedinput.min.js
//= components/jquery.magnific-popup.js

$(function () {
    $("#telForm").mask("+3(999) 999-99-99");
    $(".telForm-2").mask("+3(999) 999-99-99");
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

// delite document

function fileDell() {
    const myDocumentDell = document.querySelectorAll('.my__document-dell');
    myDocumentDell.forEach((item) => {
        item.addEventListener('click', function () {
            let tabId = item.getAttribute('data-document');
            let myDocument = document.querySelector(tabId);
            myDocument.remove();
        });
    });
}

select();
showPassword();
tabs();
dataMenuHidden();
productLike();
productSize();
myDataInsert();
fileDell();