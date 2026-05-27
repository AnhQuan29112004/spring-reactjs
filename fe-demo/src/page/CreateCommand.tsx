import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import back_icon from "../assets/back.svg";
import save_icon from "../assets/save.svg";
import person_icon from "../assets/person.svg";
import reset_icon from "../assets/reset.svg";
import required_icon from "../assets/required.svg";
import search_icon from "../assets/search-icon.svg";
import choose_file from "../assets/choose-file.svg";
import { usePopup } from "../component/PopupProvider";
import { getLeaderUsers, type UserAdmin } from "../service/userService";
import { uploadFile } from "../service/uploadService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commandQueryKeys, createCommand } from "../service/commandService";

interface CommandFormState {
  so_van_ban: string;
  ngay_ban_hanh: string;
  ngay_nhan: string;
  don_vi_gui: string;
  loai_van_ban: string;
  noi_dung: string;
  lanh_dao_id: string;
}

const initialFormState: CommandFormState = {
  so_van_ban: "",
  ngay_ban_hanh: "",
  ngay_nhan: "",
  don_vi_gui: "",
  loai_van_ban: "",
  noi_dung: "",
  lanh_dao_id: "",
};

export default function CreateCommand() {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CommandFormState>(initialFormState);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [leaders, setLeaders] = useState<UserAdmin[]>([]);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);

  const createCommandMutation = useMutation({
    mutationFn: createCommand,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: commandQueryKeys.lists() });
      showPopup("Thêm văn bản thành công", "success");
      navigate("/quan-ly-lenh");
    },
    onError: (error) => {
      console.error("Error creating command", error);
      showPopup("Thêm văn bản không thành công", "error");
    },
  });

  const isSubmitting = createCommandMutation.isPending;

  useEffect(() => {
    const loadLeaders = async () => {
      try {
        const data = await getLeaderUsers();
        setLeaders(data);
      } catch (error) {
        console.error("Error loading leaders", error);
        showPopup("Không tải được danh sách lãnh đạo", "error");
      } finally {
        setIsLoadingLeaders(false);
      }
    };

    void loadLeaders();
  }, [showPopup]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/quan-ly-lenh");
  };

  const handleInputChange =
    (field: keyof CommandFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleResetForm = () => {
    setFormData(initialFormState);
    setFileName("");
    setSelectedFile(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setFileName(file?.name || "");
  };

  const handleCreateCommand = async () => {
    if (isSubmitting) {
      return;
    }

    if (!formData.so_van_ban.trim()) {
      showPopup("Vui lòng nhập số văn bản", "error");
      return;
    }

    if (!formData.ngay_ban_hanh) {
      showPopup("Vui lòng chọn ngày ban hành", "error");
      return;
    }

    if (!formData.don_vi_gui.trim()) {
      showPopup("Vui lòng nhập đơn vị gửi", "error");
      return;
    }

    if (!formData.ngay_nhan) {
      showPopup("Vui lòng chọn ngày nhận văn bản", "error");
      return;
    }

    if (!formData.lanh_dao_id) {
      showPopup("Vui lòng chọn lãnh đạo phê duyệt", "error");
      return;
    }

    try {
      let uploadedFilePath: string | null = null;
      if (selectedFile) {
        const uploadedFile = await uploadFile(selectedFile);
        uploadedFilePath = uploadedFile.path;
      }

      await createCommandMutation.mutateAsync({
        so_van_ban: formData.so_van_ban.trim(),
        ngay_ban_hanh: formData.ngay_ban_hanh,
        ngay_nhan: formData.ngay_nhan,
        don_vi_gui: formData.don_vi_gui.trim(),
        noi_dung: formData.noi_dung.trim() || null,
        loai_van_ban: formData.loai_van_ban,
        file: uploadedFilePath,
        lanhDao: {
          id: Number(formData.lanh_dao_id),
        },
        da_phe_duyet: false,
      });
    } catch (error) {
      console.error("Error creating command", error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-5 max-sm:flex-col max-sm:items-start max-sm:justify-center">
        <h1 className="text-left font-be_vietnam_pro text-[36px] font-bold leading-[44px] text-[#135C3B]">
          Tiếp nhận văn bản
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
          <button
            type="button"
            onClick={handleCreateCommand}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded border border-[#D9D9D9] bg-[#00854C] px-[15px] py-[5px] disabled:opacity-70"
          >
            <img src={save_icon} alt="" />
            <span className="text-white text-normal">{isSubmitting ? "Đang lưu..." : "Lưu"}</span>
          </button>
          <button
            type="button"
            onClick={handleCreateCommand}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded border border-[#D9D9D9] bg-[#00854C] px-[15px] py-[5px] disabled:opacity-70"
          >
            <img src={person_icon} alt="" />
            <span className="text-white text-normal">
              {isSubmitting ? "Đang lưu..." : "Lưu & trình duyệt"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-[10px] rounded-md border border-[#BCBCBC] p-[10px]">
        <div className="flex items-center justify-between w-full">
          <span className="title-form">Thông tin văn bản tiếp nhận</span>
          <button
            type="button"
            onClick={handleResetForm}
            className="flex items-center justify-center gap-2 rounded-[4px] bg-[#00854C] px-4 py-[6px]"
          >
            <img src={reset_icon} className="invert brightness-100" />
            <span className="text-white text-normal">Nhập lại thông tin</span>
          </button>
        </div>

        <div className="flex w-full flex-col gap-5 px-[10px]">
          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="mr-1 font-medium text-normal">Số văn bản</span>
                <img src={required_icon} alt="" />
              </div>
              <div className="flex gap-[10px]">
                <input
                  value={formData.so_van_ban}
                  onChange={handleInputChange("so_van_ban")}
                  className="h-8 w-full rounded-[4px] border-[0.8px] border-[#D9D9D9] bg-white px-4 py-[7px]"
                />
                <button type="button" className="rounded-[4px] bg-[#00854C] px-3 py-[2px]">
                  <img src={search_icon} className="w-6 h-6 invert brightness-100" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="mr-1 font-medium text-normal">Ngày ban hành</span>
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
                  <img src={search_icon} className="w-6 h-6 invert brightness-100" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="mr-1 font-medium text-normal">Đơn vị gửi</span>
                <img src={required_icon} alt="" />
              </div>
              <input
                value={formData.don_vi_gui}
                onChange={handleInputChange("don_vi_gui")}
                className="h-8 w-full rounded-[4px] border-[0.8px] border-[#D9D9D9] bg-white px-4 py-[7px] text-placeholder"
                placeholder="Nhập đơn vị gửi văn bản"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="mr-1 font-medium text-normal">Ngày nhận văn bản</span>
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
                  <img src={search_icon} className="w-6 h-6 invert brightness-100" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full gap-2">
            <div className="flex">
              <span className="mr-1 font-medium text-normal">Loại văn bản</span>
              <img src={required_icon} alt="" />
            </div>
            <select
              value={formData.loai_van_ban}
              onChange={handleInputChange("loai_van_ban")}
              className={`h-8 w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 text-normal ${
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

          <div className="flex flex-col items-start w-full gap-2">
            <span className="mr-1 font-medium text-normal">Nội dung</span>
            <textarea
              value={formData.noi_dung}
              onChange={handleInputChange("noi_dung")}
              className="w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 pt-2 text-placeholder"
              placeholder="Nhập nội dung văn bản"
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <div className="flex">
              <span className="mr-1 font-medium text-normal">Tệp đính kèm</span>
              <img src={required_icon} alt="" />
            </div>
            <label className="flex w-fit cursor-pointer items-center justify-center rounded-[4px] border border-[#D9D9D9] bg-white px-4 shadow-sm">
              <img src={choose_file} alt="" />
              <span className="py-1 pr-4 ml-2 text-normal">Chọn file</span>
              <span className="text-[20px] text-[#2B2B2B]">{fileName}</span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-5 flex w-full flex-col items-start gap-[10px] rounded-md border border-[#BCBCBC] p-[10px]">
        <div className="flex items-center justify-between w-full">
          <span className="title-form">Thông tin xử lý văn bản</span>
        </div>

        <div className="flex w-full flex-col gap-5 px-[10px]">
          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            <div className="flex flex-col gap-2">
              <div className="flex">
                <span className="mr-1 font-medium text-normal">Lãnh đạo phê duyệt</span>
                <img src={required_icon} alt="" />
              </div>
              <div className="flex gap-[10px]">
                <select
                  value={formData.lanh_dao_id}
                  onChange={handleInputChange("lanh_dao_id")}
                  disabled={isLoadingLeaders}
                  className={`h-8 w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 text-normal ${
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
                <span className="mr-1 font-medium text-normal">Kho tiếp nhận văn bản</span>
              </div>
              <div className="flex gap-[10px]">
                <select className="h-8 w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
