import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'signiturebuilder',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      dir: 'www',
      serviceWorker: null,
      copy: [
        {
          src: '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
          dest: 'assets/pdf.worker.min.mjs',
        },
      ],
    },
  ],
  testing: {
    browserHeadless: 'shell',
  },
};
