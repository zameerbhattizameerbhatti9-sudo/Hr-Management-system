import { HolidayCalendar } from "@/types";

const MOCK_HOLIDAYS: HolidayCalendar[] = [];

export function getHolidays(year: number): HolidayCalendar[] {
  return MOCK_HOLIDAYS.filter(
    (holiday) => new Date(holiday.date).getFullYear() === year
  );
}

export function addHoliday(holiday: Omit<HolidayCalendar, "id">): HolidayCalendar {
  const newHoliday = {
    ...holiday,
    id: Math.random().toString(36).substr(2, 9),
  };
  MOCK_HOLIDAYS.push(newHoliday);
  return newHoliday;
}

export function updateHoliday(id: string, data: Partial<HolidayCalendar>): HolidayCalendar {
  const index = MOCK_HOLIDAYS.findIndex((holiday) => holiday.id === id);
  if (index === -1) throw new Error("Holiday not found");
  
  MOCK_HOLIDAYS[index] = { ...MOCK_HOLIDAYS[index], ...data };
  return MOCK_HOLIDAYS[index];
}

export function deleteHoliday(id: string): void {
  const index = MOCK_HOLIDAYS.findIndex((holiday) => holiday.id === id);
  if (index !== -1) {
    MOCK_HOLIDAYS.splice(index, 1);
  }
}

export function getUpcomingHolidays(count: number = 5): HolidayCalendar[] {
  const today = new Date();
  return MOCK_HOLIDAYS
    .filter((holiday) => new Date(holiday.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count);
}

// Initialize with some default holidays for 2025
export function initializeHolidays() {
  if (MOCK_HOLIDAYS.length === 0) {
    const defaultHolidays = [
      {
        name: "New Year's Day",
        date: "2025-01-01",
        type: "public",
      },
      {
        name: "Memorial Day",
        date: "2025-05-26",
        type: "public",
      },
      {
        name: "Independence Day",
        date: "2025-07-04",
        type: "public",
      },
      {
        name: "Labor Day",
        date: "2025-09-01",
        type: "public",
      },
      {
        name: "Thanksgiving Day",
        date: "2025-11-27",
        type: "public",
      },
      {
        name: "Christmas Day",
        date: "2025-12-25",
        type: "public",
      },
      {
        name: "Company Foundation Day",
        date: "2025-03-15",
        type: "company",
        description: "Annual company celebration",
      },
    ] as Omit<HolidayCalendar, "id">[];

    defaultHolidays.forEach((holiday) => addHoliday(holiday));
  }
}