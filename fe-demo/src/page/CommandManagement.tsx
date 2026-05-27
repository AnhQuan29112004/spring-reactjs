import { useEffect, useRef, useState } from "react";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
import ToolBar from "../component/ToolBar";
import { useNavigate } from "react-router-dom";
import type { CommandFilterValues } from "../interfaces/Command";
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
  const searchSubjectRef = useRef(new Subject<string>());
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  const queryParams = {
    page: currentPage,
    size: pageSize,
    searchValue: debouncedSearch,
    filters: filterValues,
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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = commands.totalPages;
    const current = commands.number;

    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i += 1) {
        pages.push(i);
      }
      return pages;
    }

    if (current <= 2) {
      for (let i = 0; i < 3; i += 1) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages - 1);
      return pages;
    }

    if (current >= totalPages - 3) {
      pages.push(0);
      pages.push("...");
      for (let i = totalPages - 3; i < totalPages; i += 1) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(0);
    pages.push("...");
    pages.push(current);
    pages.push("...");
    pages.push(totalPages - 1);
    return pages;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="py-5 text-left font-be_vietnam_pro text-[36px] font-bold leading-[44px] text-[#135C3B]">
          Quản lý lệnh
        </h1>
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
        />

        <div className="overflow-hidden rounded-[10px]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#F6F8F6] text-[#303030]">
                <tr>
                  <th className="w-12 px-3 py-4">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={allSelectedOnPage}
                      onChange={handleToggleAllOnPage}
                      className="h-4 w-4 appearance-none rounded-[2px] border border-[#C9D3C9] bg-white checked:border-[#0C9254] checked:bg-[#0C9254] accent-[#0C9254]"
                    />
                  </th>
                  <th className="px-3 py-4 font-semibold">Số văn bản</th>
                  <th className="px-3 py-4 font-semibold">Ngày phát hành</th>
                  <th className="px-3 py-4 font-semibold">Đơn vị gửi</th>
                  <th className="px-3 py-4 font-semibold">Ngày nhận</th>
                  <th className="px-3 py-4 font-semibold">Nội dung</th>
                  <th className="px-3 py-4 font-semibold">Người tạo</th>
                  <th className="px-3 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1ED] bg-white text-[#303030]">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-[#7A7A7A]">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : commands.content.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-[#7A7A7A]">
                      {debouncedSearch
                        ? `Không tìm thấy văn bản phù hợp với "${debouncedSearch}".`
                        : "Chưa có văn bản nào."}
                    </td>
                  </tr>
                ) : (
                  commands.content.map((command) => (
                    <tr key={command.id}>
                      <td className="px-3 py-4 align-middle">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(command.id)}
                          onChange={() => handleToggleOne(command.id)}
                          className="h-4 w-4 appearance-none border border-[#C9D3C9] accent-[#0C9254] checked:border-[#0C9254] checked:bg-[#0C9254]"
                        />
                      </td>
                      <td
                        className="px-3 py-4 text-sm text-semibold align-middle underline text-[#0263D1] cursor-pointer"
                        onClick={() => openDetailCommand(command.id)}
                      >
                        {command.so_van_ban}
                      </td>
                      <td className="px-3 py-4 no-underline align-middle text-semibold">
                        {formatDate(command.ngay_ban_hanh)}
                      </td>
                      <td className="px-3 py-4 no-underline align-middle text-semibold">
                        {command.don_vi_gui || "-"}
                      </td>
                      <td className="px-3 py-4 no-underline align-middle text-semibold">
                        {formatDate(command.ngay_nhan)}
                      </td>
                      <td className="max-w-[360px] px-3 py-4 align-middle">
                        <p className="max-w-[360px] truncate text-normal no-underline">
                          {command.noi_dung || "-"}
                        </p>
                      </td>
                      <td className="px-3 py-4 no-underline align-middle text-semibold">
                        {command.user?.username || "-"}
                      </td>
                      <td className="px-3 py-4 text-right align-middle">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={openCreateCommand}
                            className="rounded-[8px] border border-[#D9E0D8] px-3 py-2 text-sm font-semibold text-[#1F1F1F]"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={async () => {
                              if (confirm(`Bạn chắc chắn muốn xóa văn bản "${command.so_van_ban}"?`)) {
                                await handleDeleteCommand(command.id);
                              }
                            }}
                            className="rounded-[8px] bg-[#D94C45] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            {isDeleting ? "Đang xóa..." : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#E8ECE8] px-4 py-4 text-sm text-[#5A5A5A] lg:flex-row lg:items-center lg:justify-end">
            <div>{isFetching && !isLoading ? "Đang đồng bộ..." : `Tổng số ${commands.totalElements} văn bản`}</div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handlePageChange(commands.number - 1)}
                disabled={commands.first}
                className="rounded-[8px] border border-[#D9E0D8] px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {"<"}
              </button>
              <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) =>
                  typeof page === "number" ? (
                    <button
                      key={`${page}-${index}`}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`h-9 min-w-9 rounded-[8px] px-3 font-semibold ${
                        page === commands.number
                          ? "bg-[#135C3B] text-white"
                          : "border border-[#D9E0D8] text-[#303030]"
                      }`}
                    >
                      {page + 1}
                    </button>
                  ) : (
                    <span key={`${page}-${index}`} className="px-2">
                      {page}
                    </span>
                  ),
                )}
              </div>
              <button
                type="button"
                onClick={() => handlePageChange(commands.number + 1)}
                disabled={commands.last}
                className="rounded-[8px] border border-[#D9E0D8] px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {">"}
              </button>
              <div className="rounded-[8px] border border-[#D9E0D8] px-3 py-2">10 / trang</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
