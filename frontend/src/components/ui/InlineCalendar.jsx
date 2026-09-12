import { useState } from 'react';

export const InlineCalendar = ({ checkIn, checkOut, onChange, bookings = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper to format Date to YYYY-MM-DD
  const formatDateString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Parse checkIn and checkOut strings into local dates (start of day)
  const getMidnightDate = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const checkInDate = getMidnightDate(checkIn);
  const checkOutDate = getMidnightDate(checkOut);

  // Parse bookings into midnight start/end ranges
  const parsedBookings = bookings.map(b => {
    // Backend returns ISO strings. Parse into local Date representation at midnight
    const inDate = new Date(b.checkIn);
    const outDate = new Date(b.checkOut);
    return {
      start: new Date(inDate.getFullYear(), inDate.getMonth(), inDate.getDate()),
      end: new Date(outDate.getFullYear(), outDate.getMonth(), outDate.getDate())
    };
  });

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y, m) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayIndex(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Hover state for range visualization
  const [hoveredDate, setHoveredDate] = useState(null);

  // Helper to check if a specific day is booked or in the past
  const getDayStatus = (day) => {
    const targetDate = new Date(year, month, day);
    targetDate.setHours(0, 0, 0, 0);

    // Is in past
    if (targetDate < today) {
      return { disabled: true, booked: false };
    }

    // Is booked (i.e. falls inside a booking range)
    const isBooked = parsedBookings.some(b => targetDate >= b.start && targetDate < b.end);
    return { disabled: isBooked, booked: isBooked };
  };

  // Helper to check if all nights between check-in and check-out are free
  const areNightsFree = (start, end) => {
    if (!start || !end || start >= end) return false;
    let current = new Date(start);
    while (current < end) {
      const isBooked = parsedBookings.some(b => current >= b.start && current < b.end);
      if (isBooked) return false;
      current.setDate(current.getDate() + 1);
    }
    return true;
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);
    const clickedStr = formatDateString(clickedDate);

    // If no check-in exists, or we are resetting: clicked day is the new check-in
    if (!checkIn || (checkIn && checkOut)) {
      if (getDayStatus(day).disabled) return;
      onChange({ checkIn: clickedStr, checkOut: '' });
      setHoveredDate(null);
    } else {
      // We have check-in, but no check-out
      if (clickedDate <= checkInDate) {
        // Clicked date is same or before check-in: reset check-in to clicked date
        if (getDayStatus(day).disabled) return;
        onChange({ checkIn: clickedStr, checkOut: '' });
      } else {
        // Clicked date is after check-in: check if all nights are free
        if (areNightsFree(checkInDate, clickedDate)) {
          onChange({ checkIn, checkOut: clickedStr });
          setHoveredDate(null);
        } else {
          // If intermediate dates are blocked, reset check-in to the clicked date
          if (getDayStatus(day).disabled) return;
          onChange({ checkIn: clickedStr, checkOut: '' });
        }
      }
    }
  };

  const handleDayMouseEnter = (day) => {
    if (checkIn && !checkOut) {
      const targetDate = new Date(year, month, day);
      targetDate.setHours(0, 0, 0, 0);
      
      if (targetDate > checkInDate) {
        if (areNightsFree(checkInDate, targetDate)) {
          setHoveredDate(targetDate);
          return;
        }
      }
    }
    setHoveredDate(null);
  };

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const emptyBoxes = Array.from({ length: firstDayIndex }, (_, i) => null);

  const getDayClasses = (day) => {
    if (!day) return '';
    const { disabled, booked } = getDayStatus(day);
    const targetDate = new Date(year, month, day);
    targetDate.setHours(0, 0, 0, 0);

    const isSelectedCheckIn = checkInDate && targetDate.getTime() === checkInDate.getTime();
    const isSelectedCheckOut = checkOutDate && targetDate.getTime() === checkOutDate.getTime();

    // Is in selected range
    const isInSelectedRange = checkInDate && checkOutDate && targetDate > checkInDate && targetDate < checkOutDate;
    
    // Is in hover range
    const isInHoverRange = checkInDate && !checkOutDate && hoveredDate && targetDate > checkInDate && targetDate <= hoveredDate;

    if (isSelectedCheckIn || isSelectedCheckOut) {
      return 'bg-stayora-black text-white font-bold scale-100 z-10';
    }

    if (disabled) {
      return 'text-stayora-black/20 line-through cursor-not-allowed';
    }

    if (isInSelectedRange) {
      return 'bg-stayora-red/10 text-stayora-red font-semibold';
    }

    if (isInHoverRange) {
      return 'bg-stayora-grey text-stayora-black font-medium';
    }

    return 'text-stayora-black hover:bg-stayora-grey/60';
  };

  return (
    <div className="w-full bg-white border border-[#E5E5E5] p-5 select-none font-sans text-left">
      {/* Month Navigation */}
      <div className="flex justify-between items-center pb-4 border-b border-[#F5F5F5] mb-4">
        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stayora-black">
          {monthNames[month]} {year}
        </h4>
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={prevMonth}
            disabled={year === today.getFullYear() && month === today.getMonth()}
            className="w-8 h-8 flex items-center justify-center border border-[#E5E5E5] text-stayora-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stayora-grey transition"
          >
            ←
          </button>
          <button 
            type="button"
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center border border-[#E5E5E5] text-stayora-black hover:bg-stayora-grey transition"
          >
            →
          </button>
        </div>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-stayora-black/40 uppercase tracking-wider mb-2">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center text-xs">
        {emptyBoxes.map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square" />
        ))}
        {days.map((day) => (
          <button
            key={`day-${day}`}
            type="button"
            onClick={() => handleDayClick(day)}
            onMouseEnter={() => handleDayMouseEnter(day)}
            className={`aspect-square flex items-center justify-center transition-all duration-150 ${getDayClasses(day)}`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Mini Helper Legend */}
      <div className="flex justify-between items-center pt-4 border-t border-[#F5F5F5] mt-4 text-[10px] text-stayora-black/40 uppercase tracking-widest font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-stayora-black inline-block" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-stayora-red/10 border border-stayora-red/20 inline-block" />
          <span>Stay Period</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-transparent border border-stayora-black/10 inline-block line-through text-stayora-black/20 text-center leading-[10px] font-sans font-bold">/</span>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};
