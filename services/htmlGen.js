
function generateHTMLRows(tableRows, footerRow) {
    let htmlTableRows = "";

    // Define a default row with placeholder values for 9 columns
    const defaultRow = ["00:00", "00:00", "00:00", "00:00", "00:00", "00:00", "00:00", "0.00%", "0.00%"];

    // Ensure tableRows is an array; if empty, use defaultRow
    if (!Array.isArray(tableRows) || tableRows.length === 0) {
        tableRows = [defaultRow];
    }

    // Helper function to generate a <tr> with exactly 9 columns
    const generateTr = (row, isFooter) => {
        let cells = "";
        for (let i = 0; i < 8; i++) {
            cells += `<td style="${getCellStyle(isFooter)}">${row[i] || ''}</td>`;
        }
        // Add the 9th column with its fallback
        cells += `<td style="${getCellStyle(isFooter)}">${row[8] || '0.00%'}</td>`;
        return `<tr>${cells}</tr>`;
    };
    
    // Generate table rows
    for (const row of tableRows) {
        htmlTableRows += generateTr(row, false);
    }

    // Ensure footerRow is a valid array, otherwise use the default row
    const finalFooterRow = (!Array.isArray(footerRow) || footerRow.length === 0) ? defaultRow : footerRow;

    // Generate footer row
    htmlTableRows += generateTr(finalFooterRow, true);

    return htmlTableRows;
}

// Generate complete HTML template
function generateHTMLTemplate(htmlTableRows, emailHeader, time) {
    return `
          <div style="background-color: #038389; color: #fff; margin-bottom: 10px; border-radius: 10px; padding: 10px; display: flex; justify-content: center; align-items: center; text-align: center;">
      <h1 style="font-size: 22px; padding: 15px; margin: 0; color: #fff; text-align: center; width: 100%;">${emailHeader}</h1>
  </div>
  
          <div id="scrollContainer" style="max-width:100%; overflow: auto;">
              <table style="border-radius: 10px; border-collapse: collapse; width: 100%; overflow-x: auto; border: none; overflow-y: hidden; background: #0383891A; table-layout: fixed;">
                  <thead style="position: sticky; top: 0; z-index: 1;">
                      <tr>
                          <th style="${getHeaderStyle()}">${time}</th>
                          <th style="${getHeaderStyle()}">Member</th>
                          <th style="${getHeaderStyle()}">BILLABLE</th>
                          <th style="${getHeaderStyle()}">MRR</th>
                          <th style="${getHeaderStyle()}">TRAINING</th>
                          <th style="${getHeaderStyle()}">OPERATIONS</th>
                          <th style="${getHeaderStyle()}">Total</th>
                          <th style="${getHeaderStyle()}">REV %</th>
                          <th style="${getHeaderStyle()}">OPS %</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${htmlTableRows}
                  </tbody>
              </table>
          </div>
  
          <div style="background-color: #f5f5f5; color: #fff; margin-top:10px; border-radius:10px; padding: 10px; text-align: center;">
              <p style="color: #038389; margin: 0; font-size: 12px;"><strong>Regards,</strong></p>
              <p style="color: #038389; margin: 0; font-size: 12px;">IT & Operations Team, UK Digital Accountant Ltd</p>
          </div>
      `;
}

// Get cell style for rows and footer
function getCellStyle(isFooter) {
    return `border: .5px solid #038389; padding: 11px 2px 9px 10px; height: 10px; color: #038389; font-weight: ${isFooter ? "700" : "600"
        }; font-size: 15px; line-height: 14px; vertical-align: middle; text-align: center;`;
}

// Get header style
function getHeaderStyle() {
    return `width: 60px; border: .5px solid #038389; padding: 14px 2px 6px 10px; height: 10px; color: #038389; font-weight: 700; font-size: 15px; line-height: 14px; vertical-align: middle; text-align: center;`;
}

module.exports = { generateHTMLRows, generateHTMLTemplate }