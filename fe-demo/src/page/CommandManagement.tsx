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

const initialCommandState: CommandResponse = {
  content: [],
  totalPages: 0,
  totalElements: 0,
  size: 10,
  number: 0,
  first: true,
  last: false,
  numberOfElements: 0,
};

const initialFilterValues: CommandFilterValues = {
  loai_van_ban: "",
  don_vi_gui: "",
  ngay_nhan: "",
};

const commandFilterFields: FilterField[] = [
  {
    name: "loai_van_ban",
    label: "Loại văn bản",
    type: "select",
    options: [
      { label: "Tất cả", value: "" },
      { label: "Lệnh nhập kho", value: "Lệnh nhập kho" },
      { label: "Lệnh xuất kho", value: "Lệnh xuất kho" },
      { label: "Kế hoạch kiểm kê", value: "Kế hoạch kiểm kê" },
      { label: "Kế hoạch kiểm tra", value: "Kế hoạch kiểm tra" },
    ],
  },
  {
    name: "don_vi_gui",
    label: "Đơn vị gửi",
    type: "text",
    placeholder: "Nhập đơn vị gửi",
  },
  {
    name: "ngay_nhan",
    label: "Ngày nhận",
    type: "date",
  },
];

const formatDate = (value: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN").format(date);
};

const TABS = [
  { id: "TIEP_NHAN", label: "Tiếp nhận lệnh", value: "tiep_nhan", actions: ["add", "delete", "setting"] as const },
  { id: "CHUA_PHE_DUYET", label: "Chờ phê duyệt", value: "chua_phe_duyet", actions: ["setting"] as const },
  { id: "DA_PHE_DUYET", label: "Đã phê duyệt", value: "da_phe_duyet", actions: ["setting"] as const },
  { id: "TU_CHOI", label: "Từ chối", value: "tu_choi", actions: ["setting"] as const },
];

export default function CommandManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterValues, setFilterValues] = useState<CommandFilterValues>(initialFilterValues);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentTabId, setCurrentTabId] = useState<string>("TIEP_NHAN");
  
  const currentTab = TABS.find((t) => t.id === currentTabId) || TABS[0];

  const searchSubjectRef = useRef(new Subject<string>());
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  const queryParams = {
    page: currentPage,
    size: pageSize,
    searchValue: debouncedSearch,
    filters: filterValues,
    trangThai: currentTab.value,
  };

  const {
    data: commands = initialCommandState,
    isLoading,
    isFetching,
  } = useQuery<CommandResponse>({
    queryKey: commandQueryKeys.list(queryParams),
    queryFn: () => getCommands(queryParams),
    enabled: isInitialized,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    const subscription = searchSubjectRef.current
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        setDebouncedSearch(value);
        setCurrentPage(0);
      });

    return () => subscription.unsubscribe();
  }, []);

  const pageIds = commands.content.map((item) => item.id);
  const allSelectedOnPage =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const someSelectedOnPage =
    pageIds.some((id) => selectedIds.includes(id)) && !allSelectedOnPage;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelectedOnPage;
    }
  }, [someSelectedOnPage]);

  useEffect(() => {
    setSelectedIds([]);
  }, [commands.content]);

  const refreshAfterDelete = async (deletedCount: number, idsToRemove: number[]) => {
    const newTotalElements = Math.max(0, commands.totalElements - deletedCount);
    const newTotalPages = Math.max(1, Math.ceil(newTotalElements / pageSize));
    const newPage = currentPage >= newTotalPages ? Math.max(0, currentPage - 1) : currentPage;

    idsToRemove.forEach((id) => {
      queryClient.removeQueries({ queryKey: commandQueryKeys.detail(id) });
    });

    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: commandQueryKeys.lists() });
  };

  const deleteOneMutation = useMutation({
    mutationFn: deleteCommand,
    onSuccess: async (_, id) => {
      await refreshAfterDelete(1, [id]);
    },
    onError: (err) => {
      console.error("Error deleting command", err);
      alert("Không thể xóa văn bản. Vui lòng kiểm tra quyền truy cập.");
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: deleteCommands,
    onSuccess: async (_, ids) => {
      await refreshAfterDelete(ids.length, ids);
    },
    onError: (err) => {
      console.error("Error deleting selected commands", err);
      alert("Không thể xóa các văn bản đã chọn. Vui lòng kiểm tra quyền truy cập.");
    },
  });

  const isDeleting = deleteOneMutation.isPending || deleteManyMutation.isPending;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    searchSubjectRef.current.next(value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < commands.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleApplyFilter = (values: CommandFilterValues) => {
    setFilterValues(values);
    setCurrentPage(0);
  };

  const handleDeleteCommand = async (id: number) => {
    if (isDeleting) {
      return;
    }

    await deleteOneMutation.mutateAsync(id);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0 || isDeleting) {
      return;
    }

    await deleteManyMutation.mutateAsync(selectedIds);
  };

  const handleToggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleToggleAllOnPage = () => {
    setSelectedIds((prev) => {
      if (allSelectedOnPage) {
        return prev.filter((id) => !pageIds.includes(id));
      }

      const merged = new Set([...prev, ...pageIds]);
      return Array.from(merged);
    });
  };

  const openCreateCommand = () => {
    navigate("/quan-ly-lenh/tiep-nhan-van-ban");
  };

  const openDetailCommand = (id: number) => {
    navigate(`/quan-ly-lenh/chi-tiet-van-ban/${id}`);
  };

  const commandColumns: Column<any>[] = [
    {
      key: "so_van_ban",
      label: "Số văn bản",
      render: (item: any) => (
        <span
          className="text-sm text-semibold align-middle underline text-[#0263D1] cursor-pointer"
          onClick={() => openDetailCommand(item.id)}
        >
          {item.so_van_ban}
        </span>
      ),
    },
    {
      key: "ngay_ban_hanh",
      label: "Ngày phát hành",
      render: (item: any) => formatDate(item.ngay_ban_hanh),
    },
    {
      key: "don_vi_gui",
      label: "Đơn vị gửi",
    },
    {
      key: "ngay_nhan",
      label: "Ngày nhận",
      render: (item: any) => formatDate(item.ngay_nhan),
    },
    {
      key: "noi_dung",
      label: "Nội dung",
      render: (item: any) => (
        <p className="max-w-[360px] truncate text-normal no-underline">
          {item.noi_dung || "-"}
        </p>
      ),
    },
    {
      key: "user",
      label: "Người tạo",
      render: (item: any) => item.user?.username || "-",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="py-5 text-left font-be_vietnam_pro text-[36px] font-bold leading-[44px] text-[#135C3B]">
          Quản lý lệnh
        </h1>
      </div>
      
      <div className="mb-4 flex gap-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setCurrentTabId(tab.id);
              setCurrentPage(0);
              setSelectedIds([]);
            }}
            className={`px-4 py-2 text-bold text-base leading-[24px] ${
              currentTabId === tab.id
                ? "border-b-4 border-[#1E5631E0] text-[#1E5631E0]"
                : "text-[#7A7A7A] hover:text-[#1E5631E0]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-[12px] bg-white shadow-sm">
        <ToolBar
          search={search}
          handleSearchChange={handleSearchChange}
          selectedIds={selectedIds}
          handleDeleteSelected={handleDeleteSelected}
          handleAddClick={openCreateCommand}
          filterValues={filterValues}
          handleApplyFilter={handleApplyFilter}
          actions={currentTab.actions as unknown as ("add" | "delete" | "setting")[]}
          filterFields={commandFilterFields}
          initialFilterValues={initialFilterValues}
        />

        <DataTable
          data={commands as any}
          columns={commandColumns}
          isLoading={isLoading}
          isFetching={isFetching}
          showCheckbox={currentTab.value === 'tiep_nhan'}
          selectedIds={selectedIds}
          selectAllRef={selectAllRef}
          allSelectedOnPage={allSelectedOnPage}
          handleToggleAllOnPage={handleToggleAllOnPage}
          handleToggleOne={handleToggleOne}
          onEdit={() => openCreateCommand()}
          onDelete={handleDeleteCommand}
          isDeleting={isDeleting}
          onPageChange={handlePageChange}
          actions={currentTab.actions as unknown as ("add" | "delete" | "setting")[]}
          emptyMessage={debouncedSearch ? `Không tìm thấy văn bản phù hợp với "${debouncedSearch}".` : "Chưa có văn bản nào."}
        />
      </div>
    </div>
  );
}
