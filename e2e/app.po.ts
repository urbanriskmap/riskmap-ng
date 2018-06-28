import { browser, by, element } from 'protractor';

export class AppPage {
  navigateHome() {
    return browser.get('/');
  }

  getTitle() {
    return browser.getTitle();
  }

  navigateToJakarta() {
    return browser.get('/jakarta');
  }

  clickLanguageMenu() {
    return element(by.buttonText('Bahasa')).click();
  }

  clickBahasa() {
    return element(by.css('.mat-option-text')).click();
  }
}
