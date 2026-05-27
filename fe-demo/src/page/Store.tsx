import { useCallback, useEffect, useRef, useState } from "react";
import axiosClient from "../api/axios";
import ProductFormModal from "../component/ProductModal";
import type { Product } from "../types/ProductType.types";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
import { baseUrl } from "../util/util";
import ToolBar from "../component/ToolBar";

interface StoreResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

const initialStoreState: StoreResponse = {
  content: [],
  totalPages: 0,
  totalElements: 0,
  size: 10,
  number: 0,
  first: true,
  last: false,
  numberOfElements: 0,
};

export default function StorePage() {
  const [stores, setStores] = useState<StoreResponse>(initialStoreState);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const searchSubjectRef = useRef(new Subject<string>());
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  // const baseUrl = baseUrl;

  const fetchStores = useCallback(
    async (page: number, size: number, searchName: string) => {
      setIsLoading(true);
      try {
        const params: { page: number; size: number; sort: string; name?: string } = {
          page,
          size,
          sort: "id",
        };

        if (searchName.trim()) {
          params.name = searchName.trim();
        }

        const res = await axiosClient.get("/api/stores", { params });
        setStores(res.data);
        setCurrentPage(res.data.number);
        setSelectedIds([]);
      } catch (err) {
        console.error("Error fetching stores", err);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isInitialized) {
      fetchStores(0, pageSize, "");
      setIsInitialized(true);
    }
  }, [fetchStores, isInitialized, pageSize]);

  useEffect(() => {
    const subscription = searchSubjectRef.current
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        setDebouncedSearch(value);
        fetchStores(0, pageSize, value);
      });

    return () => subscription.unsubscribe();
  }, [fetchStores, pageSize]);

  const pageIds = stores.content.map((item) => item.id);
  const allSelectedOnPage =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const someSelectedOnPage =
    pageIds.some((id) => selectedIds.includes(id)) && !allSelectedOnPage;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelectedOnPage;
    }
  }, [someSelectedOnPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    searchSubjectRef.current.next(value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < stores.totalPages) {
      fetchStores(newPage, pageSize, debouncedSearch);
    }
  };

  const handleAddProduct = async (data: Omit<Product, "id">) => {
    try {
      await axiosClient.post("/api/stores", {
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        image: data.image,
      });
      await fetchStores(currentPage, pageSize, debouncedSearch);
    } catch (err) {
      console.error("Error adding product", err);
    }
  };

  const handleUpdateProduct = async (id: string, data: Omit<Product, "id">) => {
    try {
      await axiosClient.put(`/api/stores/${id}`, {
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        image: data.image,
      });
      await fetchStores(currentPage, pageSize, debouncedSearch);
    } catch (err) {
      console.error("Error updating product", err);
    }
  };

  const refreshAfterDelete = async (deletedCount: number) => {
    const newTotalElements = Math.max(0, stores.totalElements - deletedCount);
    const newTotalPages = Math.max(1, Math.ceil(newTotalElements / pageSize));
    const newPage = currentPage >= newTotalPages ? Math.max(0, currentPage - 1) : currentPage;
    await fetchStores(newPage, pageSize, debouncedSearch);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await axiosClient.delete(`/api/stores/${id}`);
      await refreshAfterDelete(1);
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      await axiosClient.delete("/api/stores", {
        data: selectedIds.map((id) => Number(id)),
      });
      await refreshAfterDelete(selectedIds.length);
    } catch (err) {
      console.error("Error deleting selected products", err);
    }
  };

  const handleToggleOne = (id: string) => {
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

  const openAddModal = () => {
    setModalMode("add");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (data: Omit<Product, "id">) => {
    if (modalMode === "add") {
      await handleAddProduct(data);
    } else if (selectedProduct) {
      await handleUpdateProduct(selectedProduct.id, data);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = stores.totalPages;
    const current = stores.number;

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
      <div className="flex flex-col gap-4 rounded-[12px] bg-white p-4 shadow-sm">
        <ToolBar
          search={search}
          handleSearchChange={handleSearchChange}
          selectedIds={selectedIds}
          handleDeleteSelected={handleDeleteSelected}
          handleAddClick={openAddModal}
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
                  <th className="px-3 py-4 font-semibold">Ảnh</th>
                  <th className="px-3 py-4 font-semibold">Tên sản phẩm</th>
                  <th className="px-3 py-4 font-semibold text-right">Đơn giá</th>
                  <th className="px-3 py-4 font-semibold text-center">Tồn kho</th>
                  <th className="px-3 py-4 font-semibold text-center">Trạng thái</th>
                  <th className="px-3 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1ED] bg-white text-[#303030]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-[#7A7A7A]">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : stores.content.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-[#7A7A7A]">
                      {debouncedSearch
                        ? `Không tìm thấy sản phẩm phù hợp với "${debouncedSearch}".`
                        : "Chưa có sản phẩm nào."}
                    </td>
                  </tr>
                ) : (
                  stores.content.map((product) => {
                    const isActive = product.quantity > 0;

                    return (
                      <tr key={product.id}>
                        <td className="px-3 py-4 align-middle">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(product.id)}
                            onChange={() => handleToggleOne(product.id)}
                            className="h-4 w-4 accent-[#0C9254] appearance-none border border-[#C9D3C9] checked:border-[#0C9254] checked:bg-[#0C9254]"
                          />
                        </td>
                        <td className="px-3 py-4 align-middle">
                          <div className="h-12 w-12 overflow-hidden rounded-[8px] border border-[#E2E8E2] bg-[#F6F8F6]">
                            {product.image ? (
                              <img
                                src={`${baseUrl}`+product.image}
                                alt={product.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-[#7A7A7A]">
                                N/A
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-4 align-middle">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="font-semibold text-[#1D6FE8] underline"
                          >
                            {product.name}
                          </button>
                        </td>
                        <td className="px-3 py-4 font-semibold text-right align-middle">
                          {new Intl.NumberFormat("vi-VN").format(product.price)} đ
                        </td>
                        <td className="px-3 py-4 font-semibold text-center align-middle">
                          {product.quantity}
                        </td>
                        <td className="px-3 py-4 text-center align-middle">
                          <span
                            className={`inline-flex items-center gap-2 font-semibold ${
                              isActive ? "text-[#1A8F5B]" : "text-[#E03B3B]"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                isActive ? "bg-[#1A8F5B]" : "bg-[#E03B3B]"
                              }`}
                            />
                            {isActive ? "Hoạt động" : "Dừng hoạt động"}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-right align-middle">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(product)}
                              className="rounded-[8px] border border-[#D9E0D8] px-3 py-2 text-sm font-semibold text-[#1F1F1F]"
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                  if (confirm(`Bạn chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
                                    await handleDeleteProduct(product.id);
                                  }
                                }}
                              className="rounded-[8px] bg-[#D94C45] px-3 py-2 text-sm font-semibold text-white"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#E8ECE8] px-4 py-4 text-sm text-[#5A5A5A] lg:flex-row lg:items-center lg:justify-end">
            <div>Tổng số {stores.totalElements} sản phẩm</div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handlePageChange(stores.number - 1)}
                disabled={stores.first}
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
                        page === stores.number
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
                onClick={() => handlePageChange(stores.number + 1)}
                disabled={stores.last}
                className="rounded-[8px] border border-[#D9E0D8] px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {">"}
              </button>
              <div className="rounded-[8px] border border-[#D9E0D8] px-3 py-2">10 / trang</div>
            </div>
          </div>
        </div>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
