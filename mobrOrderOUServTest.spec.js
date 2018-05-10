/**
 * Created by Admin on 08.12.2017.
 */
/* jshint expr: true, maxstatements: 20, undef: false */
// Уточняем параметры jsHint.
// expr - убрать предупреждение для функций без (): expect(...).to.have.been.called или expect(...).to.be.ok
// maxstatements - множественные describe/it/expect одного уровня в одной группе describe или it
// undef - не проверять не объявленные переменные (глобальные)
/* jshint expr: true, maxstatements: 20, undef: false */
/* globals protractor, browser, chai, expect, chaiAsPromised, EC, TEST_PARAM, element */ // jshint ignore:line

'use strict';

const fs = require('fs');


describe('# Заявление на зачисление в образовательное учреждение ', function (done) {
  before('1 Авторизация пользователя-отправителя', function (done) {
    this.timeout(20000);
    browser.get(TEST_PARAM.rpguUrl);
    checkAndClick(element(by.xpath('//*[@id="popular-services"]/div[2]/a')));
    browser.wait(EC.visibilityOf(element(by.className('mt10 mb0'))), 10000, 'Страница не загрузилась');
    checkAuthorization(()=>{
      browser.manage().getCookies().then((cockiesItems)=> {
        cockiesItems.forEach((item) => {
          if (item.name === 'JSESSIONID') {
            fs.writeFileSync('./e-yakutia_session.csv', item.value);
            console.log('JSESSIONID', item.value);
          }
        });
        done();
      });
    });
  });

  let arrTime = [];
  const ITER = 10;
  for (let i = 0; i < ITER ; i++) {
    testService(i, (timeRes) => {
      console.log('Время выполнения шага ', arrTime.length, timeRes);
      arrTime.push(timeRes);
      if (arrTime.length >= ITER) {
        console.log('Время выполнения', arrTime);
      }
    });
  }
});

/**
 * Функция для заполнения полей в заявлении на запись в 1 класс
 * @param {Function} i - счетчик цикла, количество тестов в одном окне
 * @param {Function} callback
 */
function testService(i, callback) {
  let curDateTime = new Date();

  let testRPGU = 'Шаг теста ' + i + ' ' + curDateTime.toISOString();

  describe('Шаг ' + i, function () {
    before('Начало теста', function () {
      console.time(testRPGU);
    });
    describe('Прохождение до формы', function () {
      it('Пользователь авторизован', () => {
        browser.get(TEST_PARAM.rpguUrl);
        checkAndClick(element(by.xpath('.//*[@id="popular-services"]/div[2]/a')));
        browser.wait(EC.visibilityOf(element(by.className('mt10 mb0'))), 2000, 'Страница не загрузилась');
      });
      it('Открываем форму услуги по ссылке', function () {
        browser.get('https://e-yakutia.ru/bs/lk/create/MOBR6OrderOUServTest.htm')
          .then(() => {
            browser.wait(EC.visibilityOf(element(by.tagName('h1'))), 2000, 'Страница не загрузилась');
          });
      });
      it('Отменяем открытие черновика если он появился', function () {
        let draftConfirm = element(by.id('draftDialogDiv'));
        draftConfirm.isDisplayed()
          .then((logic) => {
            if (logic) {
              checkAndClick(element(by.id('closeBtn')));
            }
          });
      });
    });
    describe('Заполняем группу ОФОРМЛЕНИЕ УСЛУГИ', function () {
      it('Открываем атрибут Выберите район, в котором находится образовательное учреждение', function () {
        let districtOKATO = element(by.id('row_districtOKATO'))
          .element(by.className('col-md-9 attr-data'));
        checkAndClick(districtOKATO);
      });
      it('Выбираем Район', function () {
        element(by.id('row_districtOKATO'))
          .element(by.className('col-md-9 attr-data'))
          .element(by.id('id_districtOKATO'))
          .all(by.tagName('option')).filter(function (list) {
          return list.getAttribute('value').then(function (text) {
            return text === '98401000000@Di64401000000.dictionaries';
          });
        }).click();
      });
    });
    describe('Заполняем группу СВЕДЕНИЯ О ЗАЯВИТЕЛЕ', function () {
      it('Переходим в группу СВЕДЕНИЯ О ЗАЯВИТЕЛЕ', function () {
        checkAndClick(element(by.id('group_10497718')))
          .then(() => {
            element(by.id('group_10497718')).getAttribute('class')
              .then((style) => {
                expect(style).to.be.equal('active', 'Группа не активна');
              });
          });
      });
      it('Выбираем значение в атрибуте Статус заявителя', function () {
        let declarantStatus = element(by.id('row_DeclarantStatus'))
          .element(by.className('col-md-9 attr-data'));
        checkAndClick(declarantStatus)
          .then(() => {
            declarantStatus.element(by.id('id_DeclarantStatus')).all(by.tagName('option'))
              .filter((list) => {
                return list.getAttribute('value').then((text) => {
                  return text === '1@DiDeclarantStatus.dictionaries';
                });
              }).click();
          });
      });
      it('Заполняем атрибут Фамилия', function () {
        element(by.id('id_DeclarantSurname')).sendKeys('Тестов');
        element(by.id('id_DeclarantSurname')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('Тестов');
          });
      });
      it('Заполняем атрибут Имя', function () {
        element(by.id('id_DeclarantName')).sendKeys('Тест');
        element(by.id('id_DeclarantName')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('Тест');
          });
      });
      it('Заполняем атрибут Отчество', function () {
        element(by.id('id_DeclarantMiddlename')).sendKeys('Тестович');
        element(by.id('id_DeclarantMiddlename')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('Тестович');
          });
      });
      it('Дата рождения', function () {
        element(by.id('cal_DeclarantBirthDate')).sendKeys('01.01.1980')
          .then(function () {
            checkAndClick(element(by.className('ui-state-default ui-state-active')));
          });
        element(by.id('cal_DeclarantBirthDate')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('01.01.1980');
          });
      });
      it('СНИЛС', function () {
        element(by.id('id_DeclarantSNILS')).sendKeys('00000060002');
        element(by.id('id_DeclarantSNILS')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('00000060002');
          });
      });
    });
    describe('Заполняем группу ДОКУМЕНТ, УДОСТОВЕРЯЮЩИЙ ЛИЧНОСТЬ ЗАЯВИТЕЛЯ', function () {
      before('Ждем группу документы', () => {
        browser.wait(EC.elementToBeClickable(element(by.id('group_10497714'))), 10000);
      });
      it('Переходим в группу ДОКУМЕНТ, УДОСТОВЕРЯЮЩИЙ ЛИЧНОСТЬ ЗАЯВИТЕЛЯ', function () {
        checkAndClick(element(by.id('group_10497714')))
          .then(() => {
            element(by.id('group_10497714')).getAttribute('class')
              .then((style) => {
                expect(style).to.be.equal('active', 'Группа не активна');
              });
          });
      });
      it('Атрибут Документ удостоверяющий личность заполнен', function () {
        let declarantIdentityType = element(by.id('row_DeclarantIdentityType'))
          .element(by.className('col-md-9 attr-data'));
        checkAndClick(declarantIdentityType)
          .then(() => {
            declarantIdentityType.element(by.id('id_DeclarantIdentityType')).all(by.tagName('option'))
              .filter((list) => {
                return list.getAttribute('value').then((text) => {
                  return text === '21@DiIdentity.dictionaries';
                });
              }).click();
          });
      });
      it('Вносим серию', function () {
        element(by.id('id_DeclarantIdentitySerial')).sendKeys('1111');
        element(by.id('id_DeclarantIdentitySerial')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('11 11');
          });
      });
      it('Вносим Номер', function () {
        element(by.id('id_DeclarantIdentityNumber')).sendKeys('111111');
        element(by.id('id_DeclarantIdentityNumber')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('111111');
          });
      });
      it('Дата Выдачи', function () {
        element(by.id('cal_DeclarantIdentityDate')).sendKeys('01.01.1980')
          .then(function () {
            checkAndClick(element(by.className('ui-state-default ui-state-active')));
          });
        element(by.id('cal_DeclarantIdentityDate')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('01.01.1980');
          });
      });
      it('Вносим Организация, выдавшая документ', function () {
        element(by.id('id_DeclarantIdentityPlace')).sendKeys('Тестовая организация');
        element(by.id('id_DeclarantIdentityPlace')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('Тестовая организация');
          });
      });
    });
    describe('Заполняем группу ПАРАМЕТРЫ ОБРАТНОЙ СВЯЗИ', function () {
      it('Переходим в группу ПАРАМЕТРЫ ОБРАТНОЙ СВЯЗИ', function () {
        checkAndClick(element(by.id('group_10497713')))
          .then(() => {
            element(by.id('group_10497713')).getAttribute('class')
              .then((style) => {
                expect(style).to.be.equal('active', 'Группа не активна');
              });
          });
      });
      it('Заполняем атрибут Телефон', function () {
        element(by.id('id_Phone')).sendKeys('1234567890');
      });
      it('Заполняем атрибут Электронны адрес', function () {
        element(by.id('id_Email')).sendKeys('a@a.com');
      });
      it('Кликаем поле Адрес', function () {
        checkAndClick(element(by.name('PostAddress')));
      });
      it('Ждем окно атрибута Адрес', function () {
        let addressForm = element(by.id('linkobj_PostAddress'));
        browser.wait(EC.visibilityOf(addressForm), 1000, 'Не вижу поле Адрес');
      });
      it('Атрибут Страна заполнен', function () {
        element(by.id('title_country')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('Россия');
          });
      });
      it('Атрибут Субъект федерации заполнен', function () {
        element(by.id('title_subjectFederation')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('Саха /Якутия/ Респ');
          });
      });
      it('Открываем атрибут Населенный пункт', function () {
        checkAndClick(element(by.id('title_town')));
      });
      it('Выбираем Населенный пункт', function () {
        element(by.id('searchDiv_town'))
          .element(by.id('search_town'))
          .all(by.tagName('option')).filter(function (list, index) {
          return list.getAttribute('innerText').then(function (text) {
            return text === 'с Абый';
          });
        }).click();
      });
      it('Вносим Индекс', function () {
        element(by.id('id_zipCode')).sendKeys('111111');
        element(by.id('id_zipCode')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('111111');
          });
      });
      it('Открываем атрибут Улица', function () {
        checkAndClick(element(by.id('title_street')));
      });
      it('Выбираем Улица', function () {
        element(by.id('searchDiv_street'))
          .element(by.id('search_street'))
          .all(by.tagName('option')).filter(function (list, index) {
          return list.getAttribute('innerText').then(function (text) {
            return text === 'ул Баронова';
          });
        }).click();
      });
      it('Вносим Номер дома', function () {
        element(by.id('id_houseNumber')).sendKeys('1');
        element(by.id('id_houseNumber')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('1');
          });
      });
      it('Вносим Номер квартиры', function () {
        element(by.id('id_flatNumber')).sendKeys('2');
        element(by.id('id_flatNumber')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('2');
          });
      });
      it('Сохранить Адрес', function () {
        checkAndClick(element(by.name('saveEnter')));
        browser.sleep(3000); // TODO найти на форме элемент который проявляется после сохранения и его ждать
      });
    });
    describe('Заполняем группу РЕБЕНОК', function () {
      it('Переходим в группу РЕБЕНОК', function () {
        checkAndClick(element(by.id('group_10497719')))
          .then(() => {
            element(by.id('group_10497719')).getAttribute('class')
              .then((style) => {
                expect(style).to.be.equal('active', 'Группа не активна');
              });
          });
      });
      it('Заполняем атрибут Фамилия', function () {
        element(by.id('id_ChildSurname')).sendKeys('ТестовРебенок');
        element(by.id('id_ChildSurname')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('ТестовРебенок');
          });
      });
      it('Заполняем атрибут Имя', function () {
        element(by.id('id_ChildName')).sendKeys('ТестРебенок');
        element(by.id('id_ChildName')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('ТестРебенок');
          });
      });
      it('Заполняем атрибут Отчество', function () {
        element(by.id('id_ChildMiddlename')).sendKeys('ТестовичРебенок');
        element(by.id('id_ChildMiddlename')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('ТестовичРебенок');
          });
      });
      it('Дата рождения', function () {
        element(by.id('cal_ChildBirthDate')).sendKeys('01.01.2010')
          .then(function () {
            checkAndClick(element(by.className('ui-state-default ui-state-active')));
          });
        element(by.id('cal_ChildBirthDate')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('01.01.2010');
          });
        browser.sleep(2000);
      });
      it('Кликаем поле Адрес регистрации', function () {
        checkAndClick(element(by.name('ChildAddress')));
      });
      it('Ждем окно атрибута Адрес регистрации', function () {
        let addressForm = element(by.id('linkobj_ChildAddress'));
        browser.wait(EC.visibilityOf(addressForm), 1000, 'Не вижу поле Адрес');
      });
      it('Атрибут Страна заполнен', function () {
        element(by.id('title_country')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('Россия');
          });
      });
      it('Атрибут Субъект федерации заполнен', function () {
        element(by.id('title_subjectFederation')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('Саха /Якутия/ Респ');
          });
      });
      it('Открываем атрибут Населенный пункт', function () {
        checkAndClick(element(by.id('title_town')));
      });
      it('Выбираем Населенный пункт', function () {
        element(by.id('searchDiv_town'))
          .element(by.id('search_town'))
          .all(by.tagName('option')).filter(function (list, index) {
          return list.getAttribute('innerText').then(function (text) {
            return text === 'с Абый';
          });
        }).click();
      });
      it('Вносим Индекс', function () {
        element(by.id('id_zipCode')).sendKeys('111111');
        element(by.id('id_zipCode')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('111111');
          });
      });
      it('Открываем атрибут Улица', function () {
        checkAndClick(element(by.id('title_street')));
      });
      it('Выбираем Улица', function () {
        element(by.id('searchDiv_street'))
          .element(by.id('search_street'))
          .all(by.tagName('option')).filter(function (list, index) {
          return list.getAttribute('innerText').then(function (text) {
            return text === 'ул Баронова';
          });
        }).click();
      });
      it('Вносим Номер дома', function () {
        element(by.id('id_houseNumber')).sendKeys('1');
        element(by.id('id_houseNumber')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('1');
          });
      });
      it('Вносим Номер квартиры', function () {
        element(by.id('id_flatNumber')).sendKeys('2');
        element(by.id('id_flatNumber')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('2');
          });
      });
      it('Сохранить Адрес регистрации', function () {
        checkAndClick(element(by.name('saveEnter')));
        browser.sleep(3000);
      });
    });
    describe('Заполняем группу ДОКУМЕНТ, УДОСТОВЕРЯЮЩИЙ ЛИЧНОСТЬ РЕБЕНКА', function () {
      before('Ждем группу документы', () => {
        browser.wait(EC.elementToBeClickable(element(by.id('group_10497716'))), 10000);
      });
      it('Переходим в группу ДОКУМЕНТ, УДОСТОВЕРЯЮЩИЙ ЛИЧНОСТЬ РЕБЕНКА', function () {
        checkAndClick(element(by.id('group_10497716')))
          .then(() => {
            element(by.id('group_10497716')).getAttribute('class')
              .then((style) => {
                expect(style).to.be.equal('active', 'Группа не активна');
              });
          });
      });
      it('Атрибут Документ удостоверяющий личность заполнен', function () {
        //*[@id="id_ChildIdentityType"]
        let childIdentityType = element(by.id('row_ChildIdentityType'))
          .element(by.className('col-md-9 attr-data'));
        browser.wait(EC.visibilityOf(element(by.id('id_ChildIdentityType'))), 4000);
        checkAndClick(childIdentityType)
          .then(() => {
            // browser.sleep(600000);
            childIdentityType.element(by.id('id_ChildIdentityType')).all(by.tagName('option'))
              .filter((list) => {
                return list.getAttribute('value').then((text) => {
                  return text === '3@DiMOBRIdentityChild.dictionaries';
                });
              }).click();
          });
      });
      it('Вносим серию', function () {
        element(by.id('id_ChildIdentitySerial')).sendKeys('1111');
        element(by.id('id_ChildIdentitySerial')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('1111');
          });
      });
      it('Вносим Номер', function () {
        element(by.id('id_ChildIdentityNumber')).sendKeys('111111');
        element(by.id('id_ChildIdentityNumber')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('111111');
          });
      });
      it('Дата Выдачи', function () {
        element(by.id('cal_ChildIdentityDate')).sendKeys('01.01.2014')
          .then(function () {
            checkAndClick(element(by.className('ui-state-default ui-state-active')));
          });
        element(by.id('cal_ChildIdentityDate')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('01.01.2014');
          });
      });
      it('Вносим Организация, выдавшая документ', function () {
        element(by.id('id_IdentityPlace')).sendKeys('Тестовая организация');
        element(by.id('id_IdentityPlace')).getAttribute('value')
          .then(function (r) {
            expect(r).to.be.equal('Тестовая организация');
          });
      });
    });
    describe('Заполняем группу ОБЩИЕ СВЕДЕНИЯ', function () {
      it('Переходим в группу ОБЩИЕ СВЕДЕНИЯ', function () {
        checkAndClick(element(by.id('group_10497717')))
          .then(() => {
            element(by.id('group_10497717')).getAttribute('class')
              .then((style) => {
                expect(style).to.be.equal('active', 'Группа не активна');
              });
          });
      });
      it('Заполняем атрибут Тип заявления', function () {
        let orderType = element(by.id('row_OrderType'))
          .element(by.className('col-md-9 attr-data'));
        checkAndClick(orderType)
          .then(() => {
            orderType.element(by.id('id_OrderType')).all(by.tagName('option'))
              .filter((list) => {
                return list.getAttribute('value').then((text) => {
                  return text === '3@DiOrderInfo.dictionaries';
                });
              }).click();
          });
      });
      it('Заполняем атрибут Желаемое ОУ', function () {
        let wishOU = element(by.id('row_WishOU'))
          .element(by.className('col-md-9 attr-data'));
        checkAndClick(wishOU)
          .then(() => {
            wishOU.element(by.id('id_WishOU_Dop')).all(by.tagName('option'))
              .filter((list) => {
                return list.getAttribute('value').then((text) => {
                  return text === '62943157-9DD5-46BA-9B85-A4530167C0E2';
                });
              }).click();
          });
      });
      it('Заполняем атрибут Желаемая параллель', function () {
        let wishYear = element(by.id('row_WishYear'))
          .element(by.className('col-md-9 attr-data'));
        checkAndClick(wishYear)
          .then(() => {
            wishYear.element(by.id('id_WishYear_Dop')).all(by.tagName('option'))
              .filter((list) => {
                return list.getAttribute('value').then((text) => {
                  return text === '1';
                });
              }).click();
          });
      });
      it('Заполняем атрибут Желаемая специализация', function () {
        let wishSpecialization = element(by.id('row_wishSpecialization'))
          .element(by.className('col-md-9 attr-data'));
        checkAndClick(wishSpecialization)
          .then(() => {
            wishSpecialization.element(by.id('id_wishSpecialization_Dop')).all(by.tagName('option'))
              .filter((list) => {
                return list.getAttribute('value').then((text) => {
                  return text === '5A2596DC-6306-431A-AFCA-A45301667980';
                });
              }).click();
          });
      });
      it('Заполняем атрибут Желаемый класс', function () {
        let wishGrade = element(by.id('row_WishGrade'))
          .element(by.className('col-md-9 attr-data'));
        checkAndClick(wishGrade)
          .then(() => {
            wishGrade.element(by.id('id_WishGrade_Dop')).all(by.tagName('option'))
              .filter((list) => {
                return list.getAttribute('value').then((text) => {
                  return text === 'A592478F-5E56-4970-9021-A69700C52B8A';
                });
              }).click();
          });
      });
    });
    describe('Заполняем группу ОПОВЕЩАТЬ О РЕЗУЛЬТАТЕ', function () {
      it('Переходим в группу ОПОВЕЩАТЬ О РЕЗУЛЬТАТЕ', function () {
        checkAndClick(element(by.id('group_10497712')))
          .then(() => {
            element(by.id('group_10497712')).getAttribute('class')
              .then((style) => {
                expect(style).to.be.equal('active', 'Группа не активна');
              });
          });
      });
      it('Заполняем атрибут По электронной почте', function () {
        checkAndClick(element(by.id('title_ByEmail')));
      });
      it('Заполняем атрибут Комментарий', function () {
        element(by.id('id_petComment')).sendKeys('Тестовое заявление');
      });
    });
    describe('Заполняем группу Подтверждение', function () {
      it('Переходим в группу Подтверждение', function () {
        checkAndClick(element(by.id('group_service1')))
          .then(() => {
            element(by.id('group_service1')).getAttribute('class')
              .then((style) => {
                expect(style).to.be.equal('active', 'Группа не активна');
              });
          });
      });
      it('Отправляем заявление', function () {
        checkAndClick(element(by.className('btn btn-success')));
      });
    });
    after('Окончание теста', function () {
      console.timeEnd(testRPGU);
      let curDateTimeEnd = new Date();
      console.log('Время старта', curDateTime.toISOString(), 'время выполнения', /*(curDateTime - curDateTimeEnd).toTimeString()*/);
      return callback({start: curDateTime, end: curDateTimeEnd});
    });
  });

}


/**
 * Возвращает признак - авторизован пользователь в данный моменти или нет на ППУ
 * Проверка происходит по наличию кнопки "Вход по сертификату", если она есть - пользователь не авторизован, иначе - авторизован
 * @param {Function} callback Вызываем по результату проверки кнопки на странице, false - кнопка есть, пользователь не авторизован, иначе - true
 */
function isPPUUserAuthorized(callback) {
  element(by.className('list')).getText()
    .then((text) => {
    callback(false);
}).catch((ex) => {
    callback(true);
});
}

/**
 * Функция проверки авторизации на Портале, если не авторизован - проведение авторизации
 * @param {Function} callback - вызываем по завершение проверки или авторизации - без параметров, если все хорошо, с текстом ошибки - если плохо
 * @param {String} retURL - если задан URL перехода - и нужна была авторизаци, то после авторизации переходим на этот адрес
 */
function checkAuthorization(callback, retURL) {
  if (TEST_PARAM.esiaSnils) {
   // TODO код авторизации через ESIA
    throw('Нужна реализация авторизации в ЕСИА');
  } else {
    throw('Не задан СНИЛС для авторизации');
  }
}

function checkAndClick(elemToClick) {
  browser.wait(EC.elementToBeClickable(elemToClick), 10000, 'Элемент не кликабелен');
  return elemToClick.click();
}