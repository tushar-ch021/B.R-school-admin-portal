/**
 * Native Browser Print Utility (React 19 Compatible)
 * Prints any DOM element inside a temporary hidden iframe without external package dependencies.
 */
export const printElement = (element, title = 'Print Document') => {
  if (!element) {
    console.warn('printElement: Target element is null or unmounted');
    return;
  }

  // Create temporary hidden printing iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.title = title;

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow.document;

  // Clone document style sheets and Tailwind CSS definitions
  const headStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((el) => el.outerHTML)
    .join('\n');

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        ${headStyles}
        <style>
          @media print {
            @page {
              size: auto;
              margin: 5mm;
            }
            html, body { 
              background: #ffffff !important; 
              margin: 0 !important; 
              padding: 0 !important; 
              width: 100% !important;
              height: 100% !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-wrapper {
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
              width: 100% !important;
              min-height: 95vh !important;
              box-sizing: border-box !important;
            }
            .identity-card-container {
              width: 324px !important;
              height: 516px !important;
              min-width: 324px !important;
              min-height: 516px !important;
              max-width: 324px !important;
              max-height: 516px !important;
              box-shadow: none !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .no-print { display: none !important; }
          }
          body {
            background: #ffffff;
            margin: 0;
            padding: 0;
          }
          .print-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 95vh;
          }
          .no-print { display: none !important; }
        </style>
      </head>
      <body>
        <div class="print-wrapper">
          ${element.outerHTML}
        </div>
      </body>
    </html>
  `);
  iframeDoc.close();

  // Wait for web fonts & media assets to settle before invoking browser print dialog
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.error('Failed to trigger browser print dialog:', e);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }
  }, 400);
};

export default printElement;
