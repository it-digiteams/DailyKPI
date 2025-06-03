
function generateHTMLRows(tableRows, footerRow) {
    let htmlTableRows = "";

    // Define a default row with placeholder values
    const defaultRow = ["00:00", "00:00", "00:00", "00:00", "00:00", "00:00", "00:00"];

    // Ensure tableRows is an array; if empty, use defaultRow
    if (!Array.isArray(tableRows) || tableRows.length === 0) {
        tableRows = [defaultRow];
    }

    // Generate table rows
    for (const row of tableRows) {
        htmlTableRows += `
        <tr>
            ${row.map((cell) => `<td style=\"${getCellStyle(false)}\">${cell}</td>`).join("")}
        </tr>
      `;
    }

    // Ensure footerRow is a valid array, otherwise use the default row
    if (!Array.isArray(footerRow) || footerRow.length === 0) {
        footerRow = defaultRow;
    }

    // Generate footer row
    htmlTableRows += `
      <tr>
          ${footerRow.map((cell) => `<td style=\"${getCellStyle(true)}\">${cell}</td>`).join("")}
      </tr>
    `;

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