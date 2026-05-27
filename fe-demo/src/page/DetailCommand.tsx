import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axios";
import back_icon from "../assets/back.svg";
import history_icon from "../assets/history.svg";
import dot_orange from "../assets/dot-orange.svg";
import { usePopup } from "../component/PopupProvider";
import { getLeaderUsers, type UserAdmin } from "../service/userService";
import { uploadFile } from "../service/uploadService";
import TimelineItem from "../component/TimeLine";
import { getCommandById } from "../service/commandService";
import { useQuery } from "@tanstack/react-query";


export default function DetailCommand() {
    const {id}:any = useParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ["command", id], 
        queryFn: () => getCommandById(id),
        enabled: !!id, 
    });

  const history = [
    {
        title: "Nguyễn Quỳnh Trang - Tham mưu tổng hợp",
        description: "Đã trình duyệt lệnh nhập",
        time: "2026-04-10 14:30:00"
    },
    {
        title: "Nguyễn Quỳnh Trang - Tham mưu tổng hợp",
        description: "Đã tiếp nhận văn bản",
        time: "2026-04-10 14:30:00"
    }
    ];
    const navigate = useNavigate();
    const handleBack = () => {
        if (window.history.length > 1) {
        navigate(-1);
        return;
        }

        navigate("/quan-ly-lenh");
    };
    console.log("check detail command: ", data);
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-5 max-sm:flex-col max-sm:items-start max-sm:justify-center">
        <h1 className="text-left font-be_vietnam_pro text-[36px] font-bold leading-[44px] text-[#135C3B]">
          Chi tiết văn bản
        </h1>
        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-auto items-center justify-center gap-2 rounded border border-[#D9D9D9] bg-white px-[15px] py-[5px]"
          >
            <img src={back_icon} alt="" />
            <span className="text-normal">Quay lại</span>
          </button>
          
        </div>
      </div>
            <div className="flex gap-[10px] w-full h-auto max-lg:flex-col max-lg:gap-5">
                
                <div className="flex w-[70%] max-lg:w-full flex-col h-full items-start gap-5 rounded-md border border-[#BCBCBC] p-[10px]">
                    <span className="title-form">Thông tin chi tiết văn bản</span>
                    <span className="flex items-start gap-1 py-[2px]">
                        <img src={dot_orange} />
                        <span className="font-inter text-left font-normal text-[13px] leading-5 text-[#006B3F]">Thông tin văn bản số LNK/05132026 được đồng bộ từ Hệ thống Quản lý văn bản</span>
                    </span>
                    <div className="grid w-full grid-cols-[20%_78%] gap-5">
                        <div className="text-left text-black no-underline text-semibold">
                            Số văn bản:
                        </div>

                        <div className="text-left text-black no-underline text-semibold">
                            202604-0001/LNK
                        </div>

                        <div className="text-left text-black no-underline text-semibold">
                            Ngày ban hành: 
                        </div>

                        <div className="text-left text-normal">
                            10/4/2026
                        </div>

                        <div className="text-left text-black no-underline text-semibold">
                            Đơn vị gửi: 
                        </div>

                        <div className="text-left text-normal">
                            Phòng Cảnh sát Hình sự - Công an TP. Hà Nội
                        </div>

                        <div className="text-left text-black no-underline text-semibold">
                            Nội dung: 
                        </div>

                        <div className="text-left text-normal">
                            Về việc nhập kho vật chứng của vụ án Trộm cắp tài sản xảy ra tại phường Tân Thịnh, thành phố Hòa BìnhVề việc nhập kho vật chứng của vụ án Trộm cắp tài sản xảy ra tại phường Tân Thịnh, thành phố Hòa BìnhVề việc nhập kho vật chứng của vụ án Trộm cắp tài sản xảy ra tại phường Tân Thịnh, thành phố Hòa Bình
                        </div>
                        <div className="text-left text-black no-underline text-semibold">
                            File đính kèm:
                        </div>
                        <div className="text-left text-[#1890FF] italic text-semibold">
                            Nội dung: 
                        </div>
                        <div className="text-left text-black no-underline text-semibold">
                            Loại văn bản:
                        </div>
                        <div className="text-left text-black no-underline text-semibold">
                            Lệnh nhập kho
                        </div>
                        <div className="text-left text-black no-underline text-semibold">
                            Lãnh đạo phê duyệt: 
                        </div>
                        <div className="text-left text-black no-underline text-semibold">
                            Nguyễn Văn A - Trưởng phòng 4 C11
                        </div>
                        <div className="text-left text-black no-underline text-semibold">
                            Kho tiếp nhận văn bản:
                        </div>
                        <div className="text-left text-normal">
                            [Chưa chọn kho tiếp nhận văn bản...]
                        </div>
                    </div>
                </div>

                <div className="flex w-[30%] max-lg:w-full h-full flex-col items-start gap-[10px] rounded-md border border-[#BCBCBC] p-[10px]">
                    <div className="flex items-center justify-start w-full gap-[10px]">
                        <img src={history_icon} />
                        <span className="title-form">Lịch sử xử lý</span>
                    </div>
                    <div>
                        
                        {history.map((item, index) => (
                            <TimelineItem
                            key={index}
                            {...item}
                            isLast={index === history.length - 1}
                            />
                        ))}
                    </div>
                    
                </div>
            </div>
    </div>
  );
}
