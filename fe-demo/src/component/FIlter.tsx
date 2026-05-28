import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import filter_green_icon from "../assets/filter-green.svg";
import reset_icon from "../assets/reset.svg";
import cancel_icon from "../assets/cancel.svg";
import accept_icon from "../assets/accept.svg";

export interface FilterField {
  name: string;
  label: string;
  type: "text" | "select" | "date";
  options?: { label: string; value: string | number }[]; // For select
  placeholder?: string;
}

export interface FilterProps<T> {
  toggleFilter: () => void;
  filterValues: T;
  initialValues: T;
  fields: FilterField[];
  onApply: (values: T) => void;
}

export function Filter<T extends Record<string, any>>({
  toggleFilter,
  filterValues,
  initialValues,
  fields,
  onApply,
}: FilterProps<T>) {
  const [formData, setFormData] = useState<T>(filterValues);

  useEffect(() => {
    setFormData(filterValues);
  }, [filterValues]);

  const resetForm = () => {
    setFormData(initialValues);
  };

  const handleChangeInput =
    (key: keyof T) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  const handleApply = () => {
    onApply(formData);
    toggleFilter();
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black/50" onClick={toggleFilter} />
      <div className="absolute top-20 z-10 flex h-auto w-[589px] flex-col gap-5 rounded-2xl bg-white px-5 pb-[30px] pt-4">
        <div className="flex gap-[11px] border-b-[0.5px] border-[#E0E0E0] pb-[18px]">
          <span className="text-left font-be_vietnam_pro text-xl font-bold leading-[30px] text-[#020C1A]">
            Bộ lọc
          </span>
          <img src={filter_green_icon} alt="" />
        </div>
        
        <div className="grid grid-cols-2 gap-[18px]">
          {fields.map((field) => (
            <div key={field.name} className={`flex flex-col items-start gap-2 ${field.type === 'date' ? 'col-span-2' : ''}`}>
              <span className="text-filter">{field.label}</span>
              {field.type === "select" ? (
                <select
                  value={formData[field.name] as string | number || ""}
                  onChange={handleChangeInput(field.name)}
                  className="w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 py-3"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] as string | number || ""}
                  onChange={handleChangeInput(field.name)}
                  className={`w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 py-3 ${field.type === "date" ? "date" : ""}`}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button onClick={resetForm} type="button" className="button-in-filter">
            <img src={reset_icon} alt="" />
            <span className="text-filter">Đặt lại</span>
          </button>
          <div className="flex gap-[15px]">
            <button type="button" className="button-in-filter" onClick={toggleFilter}>
              <img src={cancel_icon} alt="" />
              <span className="text-filter">Hủy</span>
            </button>
            <button type="button" className="button-in-filter bg-[#00854C]" onClick={handleApply}>
              <img src={accept_icon} alt="" />
              <span className="text-white text-filter">Áp dụng</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
