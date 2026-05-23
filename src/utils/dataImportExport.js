import * as XLSX from 'xlsx';

export function exportToExcel(records, categories, currency = 'INR') {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Prepare data for export
  const exportData = records.map(record => ({
    'Date': new Date(record.date).toLocaleString('en-IN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }).replace(',', ''),
    'Account': record.account || 'Accounts',
    'Category': record.name || '',
    'Subcategory': '',
    'Note': record.note || '',
    'INR': Math.abs(record.amount).toString(),
    'Income/Expense': record.amount >= 0 ? 'Income' : 'Expense',
    'Description': record.note || '',
    'Amount': Math.abs(record.amount).toFixed(1),
    'Currency': currency
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const colWidths = [
    { wch: 20 }, // Date
    { wch: 15 }, // Account
    { wch: 20 }, // Category
    { wch: 15 }, // Subcategory
    { wch: 30 }, // Note
    { wch: 10 }, // INR
    { wch: 15 }, // Income/Expense
    { wch: 30 }, // Description
    { wch: 10 }, // Amount
    { wch: 10 }  // Currency
  ];
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Records');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `expense-tracker-${timestamp}.xlsx`;

  // Download file
  XLSX.writeFile(wb, filename);
}

export function importFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Process and validate data
        const processedRecords = jsonData.map(row => {
          // Parse date - handle various date formats
          let dateValue = row['Date'] || row.date || '';
          let date;
          
          if (dateValue) {
            try {
              // Handle Excel date numbers (Excel stores dates as numbers since 1900)
              if (typeof dateValue === 'number') {
                // Convert Excel date number to JavaScript date
                const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
                if (!isNaN(excelDate)) {
                  date = excelDate.toISOString().split('T')[0];
                } else {
                  date = new Date().toISOString().split('T')[0];
                }
              } else {
                // Ensure dateStr is a string
                const dateStr = String(dateValue);
                
                // Try to parse Indian date format first (DD/MM/YYYY)
                const indianDateMatch = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})\s*(\d{2}):(\d{2}):(\d{2})?/);
                if (indianDateMatch) {
                  const [, day, month, year, hour = '00', minute = '00', second = '00'] = indianDateMatch;
                  date = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
                } else {
                  // Try other date formats
                  const parsedDate = new Date(dateStr);
                  if (!isNaN(parsedDate)) {
                    date = parsedDate.toISOString().split('T')[0];
                  } else {
                    // Try parsing just the date part
                    const dateOnlyMatch = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                    if (dateOnlyMatch) {
                      const [, day, month, year] = dateOnlyMatch;
                      date = `${year}-${month}-${day}`;
                    } else {
                      date = new Date().toISOString().split('T')[0]; // Fallback to today
                    }
                  }
                }
              }
            } catch (error) {
              console.warn('Date parsing error:', error);
              date = new Date().toISOString().split('T')[0]; // Fallback to today
            }
          } else {
            date = new Date().toISOString().split('T')[0]; // Fallback to today
          }
          
          // Parse amount
          const amountStr = row['Amount'] || row.amount || row['INR'] || row.inr || '0';
          const amount = parseFloat(amountStr) || 0;
          
          // Determine if income or expense
          const incomeExpense = row['Income/Expense'] || row.incomeExpense || '';
          const isIncome = incomeExpense.toLowerCase() === 'income';
          const finalAmount = isIncome ? amount : -amount;
          
          // Get category
          const category = row['Category'] || row.category || 'Uncategorized';
          
          // Get account
          const account = row['Account'] || row.account || 'Accounts';
          
          // Get note/description
          const note = row['Note'] || row.note || row['Description'] || row.description || '';
          
          return {
            id: Date.now() + Math.random(), // Generate unique ID
            date,
            name: category,
            account,
            amount: finalAmount,
            note,
            // Add default icon and tone based on category
            icon: 'bag',
            tone: isIncome ? 'var(--green)' : 'var(--orange)'
          };
        });
        
        resolve(processedRecords);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error.message));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function createSampleData() {
  const sampleData = [
    {
      'Date': '02/05/2026 18:17:49',
      'Account': 'Accounts',
      'Category': '☕ Chai',
      'Subcategory': '',
      'Note': '',
      'INR': '70',
      'Income/Expense': 'Expense',
      'Description': '',
      'Amount': '70.0',
      'Currency': 'INR'
    },
    {
      'Date': '01/05/2026 22:29:59',
      'Account': 'Accounts',
      'Category': ' Social Life',
      'Subcategory': '',
      'Note': 'Birla temple',
      'INR': '330',
      'Income/Expense': 'Expense',
      'Description': 'Birla temple',
      'Amount': '330.0',
      'Currency': 'INR'
    },
    {
      'Date': '01/05/2026 22:29:33',
      'Account': 'Accounts',
      'Category': ' Social Life',
      'Subcategory': '',
      'Note': '',
      'INR': '110',
      'Income/Expense': 'Expense',
      'Description': '',
      'Amount': '110.0',
      'Currency': 'INR'
    },
    {
      'Date': '01/05/2026 22:25:52',
      'Account': 'Accounts',
      'Category': '️ Diet',
      'Subcategory': '',
      'Note': 'Eggs',
      'INR': '185',
      'Income/Expense': 'Expense',
      'Description': 'Eggs',
      'Amount': '185.0',
      'Currency': 'INR'
    },
    {
      'Date': '01/05/2026 12:11:38',
      'Account': 'Accounts',
      'Category': ' Salary',
      'Subcategory': '',
      'Note': '',
      'INR': '45359',
      'Income/Expense': 'Income',
      'Description': '',
      'Amount': '45359.0',
      'Currency': 'INR'
    },
    {
      'Date': '30/04/2026 17:31:53',
      'Account': 'Accounts',
      'Category': 'Other',
      'Subcategory': '',
      'Note': 'Satyam to me',
      'INR': '1670',
      'Income/Expense': 'Income',
      'Description': 'Satyam to me',
      'Amount': '1670.0',
      'Currency': 'INR'
    },
    {
      'Date': '30/04/2026 12:05:53',
      'Account': 'Accounts',
      'Category': ' Groceries',
      'Subcategory': '',
      'Note': '',
      'INR': '204',
      'Income/Expense': 'Expense',
      'Description': '',
      'Amount': '204.0',
      'Currency': 'INR'
    },
    {
      'Date': '30/04/2026 12:05:30',
      'Account': 'Accounts',
      'Category': ' Social Life',
      'Subcategory': '',
      'Note': '',
      'INR': '440',
      'Income/Expense': 'Expense',
      'Description': '',
      'Amount': '440.0',
      'Currency': 'INR'
    },
    {
      'Date': '30/04/2026 12:04:56',
      'Account': 'Accounts',
      'Category': '☕ Chai',
      'Subcategory': '',
      'Note': '',
      'INR': '130',
      'Income/Expense': 'Expense',
      'Description': '',
      'Amount': '130.0',
      'Currency': 'INR'
    }
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(sampleData);
  
  // Set column widths
  const colWidths = [
    { wch: 20 }, // Date
    { wch: 15 }, // Account
    { wch: 20 }, // Category
    { wch: 15 }, // Subcategory
    { wch: 30 }, // Note
    { wch: 10 }, // INR
    { wch: 15 }, // Income/Expense
    { wch: 30 }, // Description
    { wch: 10 }, // Amount
    { wch: 10 }  // Currency
  ];
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Data');
  XLSX.writeFile(wb, 'expense-tracker-sample.xlsx');
}
