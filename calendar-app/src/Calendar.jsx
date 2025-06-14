
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';

const eventsData = [
  {
    title: "Daily Standup",
    date: "2025-06-14",
    startTime: "01:00",
    endTime: "01:30",
    color: "#f6be23"
  },
  {
    title: "Weekly catchup",
    date: "2025-06-14",
    startTime: "04:30",
    endTime: "07:30",
    color: "#f6501e"
  }
];

const detectConflicts = (events) => {
  const conflicts = new Set();
  const sortedEvents = [...events].sort((a, b) => a.startTime.localeCompare(b.startTime));
  for (let i = 0; i < sortedEvents.length - 1; i++) {
    const currentEnd = new Date(`1970-01-01T${sortedEvents[i].endTime}`);
    const nextStart = new Date(`1970-01-01T${sortedEvents[i + 1].startTime}`);
    if (nextStart < currentEnd) {
      conflicts.add(sortedEvents[i].title);
      conflicts.add(sortedEvents[i + 1].title);
    }
  }
  return conflicts;
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState([]);

  useEffect(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    const dates = [];
    let day = start;
    while (day <= end) {
      dates.push(day);
      day = addDays(day, 1);
    }
    setCalendarDates(dates);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getEventsForDate = (date) => {
    return eventsData.filter(
      (event) => format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={handlePrevMonth} style={{ padding: '5px 10px', backgroundColor: '#eee', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Prev</button>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={handleNextMonth} style={{ padding: '5px 10px', backgroundColor: '#eee', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Next</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} style={{ fontWeight: 'bold', padding: '8px 0', backgroundColor: '#f0f0f0' }}>{day}</div>
        ))}
        {calendarDates.map((date, index) => {
          const isToday = isSameDay(date, new Date());
          const inMonth = isSameMonth(date, currentDate);
          const events = getEventsForDate(date);
          const conflicts = detectConflicts(events);

          return (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '5px',
                minHeight: '100px',
                overflowY: 'auto',
                position: 'relative',
                backgroundColor: isToday ? '#e0f0ff' : inMonth ? '#ffffff' : '#f8f8f8',
                color: inMonth ? '#000' : '#aaa'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{format(date, 'd')}</div>
              <div style={{ fontSize: '12px' }}>
                {events.map((event, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: conflicts.has(event.title) ? '#dc2626' : event.color || '#60a5fa',
                      color: '#fff',
                      padding: '2px 4px',
                      marginBottom: '2px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      wordWrap: 'break-word'
                    }}
                    title={`${event.title} (${event.startTime} - ${event.endTime})`}
                  >
                    {event.title} {conflicts.has(event.title) && '❗'}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
