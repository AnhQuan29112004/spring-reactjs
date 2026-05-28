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
import CommandFormUI, { type CommandFormState } from "../component/CommandFormUI";


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

  const handleCreateCommand = async (status:string) => {
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
        trang_thai: status,
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
            onClick={()=>handleCreateCommand(null)}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded border border-[#D9D9D9] bg-[#00854C] px-[15px] py-[5px] disabled:opacity-70"
          >
            <img src={save_icon} alt="" />
            <span className="text-white text-normal">{isSubmitting ? "Đang lưu..." : "Lưu"}</span>
          </button>
          <button
            type="button"
            onClick={()=>handleCreateCommand("chua_phe_duyet")}
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

      <CommandFormUI
        formData={formData}
        handleInputChange={handleInputChange}
        handleResetForm={handleResetForm}
        fileName={fileName}
        handleFileChange={handleFileChange}
        leaders={leaders}
        isLoadingLeaders={isLoadingLeaders}
      />
    </div>
  );
}
