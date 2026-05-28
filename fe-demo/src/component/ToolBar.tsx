import { useState } from "react";
import search_icon from "../assets/search-icon.svg";
import filter_icon from "../assets/filter.svg";
import trash_icon from "../assets/trash.svg";
import add_icon from "../assets/add.svg";
import setting_icon from "../assets/setting.svg";
import { Filter } from "./FIlter";
import type { FilterField } from "./FIlter";
import { motion, AnimatePresence } from "framer-motion";

type ToolBarProp<T = any> = {
  search: string;
  handleSearchChange: (value: string) => void;
  selectedIds: Array<string | number>;
  handleDeleteSelected: () => void;
  handleAddClick: () => void;
  filterValues?: T;
  handleApplyFilter?: (values: T) => void;
  actions?: ("add" | "delete" | "setting")[];
  filterFields?: FilterField[];
  initialFilterValues?: T;
};

export default function ToolBar<T = any>({
  search,
  handleSearchChange,
  selectedIds,
  handleDeleteSelected,
  handleAddClick,
  filterValues,
  handleApplyFilter,
  actions = ["add", "delete", "setting"],
  filterFields,
  initialFilterValues,
}: ToolBarProp<T>) {
  const [openFilter, setOpenFilter] = useState(false);

  const toggleFilter = () => {
    console.log("check co click hay khong.", openFilter && filterFields && initialFilterValues && filterValues && handleApplyFilter)
    setOpenFilter((prev) => !prev);
  };

  return (
    <div className="toolbar">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative flex w-2/5 items-center">
          <div className="absolute left-3">
            <img src={search_icon} alt="" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Tìm kiếm văn bản"
            className="h-11 w-full rounded-[8px] border border-[#D9D9D9] bg-white px-8 text-sm text-[#222222] outline-none transition placeholder:font-ibm focus:border-[#00854C]"
          />
        </div>
        <div className="relative flex">
          {openFilter && filterFields && initialFilterValues && filterValues && handleApplyFilter ? (
            <motion.div
              id="login-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Filter
                  toggleFilter={toggleFilter}
                  filterValues={filterValues}
                  initialValues={initialFilterValues}
                  fields={filterFields}
                  onApply={handleApplyFilter}
                />
              </motion.div>
          ) : null}
          
          {filterFields && filterFields.length > 0 && (
            <button
              type="button"
              onClick={toggleFilter}
              className="flex h-11 min-w-[110px] items-center gap-[10px] rounded-[8px] bg-[#0C9254] px-4 font-roboto text-base font-normal text-white"
            >
              <img src={filter_icon} alt="" />
              Bộ lọc
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions.includes("delete") && (
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={async () => {
              if (confirm(`Bạn chắc chắn muốn xóa ${selectedIds.length} bản ghi đã chọn?`)) {
                await handleDeleteSelected();
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#AF3333] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#E7A7A3]"
          >
            <img className="h-[26px] w-[26px]" src={trash_icon} alt="" />
          </button>
        )}
        {actions.includes("add") && (
          <button
            type="button"
            onClick={handleAddClick}
            className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#0C9254] text-sm font-semibold text-white"
          >
            <img className="h-[26px] w-[26px]" src={add_icon} alt="" />
          </button>
        )}
        {actions.includes("setting") && (
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#0C9254] text-sm font-semibold text-white"
          >
            <img className="h-[26px] w-[26px]" src={setting_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
}
