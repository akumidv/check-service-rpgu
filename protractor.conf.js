'use strict';
// Уточняем параметры jsHint.
// expr - убрать предупреждение для функций без (): expect(...).to.have.been.called или expect(...).to.be.ok
// maxstatements - множественные describe/it/expect одного уровня в одной группе describe или it
// undef - не проверять не объявленные переменные (глобальные)
/* jshint expr: true, maxstatements: 20, undef: false */
/* globals protractor, browser, chai, expect, chaiAsPromised, EC, TEST_PARAM, element */ // jshint ignore:line
const SELENIUM_URL =  process.env.SELENIUM_STANDALONE_CHROME_PORT_4444_TCP_ADDR ?
  process.env.SELENIUM_STANDALONE_CHROME_PORT_4444_TCP_ADDR : 'localhost';
const SELENIUM_PORT = process.env.SELENIUM_STANDALONE_CHROME_PORT_4444_TCP_PORT ?
  process.env.SELENIUM_STANDALONE_CHROME_PORT_4444_TCP_PORT : '4444';

exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://' + SELENIUM_URL + ':' + SELENIUM_PORT + '/wd/hub',
  // Используется для автономного запуска protracotr в директории
  // проекта, сервер должен быть предварительно запущен заранее,стационарно или например командо webdriver-manager start
  // Задается в gulp файле в аргументах запуска, может использоваться для атономного запуска protractor,
  // чтобы он сам запуска selenium. Нужно проверять корректность ссылки на файл, в т.ч. версию
  // seleniumServerJar: './node_modules11/protractor/selenium/selenium-server-standalone-2.45.0.jar',
  // seleniumServerJar: './node_modules11/protractor/node_modules11/webdriver-manager/selenium/selenium-server-standalone-3.8.1.jar',
  // Локальный запуск без селениума, только драйвер броузера:
  chromeOnly: true, // !process.env.SELENIUM_STANDALONE_CHROME_PORT_4444_TCP_ADDR,
  // chromeDriver: './node_modules/protractor/node_modules11/webdriver-manager/selenium/chromedriver',
  // chromeOnly: true, chromeDriver: './node_modules11/protractor/selenium/chromedriver',
  directConnect: true,
  framework: 'mocha',
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    //  'browserName': 'firefox'
    browserName: 'chrome',
    chromeOptions: {
      args: ['--window-size=1280x800'] // , '--window-size=800,600' '--headless', '--disable-gpu'
      // args: ['--window-size=1280x800'] // // Запуск хрома без окна '--headless', '--disable-gpu',
    }
    // 'browserName': 'internet explorer'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['./mobrOrderOUServTest.spec.js'
  ],

  // The timeout in milliseconds for each script run on the browser. This should
  // be longer than the maximum time your application needs to stabilize between tasks.
  allScriptsTimeout: 60000,

  // How long to wait for a page to load.
  getPageTimeout: 10000,

  // A callback function called once configs are read but before any environment
  // setup. This will only run once, and before onPrepare.
  // You can specify a file containing code to run by setting beforeLaunch to
  // the filename string.
  beforeLaunch: function () {
    // At this point, global variable 'protractor' object will NOT be set up,
    // and globals from the test framework will NOT be available. The main
    // purpose of this function should be to bring up test dependencies.

  },

  // A callback function called once protractor is ready and available, and
  // before the specs are executed.
  // If multiple capabilities are being run, this will run once per
  // capability.
  // You can specify a file containing code to run by setting onPrepare to
  // the filename string.
  onPrepare: function () {
    // At this point, global variable 'protractor' object will be set up, and
    // globals from the test framework will be available. For example, if you
    // are using Jasmine, you can add a reporter with:
    //     jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
    //         'outputdir/', true, true));
    //
    // If you need access back to the current configuration object,
    // use a pattern like the following:
    //     browser.getProcessedConfig().then(function(config) {
    //       // config.capabilities is the CURRENT capability being run, if
    //       // you are using multiCapabilities.
    //       //console.log('Executing capability', config.capabilities);
    //     });
    global.chai = require('chai');
    global.chaiAsPromised = require('chai-as-promised');
    global.chai.use(chaiAsPromised);
    global.expect = chai.expect;

    global.EC = protractor.ExpectedConditions;
    global.TEST_PARAM = { // TODO сделать проверку для режима тестирования на девелоп - тестовый сервер, для тестирвоания на мастер - основных серверов
      rpguUrl:  process.env.RPGU_URL ? process.env.RPGU_URL : 'https://e-yakutia.ru',
      esiaSnils: process.env.ESIA_SNILS ? process.env.ESIA_SNILS : '',
      esiaPsw: process.env.ESIA_PSW ? process.env.ESIA_PSW : ''
    };

    browser.ignoreSynchronization = true;// Позволяет работать со страницами без angular, но также не обеспечивает
    // автоматическое ожидание загрузки страницы, которое обеспечивает использование angular-a

    // Время ожидания элемента при поиске
    // http://angular.github.io/protractor/#/api?view=webdriver.WebDriver.Timeouts.prototype.implicitlyWait
    // browser.driver.manage().timeouts().implicitlyWait(500);
    // var extend = require('selenium-extend'); // FIXME Не заработало и похоже есть ограничение только для Chrome
    // используется только в ElementFinder.prototype.waitElementReady = function (option) {}
    // можно удалить, если будет замена var checkClickable = browser.driver.extend.isClickable(_this);
    // extend.addExtend(browser.driver);
  },
  // A callback function called once tests are finished.
  onComplete: function () {
    // At this point, tests will be done but global objects will still be
    // available.
  },

  // A callback function called once the tests have finished running and
  // the WebDriver instance has been shut down. It is passed the exit code
  // (0 if the tests passed). This is called once per capability.
  onCleanUp: function (exitCode) {
  },

  // A callback function called once all tests have finished running and
  // the WebDriver instance has been shut down. It is passed the exit code
  // (0 if the tests passed). This is called only once before the program exits (after onCleanUp).
  // //afterLaunch: function () {
  // //},


  mochaOpts: {
    reporter: 'spec',// TODO заменить spec на вариант html-test в папке мокка,
    // TODO но лучше, чтобы это отчет подключался из файла в проектной папке.
    // TODO после этого модифицировать отчет для записи скниршотов
    timeout: 10000, // Время ожидания шагов теста, может задаваться в тесте так
    // this.timeout(10000), нужно чтобы на шаге можно было проверить загрузку элемент, для динамичных страниц.
    // enableTimeouts: false, //блокировать ограничение по времени для ожидания
    slow: 40000
  }
};
