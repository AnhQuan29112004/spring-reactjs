import type { ChangeEvent } from "react";
import { useState } from "react";
import filter_green_icon from "../assets/filter-green.svg";
import reset_icon from "../assets/reset.svg";
import cancel_icon from "../assets/cancel.svg";
import accept_icon from "../assets/accept.svg";
import type { CommandFilterValues } from "../interfaces/Command";
import { form } from "framer-motion/client";

const initialForm: CommandFilterValues = {
  loai_van_ban: "",
  don_vi_gui: "",
  ngay_nhan: "",
};

interface FilterProps {
  toggleFilter: () => void;
  filterValues: CommandFilterValues;
  onApply: (values: CommandFilterValues) => void;
}

export function Filter({ toggleFilter, filterValues, onApply }: FilterProps) {
  const [formData, setFormData] = useState<CommandFilterValues>(filterValues);

  const resetForm = () => {
    setFormData(initialForm);
  };

  const handleChangeInput =
    (key: keyof CommandFilterValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  const handleApply = () => {
    console.log('check form:',formData)
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
          <div className="flex flex-col items-start gap-2">
            <span className="text-filter">Loại văn bản</span>
            <select
              value={formData.loai_van_ban}
              onChange={handleChangeInput("loai_van_ban")}
              className="w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 py-3"
            >
              <option value="">Tất cả</option>
              <option value="Lệnh nhập kho">Lệnh nhập kho</option>
              <option value="Lệnh xuất kho">Lệnh xuất kho</option>
              <option value="Kế hoạch kiểm kê">Kế hoạch kiểm kê</option>
              <option value="Kế hoạch kiểm tra">Kế hoạch kiểm tra</option>
            </select>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="text-filter">Đơn vị gửi</span>
            <input
              value={formData.don_vi_gui}
              onChange={handleChangeInput("don_vi_gui")}
              className="w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 py-3"
              placeholder="Nhập đơn vị gửi"
            />
          </div>
        </div>
        <div className="flex flex-col items-start w-full gap-2">
          <span className="text-filter">Ngày nhận</span>
          <input
            value={formData.ngay_nhan}
            onChange={handleChangeInput("ngay_nhan")}
            type="date"
            className="date"
          />
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
