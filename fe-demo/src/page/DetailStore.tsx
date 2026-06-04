import { useEffect, useRef, useState } from "react";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
import ToolBar from "../component/ToolBar";
import { DataTable, type Column } from "../component/DataTable";
import { useNavigate } from "react-router-dom";
import type { CommandFilterValues } from "../interfaces/Command";
import type { FilterField } from "../component/FIlter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  commandQueryKeys,
  deleteCommand,
  deleteCommands,
  getCommands,
  type CommandResponse,
} from "../service/commandService";
import dot_lime_icon from '../assets/dot_lime.svg'
import { label } from "framer-motion/client";
import InventoryHistoryTab from "../component/DetailStore/InvertoryHistoryTab";
import InspectionHistoryTab from "../component/DetailStore/InspectionHistoryTab";
import EvidenceTab from "../component/DetailStore/EvidenceTab";
import ActivityLogTab from "../component/DetailStore/ActivityLogTab";
import Overview from "../component/DetailStore/Overview";

const TABS = [
  { id: "THONG_TIN_CHUNG", label: "Thông tin chung", value: "thong_tin_chung", actions: ["setting"] as const },
  { id: "CAU_TRUC_KHO", label: "Cấu trúc kho", value: "cau_truc_kho", actions: ["setting"] as const },
  { id: "LICH_SU_KIEM_KE", label: "Lịch sử kiểm kê", value: "lich_su_kiem_ke", actions: ["setting"] as const },
  { id: "LICH_SU_KIEM_TRA", label: "Lịch sử kiểm tra", value: "lich_su_kiem_tra", actions: ["setting"] as const },
  { id: "VAT_CHUNG_TAI_LIEU_DO_VAT", label: "Vật chứng/ Tài liệu đồ vật", value: "vat_chung_tai_lieu_do_vat", actions: ["setting"] as const },
  { id: "NHAT_KY_HOAT_DONG", label: "Nhật ký hoạt động", value: "nhat_ky_hoat_dong", actions: ["setting"] as const },
];

export default function DetailStore() {
  const [currentTab, setCurrentTab] = useState('THONG_TIN_CHUNG')
  

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-[14px] w-full mb-5">

        <div className="flex items-center justify-between pt-5 max-sm:flex-col max-sm:items-start max-sm:justify-center">
          <h1 className="text-left font-be_vietnam_pro text-[36px] font-bold leading-[44px] text-[#135C3B]">
            Chi tiết kho vật chứng Công an Thành phố Hà Nội - Khu A
          </h1>
          <div className="flex gap-[10px]">
            <button
              type="button"
              className="flex h-auto items-center justify-center gap-2 rounded border border-[#D9D9D9] bg-white px-[15px] py-[5px]"
            >
              <span className="text-normal-14">Quay lại</span>
            </button>
            <div className={`flex gap-[10px]`}>

              <button
                type="button"
                className="flex h-auto bg-[#00854C] items-center justify-center gap-2 rounded border border-[#00854C] px-[15px] py-[5px]"
              >
                <span className="text-normal-14 text-white">Chỉnh sửa</span>
              </button>
              <button
                type="button"
                className="flex h-auto bg-[#00854C] items-center justify-center gap-2 rounded border border-[#00854C] px-[15px] py-[5px]"
              >
                <span className="text-normal-14 text-white">Xóa kho</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-[14px] justify-start items-center">
          <span className="font-ibm_mono font-semibold text-[#666666] align-middle" style={{ fontSize: '16px' }}> KC-CATPHB-001 </span>
          <div className="bg-[#F1EAFA] rounded px-[10px] py-[2px] flex justify-center items-center">
            <span className="text-semibold-14 text-[12px] leading-5 text-[#722ED1] no-underline">Cấp bộ</span>
          </div>
          <div className="flex gap-2 items-center">
            <img src={dot_lime_icon} alt="" />
            <span className="text-normal-14 text-black/90">Hoạt động</span>
          </div>
        </div>
      </div>

      <div className="flex items-center flex-wrap mb-5">
        {
          TABS.map((item, key) => {
            const isSelected = currentTab === item.id;
            return (
              <div onClick={() => setCurrentTab(item.id)} className={`flex justify-center items-center px-5 py-4 cursor-pointer ${isSelected ? 'border-b-2 border-[#1E5631]' : ''} `}>
                <span className={`${isSelected ? 'text-bold-16 text-[#1E5631E0]' : 'text-normal-16 text-[#000000E0]'}`}>{item.label}</span>
              </div>
            )
          })
        }

      </div>

      <div className="flex w-full h-auto">
        {currentTab === 'THONG_TIN_CHUNG' && <Overview />}
        {currentTab === "LICH_SU_KIEM_KE" && <InventoryHistoryTab />}
        {currentTab === "LICH_SU_KIEM_TRA" && <InspectionHistoryTab />}
        {currentTab === "VAT_CHUNG_TAI_LIEU_DO_VAT" && <EvidenceTab />}
        {currentTab === 'NHAT_KY_HOAT_DONG' && <ActivityLogTab />}
      </div>
    </div>

  );
}
