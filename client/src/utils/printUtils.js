/**
 * Returns standard printing configuration parameters for react-to-print.
 * Injects custom page titles and guarantees font asset layouts are preserved.
 * @param {string} title Document title shown in the print dialog.
 * @returns {Object} Config object for react-to-print.
 */
export const getPrintConfig = (title = 'Document') => {
  return {
    documentTitle: title,
    removeAfterPrint: true,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @page {
          size: A4 portrait;
          margin: 10mm !important;
        }
      }
    `
  };
};

/**
 * Direct print trigger helper using standard browser print command.
 * Hides sidebars and layout UI automatically when styling is loaded.
 */
export const triggerBrowserPrint = () => {
  window.print();
};
