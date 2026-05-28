import React, { type ChangeEvent } from "react";
import reset_icon from "../assets/reset.svg";
import required_icon from "../assets/required.svg";
import search_icon from "../assets/search-icon.svg";
import choose_file from "../assets/choose-file.svg";
import type { UserAdmin } from "../service/userService";

export interface CommandFormState {
  so_van_ban: string;
  ngay_ban_hanh: string;
  ngay_nhan: string;
  don_vi_gui: string;
  loai_van_ban: string;
  noi_dung: string;
  lanh_dao_id: string;
}

interface CommandFormUIProps {
  formData: CommandFormState;
  handleInputChange: (
    field: keyof CommandFormState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleResetForm?: () => void;
  fileName: string;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  leaders: UserAdmin[];
  isLoadingLeaders: boolean;
}

export default function CommandFormUI({
  formData,
  handleInputChange,
  handleResetForm,
  fileName,
  handleFileChange,
  leaders,
  isLoadingLeaders,
}: CommandFormUIProps) {
  return (
    <>
      <div className="flex w-full flex-col items-start gap-[10px] rounded-md border border-[#BCBCBC] p-[10px]">
        <div className="flex w-full items-center justify-between">
          <span className="title-form">Thông tin văn bản</span>
          {handleResetForm && (
            <button
              type="button"
              onClick={handleResetForm}
              className="flex items-center justify-center gap-2 rounded-[4px] bg-[#00854C] px-4 py-[6px]"
            >
              <img src={reset_icon} className="invert brightness-100" />
              <span className="text-normal text-white">Nhập lại thông tin</span>
            </button>
          )}
        </div>

        <div className="flex w-full flex-col gap-5 px-[10px]">
          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="text-normal mr-1 font-medium">Số văn bản</span>
                <img src={required_icon} alt="" />
              </div>
              <div className="flex gap-[10px]">
                <input
                  value={formData.so_van_ban}
                  onChange={handleInputChange("so_van_ban")}
                  className="h-8 w-full rounded-[4px] border-[0.8px] border-[#D9D9D9] bg-white px-4 py-[7px]"
                />
                <button type="button" className="rounded-[4px] bg-[#00854C] px-3 py-[2px]">
                  <img src={search_icon} className="h-6 w-6 invert brightness-100" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="text-normal mr-1 font-medium">Ngày ban hành</span>
                <img src={required_icon} alt="" />
              </div>
              <div className="flex gap-[10px]">
                <input
                  type="date"
                  value={formData.ngay_ban_hanh}
                  onChange={handleInputChange("ngay_ban_hanh")}
                  className="date h-8 py-[7px]"
                />
                <button type="button" className="rounded-[4px] bg-[#00854C] px-3 py-[2px]">
                  <img src={search_icon} className="h-6 w-6 invert brightness-100" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="text-normal mr-1 font-medium">Đơn vị gửi</span>
                <img src={required_icon} alt="" />
              </div>
              <input
                value={formData.don_vi_gui}
                onChange={handleInputChange("don_vi_gui")}
                className="text-placeholder h-8 w-full rounded-[4px] border-[0.8px] border-[#D9D9D9] bg-white px-4 py-[7px]"
                placeholder="Nhập đơn vị gửi văn bản"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="text-normal mr-1 font-medium">Ngày nhận văn bản</span>
                <img src={required_icon} alt="" />
              </div>
              <div className="flex gap-[10px]">
                <input
                  type="date"
                  value={formData.ngay_nhan}
                  onChange={handleInputChange("ngay_nhan")}
                  className="date h-8 py-[7px]"
                />
                <button type="button" className="rounded-[4px] bg-[#00854C] px-3 py-[2px]">
                  <img src={search_icon} className="h-6 w-6 invert brightness-100" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex">
              <span className="text-normal mr-1 font-medium">Loại văn bản</span>
              <img src={required_icon} alt="" />
            </div>
            <select
              value={formData.loai_van_ban}
              onChange={handleInputChange("loai_van_ban")}
              className={`text-normal h-8 w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 ${
                formData.loai_van_ban ? "text-black/85" : "text-black/25"
              }`}
            >
              <option value="" disabled>
                Loại văn bản
              </option>
              <option value="Lệnh nhập kho">Lệnh nhập kho</option>
              <option value="Lệnh xuất kho">Lệnh xuất kho</option>
              <option value="Kế hoạch kiểm kê">Kế hoạch kiểm kê</option>
              <option value="Kế hoạch kiểm tra">Kế hoạch kiểm tra</option>
            </select>
          </div>

          <div className="flex w-full flex-col items-start gap-2">
            <span className="text-normal mr-1 font-medium">Nội dung</span>
            <textarea
              value={formData.noi_dung}
              onChange={handleInputChange("noi_dung")}
              className="text-placeholder w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 pt-2"
              placeholder="Nhập nội dung văn bản"
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex">
              <span className="text-normal mr-1 font-medium">Tệp đính kèm</span>
              <img src={required_icon} alt="" />
            </div>
            <label className="flex w-fit cursor-pointer items-center justify-center rounded-[4px] border border-[#D9D9D9] bg-white px-4 shadow-sm">
              <img src={choose_file} alt="" />
              <span className="text-normal ml-2 py-1 pr-4">Chọn file</span>
              <span className="text-[20px] text-[#2B2B2B]">{fileName}</span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-5 flex w-full flex-col items-start gap-[10px] rounded-md border border-[#BCBCBC] p-[10px]">
        <div className="flex w-full items-center justify-between">
          <span className="title-form">Thông tin xử lý văn bản</span>
        </div>

        <div className="flex w-full flex-col gap-5 px-[10px]">
          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="text-normal mr-1 font-medium">Lãnh đạo phê duyệt</span>
                <img src={required_icon} alt="" />
              </div>
              <div className="flex gap-[10px]">
                <select
                  value={formData.lanh_dao_id}
                  onChange={handleInputChange("lanh_dao_id")}
                  disabled={isLoadingLeaders}
                  className={`text-normal h-8 w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 ${
                    formData.lanh_dao_id ? "text-black/85" : "text-black/25"
                  }`}
                >
                  <option value="" disabled>
                    {isLoadingLeaders ? "Đang tải lãnh đạo..." : "Chọn lãnh đạo phê duyệt"}
                  </option>
                  {leaders.map((leader) => (
                    <option key={leader.id} value={leader.id}>
                      {leader.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="text-normal mr-1 font-medium">Kho tiếp nhận văn bản</span>
              </div>
              <div className="flex gap-[10px]">
                <select className="h-8 w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
