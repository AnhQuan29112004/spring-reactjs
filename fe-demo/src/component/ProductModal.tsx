import React, { useState, useEffect } from "react";
import type { Product } from "../types/ProductType.types";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadImage } from "../service/uploadService";
import { getFileUrl } from "../util/fileUrl";

interface ProductFormModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  product: Product | null;
  onClose: () => void;
  onSave: (productData: Omit<Product, "id">) => Promise<void>;
}

export default function ProductFormModal({
  isOpen,
  mode,
  product,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Sync state when product increases/decreases/opens/changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && product) {
        setName(product.name);
        setPrice(product.price.toString());
        setQuantity(product.quantity.toString());
        setImage(product.image);
      } else {
        setName("");
        setPrice("");
        setQuantity("");
        setImage("");
      }
    }
  }, [isOpen, mode, product]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    setIsSubmitting(true);
    try {
      const data = {
        name: name.trim(),
        price: Number(price),
        quantity: Number(quantity) || 0,
        image: image.trim() || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150",
      };
      await onSave(data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploaded = await uploadImage(file);
      setImage(uploaded.path);
    } catch (err) {
      console.error("Error uploading image", err);
      alert("Upload ảnh thất bại. Vui lòng chọn file ảnh hợp lệ.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md p-6 bg-white border border-gray-100 shadow-xl rounded-xl"
          >
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-100 select-none">
              <h3 className="text-base font-bold text-gray-900">
                {mode === "add" ? "Thêm Sản Phẩm Mới" : "Cập Nhật Thông Tin Sản Phẩm"}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-gray-400 cursor-pointer hover:text-gray-600 focus:outline-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-500">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="vd: Đồng Hồ Thông Minh Pro"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#00288e] text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-500">Số lượng tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="20"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#00288e] text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-500">Đơn giá bán (VND) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="vd: 1200000"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#00288e] text-gray-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-500">Ảnh sản phẩm</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-16 h-16 overflow-hidden border border-gray-200 rounded-lg bg-slate-50">
                    {image ? (
                      <img
                        src={getFileUrl(image)}
                        alt={name || "Ảnh sản phẩm"}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ImagePlus className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg cursor-pointer text-slate-700 hover:bg-slate-50">
                      {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                      <span>{isUploadingImage ? "Đang upload..." : "Upload ảnh"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingImage}
                        onChange={(e) => handleImageUpload(e.target.files?.[0])}
                      />
                    </label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="/uploads/images/..."
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#00288e] text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2 text-xs font-semibold border border-gray-200 rounded-lg cursor-pointer text-slate-600 hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2 bg-[#00288e] hover:bg-blue-800 disabled:bg-blue-300 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  {isSubmitting ? "Đang lưu..." : mode === "add" ? "Thêm mới" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
