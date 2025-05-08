import { newE2EPage } from '@stencil/core/testing';

describe('signiture-builder', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<signiture-builder></signiture-builder>');

    const element = await page.find('signiture-builder');
    expect(element).toHaveClass('hydrated');
  });
});
