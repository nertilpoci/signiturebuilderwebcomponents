import { newSpecPage } from '@stencil/core/testing';
import { SignitureBuilder } from '../signiture-builder';

describe('signiture-builder', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SignitureBuilder],
      html: `<signiture-builder></signiture-builder>`,
    });
    expect(page.root).toEqualHtml(`
      <signiture-builder>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </signiture-builder>
    `);
  });
});
