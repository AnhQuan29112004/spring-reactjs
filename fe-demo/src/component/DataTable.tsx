import React from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
}

export interface PaginatedData<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface DataTableProps<T> {
  data: PaginatedData<T>;
  columns: Column<T>[];
  showCheckbox?: boolean;
  selectedIds?: number[];
  selectAllRef?: React.RefObject<HTMLInputElement>;
  allSelectedOnPage?: boolean;
  handleToggleAllOnPage?: () => void;
  handleToggleOne?: (id: number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  emptyMessage?: string;
  actions?: ("add" | "delete" | "setting")[];
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => Promise<void>;
  isDeleting?: boolean;
  onPageChange: (page: number) => void;
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
  showCheckbox = false,
  selectedIds = [],
  selectAllRef,
  allSelectedOnPage = false,
  handleToggleAllOnPage,
  handleToggleOne,
  isLoading = false,
  isFetching = false,
  emptyMessage = "Không có dữ liệu",
  actions = [],
  onEdit,
  onDelete,
  isDeleting = false,
  onPageChange,
}: DataTableProps<T>) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = data.totalPages;
    const current = data.number;

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

  const visibleColumns = columns.filter((col) => !col.hidden);

  return (
    <div className="overflow-hidden rounded-[10px]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#F6F8F6] text-[#303030]">
            <tr>
              {showCheckbox && (
                <th className="w-12 px-3 py-4">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelectedOnPage}
                    onChange={handleToggleAllOnPage}
                    className="h-4 w-4 appearance-none rounded-[2px] border border-[#C9D3C9] bg-white checked:border-[#0C9254] checked:bg-[#0C9254] accent-[#0C9254]"
                  />
                </th>
              )}
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-4 font-semibold ${
                    col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && <th className="px-3 py-4 font-semibold text-right">Thao tác</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDF1ED] bg-white text-[#303030]">
            {isLoading ? (
              <tr>
                <td colSpan={visibleColumns.length + (showCheckbox ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-4 py-12 text-center text-sm text-[#7A7A7A]">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : data.content.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (showCheckbox ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-4 py-12 text-center text-sm text-[#7A7A7A]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.content.map((item) => (
                <tr key={item.id}>
                  {showCheckbox && (
                    <td className="px-3 py-4 align-middle">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleToggleOne && handleToggleOne(item.id)}
                        className="h-4 w-4 appearance-none border border-[#C9D3C9] accent-[#0C9254] checked:border-[#0C9254] checked:bg-[#0C9254]"
                      />
                    </td>
                  )}
                  {visibleColumns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-4 align-middle ${
                        col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {col.render ? col.render(item) : (item as any)[col.key] || "-"}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-3 py-4 text-right align-middle">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="rounded-[8px] border border-[#D9E0D8] px-3 py-2 text-sm font-semibold text-[#1F1F1F]"
                          >
                            Sửa
                          </button>
                        )}
                        {actions.includes("delete") && onDelete && (
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={async () => {
                              if (confirm(`Bạn chắc chắn muốn xóa bản ghi này?`)) {
                                await onDelete(item.id);
                              }
                            }}
                            className="rounded-[8px] bg-[#D94C45] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            {isDeleting ? "Đang xóa..." : "Xóa"}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#E8ECE8] px-4 py-4 text-sm text-[#5A5A5A] lg:flex-row lg:items-center lg:justify-end">
        <div>{isFetching && !isLoading ? "Đang đồng bộ..." : `Tổng số ${data.totalElements} bản ghi`}</div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onPageChange(data.number - 1)}
            disabled={data.first}
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
                  onClick={() => onPageChange(page)}
                  className={`h-9 min-w-9 rounded-[8px] px-3 font-semibold ${
                    page === data.number
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
            onClick={() => onPageChange(data.number + 1)}
            disabled={data.last}
            className="rounded-[8px] border border-[#D9E0D8] px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {">"}
          </button>
          <div className="rounded-[8px] border border-[#D9E0D8] px-3 py-2">10 / trang</div>
        </div>
      </div>
    </div>
  );
}
