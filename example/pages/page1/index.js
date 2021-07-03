import { component1 } from '../../components/component1/index.js';
import { component2 } from '../../components/component2/index.js';

export const page1 = () => {
  const title = `Page 1`;

  return `
    <!DOCTYPE html>
    <html lang='en'>
      <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <meta http-equiv='X-UA-Compatible' content='ie=edge'>
        <title>${title}</title>
      </head>
      <body>
        <main>
          <h1>${title}</h1>
          ${component1()}
          ${component2()}
        </main>
      </body>
    </html>
  `;
}
