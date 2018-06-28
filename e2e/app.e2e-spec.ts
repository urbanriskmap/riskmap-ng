import { AppPage } from './app.po';

describe('riskmap-ng App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display title', () => {
    page.navigateHome();
    expect(page.getTitle()).toEqual('RiskMap.in');
  });
});
