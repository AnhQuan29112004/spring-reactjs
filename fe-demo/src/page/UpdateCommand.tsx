import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commandQueryKeys, updateCommand, getCommandById } from "../service/commandService";
import { DynamicForm, type FormSection } from "../component/DynamicForm";
import type { CommandFormState } from "../interfaces/Command";


const initialFormState: CommandFormState = {
  so_van_ban: "",
  ngay_ban_hanh: "",
  ngay_nhan: "",
  don_vi_gui: "",
  loai_van_ban: "",
  noi_dung: "",
  lanh_dao_id: "",
};

export default function UpdateCommand() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: commandQueryKeys.detail(id),
    queryFn: () => getCommandById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [formData, setFormData] = useState<CommandFormState>(initialFormState);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [leaders, setLeaders] = useState<UserAdmin[]>([]);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);

  useEffect(() => {
    if (data) {
      setFormData({
        so_van_ban: data.so_van_ban || "",
        ngay_ban_hanh: data.ngay_ban_hanh ? data.ngay_ban_hanh.split("T")[0] : "",
        ngay_nhan: data.ngay_nhan ? data.ngay_nhan.split("T")[0] : "",
        don_vi_gui: data.don_vi_gui || "",
        loai_van_ban: data.loai_van_ban || "",
        noi_dung: data.noi_dung || "",
        lanh_dao_id: data.lanhDao?.id?.toString() || "",
      });
      setFileName(data.file ? data.file.split("/").pop() || "" : "");
    }
  }, [data]);

  const updateCommandMutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateCommand>[1]) =>
      updateCommand(Number(id), payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: commandQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: commandQueryKeys.detail(id) });
      showPopup("Cập nhật văn bản thành công", "success");
      navigate(-1);
    },
    onError: (error) => {
      console.error("Error updating command", error);
      showPopup("Cập nhật văn bản không thành công", "error");
    },
  });

  const isSubmitting = updateCommandMutation.isPending;

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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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

  const handleUpdateCommand = async (status?: string | null) => {
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
      let uploadedFilePath: string | null | undefined = undefined;
      if (selectedFile) {
        const uploadedFile = await uploadFile(selectedFile);
        uploadedFilePath = uploadedFile.path;
      }

      const payload: Parameters<typeof updateCommand>[1] = {
        so_van_ban: formData.so_van_ban.trim(),
        ngay_ban_hanh: formData.ngay_ban_hanh,
        ngay_nhan: formData.ngay_nhan,
        don_vi_gui: formData.don_vi_gui.trim(),
        noi_dung: formData.noi_dung.trim() || null,
        loai_van_ban: formData.loai_van_ban,
        lanhDao: {
          id: Number(formData.lanh_dao_id),
        },
      };

      if (uploadedFilePath !== undefined) {
        payload.file = uploadedFilePath;
      }

      if (status) {
        payload.trang_thai = status;
      }

      await updateCommandMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Error updating command", error);
    }
  };

  const commandFormConfig: FormSection[] = [
    {
      title: "Thông tin văn bản",
      hasResetBtn: true,
      fields: [
        { name: "so_van_ban", label: "Số văn bản", type: "text", required: true, hasSearchBtn: true },
        { name: "ngay_ban_hanh", label: "Ngày ban hành", type: "date", required: true, hasSearchBtn: true },
        { name: "don_vi_gui", label: "Đơn vị gửi", type: "text", required: true, placeholder: "Nhập đơn vị gửi văn bản" },
        { name: "ngay_nhan", label: "Ngày nhận văn bản", type: "date", required: true, hasSearchBtn: true },
        { name: "loai_van_ban", label: "Loại văn bản", type: "select", required: true, placeholder: "Loại văn bản", options: [
          { label: "Lệnh nhập kho", value: "Lệnh nhập kho" },
          { label: "Lệnh xuất kho", value: "Lệnh xuất kho" },
          { label: "Kế hoạch kiểm kê", value: "Kế hoạch kiểm kê" },
          { label: "Kế hoạch kiểm tra", value: "Kế hoạch kiểm tra" },
        ] },
        { name: "noi_dung", label: "Nội dung", type: "textarea", placeholder: "Nhập nội dung văn bản" },
        { name: "file", label: "Tệp đính kèm", type: "file", required: true },
      ],
    },
    {
      title: "Thông tin xử lý văn bản",
      fields: [
        { 
          name: "lanh_dao_id", 
          label: "Lãnh đạo phê duyệt", 
          type: "select", 
          required: true, 
          disabled: isLoadingLeaders, 
          placeholder: isLoadingLeaders ? "Đang tải lãnh đạo..." : "Chọn lãnh đạo phê duyệt",
          options: leaders.map((leader) => ({ label: leader.username, value: leader.id }))
        },
        { name: "kho_tiep_nhan", label: "Kho tiếp nhận văn bản", type: "select", options: [] }
      ]
    }
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-5 max-sm:flex-col max-sm:items-start max-sm:justify-center">
        <h1 className="text-left font-be_vietnam_pro text-[36px] font-bold leading-[44px] text-[#135C3B]">
          Chỉnh sửa văn bản {isLoading && " (Đang tải...)"}
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
            onClick={() => handleUpdateCommand()}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded border border-[#D9D9D9] bg-[#00854C] px-[15px] py-[5px] disabled:opacity-70"
          >
            <img src={save_icon} alt="" />
            <span className="text-white text-normal">{isSubmitting ? "Đang lưu..." : "Lưu"}</span>
          </button>
          <button
            type="button"
            onClick={() => handleUpdateCommand("chua_phe_duyet")}
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

      <DynamicForm
        sections={commandFormConfig}
        formData={formData}
        onChange={handleInputChange}
        onFileChange={handleFileChange}
        fileName={fileName}
        onReset={handleResetForm}
      />
    </div>
  );
}
