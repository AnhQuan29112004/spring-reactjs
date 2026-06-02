import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import back_icon from "../assets/back.svg";
import save_icon from "../assets/save.svg";
import person_icon from "../assets/person.svg";
import reset_icon from "../assets/reset.svg";
import required_icon from "../assets/required.svg";
import search_icon from "../assets/search-icon.svg";
import choose_file from "../assets/choose-file.svg";
import trash_2_icon from "../assets/trash-2.svg";
import { usePopup } from "../component/PopupProvider";
import { getLeaderUsers, type UserAdmin } from "../service/userService";
import { uploadFile } from "../service/uploadService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { commandQueryKeys, createProduct } from "../service/commandService";
import { DynamicForm, type FormSection } from "../component/DynamicForm";
import type { StoreState } from "../interfaces/Store";
import { icons } from "lucide-react";
import { type StorageNode, initialStorageTree } from "../component/StorageStructure";
import { AddStructureModal } from "../component/AddStructureModal";
import add_icon from "../assets/add.svg";

const initialFormState: StoreState = {
  ma_kho: '',
  ten_kho: '',
  cap_kho: '',
  don_vi_quan_ly: '',
  tinh_thanh: '',
  phuong_xa: '',
  dia_chi: '',
  trang_thai: '',
  ghi_chu: '',
  nhan_su: [],
  storage_tree: initialStorageTree
};

export default function CreateProduct() {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<StoreState>(initialFormState);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [leaders, setLeaders] = useState<UserAdmin[]>([]);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);
  const [temp, setTemp] = useState<boolean>(false);

  // const createProductMutation = useMutation({
  //   mutationFn: createProduct,
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries({ queryKey: commandQueryKeys.lists() });
  //     showPopup("Thêm văn bản thành công", "success");
  //     navigate("/quan-ly-lenh");
  //   },
  //   onError: (error) => {
  //     console.error("Error creating command", error);
  //     showPopup("Thêm văn bản không thành công", "error");
  //   },
  // });

  // const isSubmitting = createProductMutation.isPending;

  // useEffect(() => {
  //   const loadLeaders = async () => {
  //     try {
  //       const data = await getLeaderUsers();
  //       setLeaders(data);
  //     } catch (error) {
  //       console.error("Error loading leaders", error);
  //       showPopup("Không tải được danh sách lãnh đạo", "error");
  //     } finally {
  //       setIsLoadingLeaders(false);
  //     }
  //   };

  //   void loadLeaders();
  // }, [showPopup]);

  // const handleBack = () => {
  //   if (window.history.length > 1) {
  //     navigate(-1);
  //     return;
  //   }

  //   navigate("/quan-ly-kho/danh-sach-kho");
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNewNode = (newNode: StorageNode, parentId: string | null) => {
    const addNodeToTree = (nodes: StorageNode[], pId: string | null, nodeToAdd: StorageNode): StorageNode[] => {
      if (!pId) {
        return [...nodes, nodeToAdd];
      }
      return nodes.map(node => {
        if (node.id === pId) {
          return {
            ...node,
            children: [...(node.children || []), nodeToAdd]
          };
        } else if (node.children) {
          return {
            ...node,
            children: addNodeToTree(node.children, pId, nodeToAdd)
          };
        }
        return node;
      });
    };

    const currentTree = formData.storage_tree || [];
    const updatedTree = addNodeToTree(currentTree, parentId, newNode);
    handleInputChange("storage_tree", updatedTree);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      // Nếu field name chứa dấu chấm -> xử lý mảng/object lồng nhau
      if (field.includes('.')) {
        const [arrayName, indexStr, key] = field.split('.'); // ["nhan_su", "0", "username"]
        const index = parseInt(indexStr);

        const newArray = [...(prev[arrayName as keyof StoreState] as any[]) || []];
        newArray[index] = { ...newArray[index], [key]: value };

        return { ...prev, [arrayName]: newArray };
      }
      // Dữ liệu bình thường (flat)
      return { ...prev, [field]: value };
    });
    console.log('check form dât: ', formData)
  };

  const handleResetForm = () => {
    setFormData(initialFormState);
  };

  // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0] || null;
  //   setSelectedFile(file);
  //   setFileName(file?.name || "");
  // };

  // const handleCreateProduct = async (status:string) => {
  //   if (isSubmitting) {
  //     return;
  //   }

  //   if (!formData.so_van_ban.trim()) {
  //     showPopup("Vui lòng nhập số văn bản", "error");
  //     return;
  //   }

  //   if (!formData.ngay_ban_hanh) {
  //     showPopup("Vui lòng chọn ngày ban hành", "error");
  //     return;
  //   }

  //   if (!formData.don_vi_gui.trim()) {
  //     showPopup("Vui lòng nhập đơn vị gửi", "error");
  //     return;
  //   }

  //   if (!formData.ngay_nhan) {
  //     showPopup("Vui lòng chọn ngày nhận văn bản", "error");
  //     return;
  //   }

  //   if (!formData.lanh_dao_id) {
  //     showPopup("Vui lòng chọn lãnh đạo phê duyệt", "error");
  //     return;
  //   }

  //   try {
  //     let uploadedFilePath: string | null = null;
  //     if (selectedFile) {
  //       const uploadedFile = await uploadFile(selectedFile);
  //       uploadedFilePath = uploadedFile.path;
  //     }

  //     await createProductMutation.mutateAsync({
  //       so_van_ban: formData.so_van_ban.trim(),
  //       ngay_ban_hanh: formData.ngay_ban_hanh,
  //       ngay_nhan: formData.ngay_nhan,
  //       don_vi_gui: formData.don_vi_gui.trim(),
  //       noi_dung: formData.noi_dung.trim() || null,
  //       loai_van_ban: formData.loai_van_ban,
  //       file: uploadedFilePath,
  //       lanhDao: {
  //         id: Number(formData.lanh_dao_id),
  //       },
  //       trang_thai: status,
  //     });
  //   } catch (error) {
  //     console.error("Error creating command", error);
  //   }
  // };

  const commandFormConfig: FormSection[] = [
    {
      title: "Thông tin chung",
      hasResetBtn: false,
      fields: [
        { name: "ma_kho", label: "Mã kho vật chứng/ tài liệu đồ vật", type: "text", required: true },
        { name: "ten_kho", label: "Tên kho vật chứng/ tài liệu đồ vật ", type: "text", required: true },
        {
          name: "cap_kho", label: "Cấp khi", type: "select", required: true, options: [
            { label: 'Cấp cục', value: 'Cấp cục' },
            { label: 'Cấp tỉnh', value: 'Cấp tỉnh' },
            { label: 'Cấp thành phố', value: "Cấp thành phố" },
          ]
        },
        {
          name: "don_vi_quan_ly", label: "Đơn vị quản lý", type: "select", required: true, options: [
            { label: 'Cấp cục', value: 'Cấp cục' },
            { label: 'Cấp tỉnh', value: 'Cấp tỉnh' },
            { label: 'Cấp thành phố', value: "Cấp thành phố" },
          ]
        },
        {
          name: "tinh_thanh", label: "Tỉnh/ Thành phố ", type: "select", required: true, options: [
            { label: 'Cấp cục', value: 'Cấp cục' },
            { label: 'Cấp tỉnh', value: 'Cấp tỉnh' },
            { label: 'Cấp thành phố', value: "Cấp thành phố" },
          ]
        },
        {
          name: "phuong_xa", label: "Xã/ Phường", type: "select", required: true, options: [
            { label: 'Cấp cục', value: 'Cấp cục' },
            { label: 'Cấp tỉnh', value: 'Cấp tỉnh' },
            { label: 'Cấp thành phố', value: "Cấp thành phố" },
          ]
        },
        { name: "dia_chi", label: "Địa chỉ", type: "text", required: true },
        {
          name: "trang_thai", label: "Trạng thái hoạt động", type: "select", required: true, options: [
            { label: "Lệnh nhập kho", value: "Lệnh nhập kho" },
            { label: "Lệnh xuất kho", value: "Lệnh xuất kho" },
            { label: "Kế hoạch kiểm kê", value: "Kế hoạch kiểm kê" },
            { label: "Kế hoạch kiểm tra", value: "Kế hoạch kiểm tra" },
          ]
        },
        { name: "ghi_chu", label: "Ghi chú", type: "textarea", placeholder: "Nhập nội dung ghi chú" },

      ],
    },
    {
      title: "Thông tin nhân sự kho",
      fields: (formData.nhan_su || []).flatMap((item, index) => {
        return [
          { name: `nhan_su.${index}.username`, label: "Tên nhân sự", type: "text", required: true },
          {
            name: `nhan_su.${index}.role`,
            label: "Vai trò",
            type: "text",
            required: true,
            deleteBtn: {
              label: "Xóa",
              icon: trash_2_icon,
              onClick: () => setFormData(prev => ({
                ...prev,
                nhan_su: prev.nhan_su?.filter((_, i) => i !== index)
              }))
            }
          },
        ]
      }),
      actionBtn: {
        label: 'Thêm nhân sự',
        icon: person_icon,
        onClick: () => setFormData(prev => ({
          ...prev,
          nhan_su: [...(prev.nhan_su || []), { username: '', role: '' }]
        }))
      }
    },
    {
      title: "Thiết lập cấu trúc kho",
      fields: [
        {
          name: "storage_tree",
          label: "", // Không cần label phụ vì tên section đã bao hàm
          type: "tree",

          fullWidth: true
        }
      ],
      actionBtn: {
        label: 'Thêm mới thành phần',
        icon: add_icon,
        onClick: () => setIsModalOpen(true)
      }
    }
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-5 max-sm:flex-col max-sm:items-start max-sm:justify-center">
        <h1 className="text-left font-be_vietnam_pro text-[36px] font-bold leading-[44px] text-[#135C3B]">
          Thêm mới kho vật chứng/tài liệu, đồ vật
        </h1>
        <div className="flex gap-[10px]">
          <button
            type="button"
            className="flex h-auto items-center justify-center gap-2 rounded border border-[#D9D9D9] bg-white px-[15px] py-[5px]"
          >
            <img src={back_icon} alt="" />
            <span className="text-normal-14">Quay lại</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded border border-[#D9D9D9] bg-[#00854C] px-[15px] py-[5px] disabled:opacity-70"
          >
            <img src={save_icon} alt="" />
            <span className="text-white text-normal-14">{temp ? "Đang lưu..." : "Lưu"}</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded border border-[#D9D9D9] bg-[#00854C] px-[15px] py-[5px] disabled:opacity-70"
          >
            <img src={person_icon} alt="" />
            <span className="text-white text-normal-14">
              {temp ? "Đang lưu..." : "Lưu & trình duyệt"}
            </span>
          </button>
        </div>
      </div>

      <DynamicForm
        formData={formData}
        sections={commandFormConfig}
        onReset={handleResetForm}
        onChange={handleInputChange}
      />
      <AddStructureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        storageTree={formData.storage_tree || []}
        onAdd={handleAddNewNode}
      />
    </div>
  );
}
