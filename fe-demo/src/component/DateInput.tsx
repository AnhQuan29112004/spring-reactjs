import { useState } from "react";
import { DayPicker } from "react-day-picker";
import calendar_icon from '../assets/calendar.svg'
import "react-day-picker/dist/style.css";

export default function DateInput({isOpen, date, setOpen, setDate}:{isOpen:boolean, date:Date, setOpen:any, setDate:any}) {

  return (
    <div style={{ position: "relative" }}>
      <div
        className="date-input"
        onClick={() => setOpen()}
      >
        {date
          ? new Date(date).toLocaleDateString("vi-VN")
          : "Lọc theo thời gian bắt đầu từ"}
        <img src={calendar_icon} alt="" />
      </div>

      {isOpen && (
        <div className="calendar-popup">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(d:any) => {
              setDate(d);
              setOpen();
            }}
          />
        </div>
      )}
    </div>
  );
}