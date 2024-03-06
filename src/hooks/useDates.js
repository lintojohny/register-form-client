import { useEffect, useState } from "react";
const monthWith31 = [1, 3, 5, 7, 8, 10, 12];
const monthWith30 = [4, 6, 9, 11];
const monthWith29_28 = [2];

const monthDateSelection = {
  30: [...monthWith31, ...monthWith30],
  31: [...monthWith31],
};

const months = [
  { label: "January", value: 1, disable: false },
  { label: "February", value: 2, disable: false }, // Will be updated for leap years
  { label: "March", value: 3, disable: false },
  { label: "April", value: 4, disable: false },
  { label: "May", value: 5, disable: false },
  { label: "June", value: 6, disable: false },
  { label: "July", value: 7, disable: false },
  { label: "August", value: 8, disable: false },
  { label: "September", value: 9, disable: false },
  { label: "October", value: 10, disable: false },
  { label: "November", value: 11, disable: false },
  { label: "December", value: 12, disable: false },
];

const days = [...Array(31).keys()].map((day) => ({
  label: day + 1,
  value: day + 1,
  disable: false,
}));

const years = [...Array(100).keys()].map((value) => {
  const currentYear = new Date().getFullYear();
  const year = currentYear - 99 + value;
  return {
    label: year,
    value: year,
    disable: false,
  };
});

const isLeap = (year) => new Date(year, 1, 29).getDate() === 29;

export const useDates = () => {
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    generateDay(month, year);
    generateMonths(day, year);
    generateYear(day, month);
  }, [day, month, year]);

  useEffect(() => {
    const isValidYear = years.filter(
      (yearObj) => !yearObj.disable && yearObj.value === year
    ).length;
    const isValidMonth = months.filter(
      (monthObj) => !monthObj.disable && monthObj.value === month
    ).length;
    const isValidDays = days.filter(
      (dayObj) => !dayObj.disable && dayObj.value === day
    ).length;
    if (isValidDays && isValidMonth && isValidYear) {
      setError(null);
    } else setError("Please enter a valid date");
  }, [day, month, year]);

  const generateMonths = (selectedDate, selectedYear) => {
    months.forEach((month) => {
      if (
        monthDateSelection[selectedDate] &&
        !monthDateSelection[selectedDate].includes(month.value)
      ) {
        month.disable = true;
      } else if (
        selectedYear &&
        selectedDate === 29 &&
        !isLeap(selectedYear) &&
        month.value === 2
      ) {
        month.disable = true;
      } else {
        month.disable = false;
      }
    });
  };

  const generateYear = (selectedDate, selectedMonth) => {
    years.forEach((year) => {
      if (selectedMonth !== 2 || selectedDate !== 29) year.disable = false;
      else if (!isLeap(year.value)) {
        if (year === year.value) setYear("");
        year.disable = true;
      }
    });
  };

  const generateDay = (selectedMonth, selectedYear) => {
    days.forEach((day) => {
      if (monthWith30.includes(selectedMonth) && day.value === 31) {
        day.disable = true;
      } else if (monthWith29_28.includes(selectedMonth)) {
        if (day.value === 31 || day.value === 30) {
          day.disable = true;
        } else if (day.value === 29 && selectedYear && !isLeap(selectedYear)) {
          day.disable = true;
        }
      } else {
        day.disable = false;
      }
    });
  };

  return {
    setDay,
    setMonth,
    setYear,
    setError,
    days,
    months,
    years,
    error,
  };
};
