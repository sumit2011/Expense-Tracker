import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import RecordItem from "../components/RecordItem.jsx";
import Nav from "../components/Nav.jsx";
import DateSwitch from "../components/DateSwitch.jsx";
import BarChart from "../components/BarChart.jsx";
import LineChart from "../components/LineChart.jsx";


export default function CategoryDetails({ 
  screen, 
  go, 
  records, 
  deleteRecord,
  currency = "USD", 
  categories,
  activeDate,
  selectedYear,
  statsPeriod,
  dateLabel,
  yearLabel,
  onDatePrev,
  onDateNext,
  value,
  onSelect
}) {
  const { categoryName } = useParams();
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency, 
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const getHexColor = (cssColor) => {
    const colorMap = {
      'var(--primary)': '#6a66ff',
      'var(--green)': '#66ffa3',
      'var(--blue)': '#3db9ff',
      'var(--orange)': '#ff9466',
      'var(--yellow)': '#ffd466',
      'var(--pink)': '#f15be5',
      'var(--red)': '#db3c3c',
      'var(--purple)': '#9747ff',
      'var(--gray)': '#6b7280'
    };
    return colorMap[cssColor] || '#6a66ff';
  };

  // Get category details
  const category = useMemo(() => {
    return categories.find(cat => cat.name === decodeURIComponent(categoryName));
  }, [categories, categoryName]);

  // Filter records for this category and time period
  const categoryRecords = useMemo(() => {
    return records?.filter(record => {
      const recordDate = new Date(record.date);
      const matchesCategory = record.name === decodeURIComponent(categoryName);
      
      if (statsPeriod === 'monthly') {
        const matchesPeriod = recordDate.getMonth() === activeDate.getMonth() && 
                             recordDate.getFullYear() === activeDate.getFullYear();
        return matchesCategory && matchesPeriod;
      } else {
        const matchesPeriod = recordDate.getFullYear() === selectedYear;
        return matchesCategory && matchesPeriod;
      }
    }) || [];
  }, [records, categoryName, activeDate, selectedYear, statsPeriod]);

  // Filter all records for this category for the entire year (for chart)
  const yearlyCategoryRecords = useMemo(() => {
    return records?.filter(record => {
      const recordDate = new Date(record.date);
      const matchesCategory = record.name === decodeURIComponent(categoryName);
      const matchesYear = recordDate.getFullYear() === selectedYear;
      return matchesCategory && matchesYear;
    }) || [];
  }, [records, categoryName, selectedYear]);

  // Calculate totals
  const totalSpent = useMemo(() => {
    return categoryRecords
      .filter(record => record.amount < 0 && record.type !== "transfer")
      .reduce((sum, record) => sum + Math.abs(record.amount), 0);
  }, [categoryRecords]);

  const totalIncome = useMemo(() => {
    return categoryRecords
      .filter(record => record.amount > 0 && record.type !== "transfer")
      .reduce((sum, record) => sum + record.amount, 0);
  }, [categoryRecords]);

  // Group records by date
  const groupedRecords = useMemo(() => {
    const groups = categoryRecords.reduce((acc, record) => {
      const label = new Date(record.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
      if (!acc[label]) acc[label] = [];
      acc[label].push(record);
      return acc;
    }, {});

    return Object.entries(groups).sort((a, b) => {
      return new Date(b[0]) - new Date(a[0]);
    });
  }, [categoryRecords]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const monthlySpending = {};
    const year = selectedYear;
    
    // Initialize all 12 months with zero spending
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);
      const label = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      monthlySpending[label] = 0;
    }
    
    // Add actual spending data
    yearlyCategoryRecords
      .filter(record => record.amount < 0 && record.type !== "transfer")
      .forEach(record => {
        const date = new Date(record.date);
        // Use the selected year for the label to ensure consistency
        const monthLabel = date.toLocaleDateString("en-US", { month: "short" });
        const label = `${monthLabel} ${year}`;
        monthlySpending[label] += Math.abs(record.amount);
      });

    // Sort by month order
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedEntries = Object.entries(monthlySpending).sort((a, b) => {
      const monthA = monthOrder.indexOf(a[0].split(' ')[0]);
      const monthB = monthOrder.indexOf(b[0].split(' ')[0]);
      return monthA - monthB;
    });

    return {
      labels: sortedEntries.map(([label]) => label),
      values: sortedEntries.map(([, value]) => value),
    };
  }, [yearlyCategoryRecords, selectedYear]);

  // Calculate highlighted month index
  const highlightedMonthIndex = useMemo(() => {
    if (statsPeriod !== 'monthly') return null;
    
    const currentMonth = activeDate.getMonth();
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Find the index of the current month in the chart data labels
    return chartData.labels.findIndex(label => {
      const monthName = label.split(' ')[0];
      return monthOrder.indexOf(monthName) === currentMonth;
    });
  }, [statsPeriod, activeDate, chartData.labels]);

  //day wise schart data
const dayWiseChartData = useMemo(() => {
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dailySpending = {};

  for (let day = 1; day <= daysInMonth; day++) {
    dailySpending[day] = 0;
  }

  categoryRecords
    .filter((record) => record.amount < 0 && record.type !== "transfer")
    .forEach((record) => {
      const date = new Date(record.date);
      const day = date.getDate();
      dailySpending[day] += Math.abs(record.amount);
    });

  return {
    labels: Object.keys(dailySpending).map((day) => String(day)),
    values: Object.values(dailySpending),
  };
}, [categoryRecords, activeDate]);



  const handleBack = () => {
    go("stats");
  };

  if (!category) {
    return (
      <div className="screen">
        <div className="stack">
          <div className="row">
            <button className="icon-button large" onClick={handleBack}>
              <Icon name="chevronLeft" />
            </button>
            <h1 className="title">Category Not Found</h1>
            <div style={{ width: "38px" }}></div>
          </div>
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="bag" />
            </div>
            <h3 className="empty-title">Category not found</h3>
            <p className="empty-description">
              The category you're looking for doesn't exist or has been deleted.
            </p>
            <button className="primary-action" onClick={handleBack}>
              <Icon name="chevronLeft" />
              Back to Statistics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {statsPeriod !== 'all' && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000, 
          background: 'var(--bg)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--line)'
        }}>
          <DateSwitch label={statsPeriod === 'yearly' ? yearLabel : dateLabel} onPrev={onDatePrev} onNext={onDateNext} value={value} onSelect={onSelect} mode={statsPeriod === 'yearly' ? 'year' : 'month'} />
        </div>
      )}
      
      <div style={{ marginTop: statsPeriod !== 'all' ? '60px' : '0px' }}>
      <section className="screen">
        <div className="stack">
          <div className="row">
            <button className="icon-button large" onClick={handleBack}>
              <Icon name="chevronLeft" />
            </button>
            <h1 className="title">Category Details</h1>
            <div style={{ width: "38px" }}></div>
          </div>

          <section className="panel pad stack menu-banner">
            <div className="row left">
            <div className="banner-icon" style={{ background: category.tone || "var(--primary)" }}>
              <Icon name={category.icon || "bag"} />
            </div>
            <div style={{padding: "20px"}}>
              <p className="section-title">{category.name}</p>
              <p className="balance">{formatCurrency(totalSpent)}</p>
              
            </div>
            </div>
            <p className="subtle">{categoryRecords.length} transactions</p>
          </section>

          {chartData.labels.length > 0 && (
            <section className="panel pad stack">
              <BarChart 
                data={chartData} 
                title="Spending by Month"
                currency={currency}
                categoryColor={getHexColor(category.tone) || "#6a66ff"}
                highlightedIndex={highlightedMonthIndex}
              />
            </section>
          )}

          {statsPeriod === "monthly" && (
  <section className="panel pad stack">
    <LineChart
      data={dayWiseChartData}
      title="Spending by Day"
      currency={currency}
      categoryColor={getHexColor(category.tone)}
    />
  </section>
)}


          {totalIncome > 0 && (
            <section className="panel pad stack">
              <h2 className="section-title">Income</h2>
              <p className="balance" style={{ color: "var(--green)" }}>{formatCurrency(totalIncome)}</p>
            </section>
          )}

          <section className="panel pad stack">
            <div className="row">
              <h2 className="section-title">Transactions</h2>
              <span className="subtle">{categoryRecords.length} total</span>
            </div>
            
            {groupedRecords.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Icon name="receipt" />
                </div>
                <h3 className="empty-title">No transactions yet</h3>
                <p className="empty-description">
                  No transactions found for this category in {statsPeriod === 'monthly' ? 'this month' : 'this year'}.
                </p>
              </div>
            ) : (
              <>
                {groupedRecords.map(([dateLabel, records]) => (
                  <React.Fragment key={dateLabel}>
                    <p className="label">{dateLabel}</p>
                    <div className="records">
                      {records.map((record) => (
                        <RecordItem
                          key={record.id}
                          record={record}
                          currency={currency}
                          onClick={() => go(`edit/${record.id}`)}
                          onDelete={deleteRecord}
                        />
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </>
            )}
          </section>
        </div>
      </section>
      </div>
      <Nav screen={screen} go={go} />
    </>
  );
}
