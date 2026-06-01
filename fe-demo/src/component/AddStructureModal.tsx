import React, { useState, useEffect } from "react";
import { X, ShieldAlert } from "lucide-react";
import type { StorageNode } from "./StorageStructure";

interface AddStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageTree: StorageNode[];
  onAdd: (newNode: StorageNode, parentId: string | null) => void;
}

export function AddStructureModal({ isOpen, onClose, storageTree, onAdd }: AddStructureModalProps) {
  const [level, setLevel] = useState<'khu_vuc' | 'day' | 'ke' | 'tang' | 'o'>('khu_vuc');
  const [selectedKhuVucId, setSelectedKhuVucId] = useState("");
  const [selectedDayId, setSelectedDayId] = useState("");
  const [selectedKeId, setSelectedKeId] = useState("");
  const [selectedTangId, setSelectedTangId] = useState("");
  
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(true);
  const [error, setError] = useState("");

  // Reset states when modal is opened/closed or level changes
  useEffect(() => {
    setSelectedKhuVucId("");
    setSelectedDayId("");
    setSelectedKeId("");
    setSelectedTangId("");
    setCode("");
    setName("");
    setStatus(true);
    setError("");
  }, [isOpen, level]);

  if (!isOpen) return null;

  // Recursive search to find node by ID
  const findNodeById = (nodes: StorageNode[], id: string): StorageNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Dropdown options
  const khuVucOptions = storageTree.filter(n => n.level === 'khu_vuc');
  const dayOptions = selectedKhuVucId ? (findNodeById(storageTree, selectedKhuVucId)?.children || []) : [];
  const keOptions = selectedDayId ? (findNodeById(storageTree, selectedDayId)?.children || []) : [];
  const tangOptions = selectedKeId ? (findNodeById(storageTree, selectedKeId)?.children || []) : [];

  // Automatically construct Full Path Code
  const getPathCode = () => {
    const parts: string[] = [];
    if (level !== 'khu_vuc' && selectedKhuVucId) {
      const node = findNodeById(storageTree, selectedKhuVucId);
      if (node) parts.push(node.code);
    }
    if (level !== 'khu_vuc' && level !== 'day' && selectedDayId) {
      const node = findNodeById(storageTree, selectedDayId);
      if (node) parts.push(node.code);
    }
    if (level !== 'khu_vuc' && level !== 'day' && level !== 'ke' && selectedKeId) {
      const node = findNodeById(storageTree, selectedKeId);
      if (node) parts.push(node.code);
    }
    if (level === 'o' && selectedTangId) {
      const node = findNodeById(storageTree, selectedTangId);
      if (node) parts.push(node.code);
    }
    if (code) {
      parts.push(code.trim().toUpperCase());
    }
    return parts.join("-") || "Chưa thiết lập";
  };

  const handleSave = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!code.trim()) {
      setError("Vui lòng nhập Mã địa chỉ.");
      return;
    }
    if (!name.trim()) {
      setError("Vui lòng nhập Tên hiển thị.");
      return;
    }

    let parentId: string | null = null;

    if (level !== 'khu_vuc') {
      if (!selectedKhuVucId) {
        setError("Vui lòng chọn Khu vực cha.");
        return;
      }
      parentId = selectedKhuVucId;
    }

    if (level === 'ke' || level === 'tang' || level === 'o') {
      if (!selectedDayId) {
        setError("Vui lòng chọn Dãy cha.");
        return;
      }
      parentId = selectedDayId;
    }

    if (level === 'tang' || level === 'o') {
      if (!selectedKeId) {
        setError("Vui lòng chọn Kệ cha.");
        return;
      }
      parentId = selectedKeId;
    }

    if (level === 'o') {
      if (!selectedTangId) {
        setError("Vui lòng chọn Tầng cha.");
        return;
      }
      parentId = selectedTangId;
    }

    // Assemble new node
    const newNode: StorageNode = {
      id: Date.now().toString(),
      level,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      status: status,
      children: []
    };

    onAdd(newNode, parentId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] transition-opacity">
      <div className="w-full max-w-lg mx-4 rounded-xl bg-white p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900">Thêm mới thành phần kho</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-100 p-3 text-sm text-rose-700">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Level Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Cấp cấu trúc</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="h-9 w-full rounded border border-gray-200 bg-white px-3 text-sm focus:border-[#00854C] focus:ring-1 focus:ring-[#00854C] outline-none transition-all"
            >
              <option value="khu_vuc">Khu vực</option>
              <option value="day">Dãy</option>
              <option value="ke">Kệ</option>
              <option value="tang">Tầng</option>
              <option value="o">Ô</option>
            </select>
          </div>

          {/* Dependent Dropdowns */}
          {level !== 'khu_vuc' && (
            <div className="flex flex-col gap-3.5 bg-gray-50/50 p-3.5 rounded-lg border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block -mb-1">
                Lựa chọn thành phần cha
              </span>
              
              {/* Khu Vuc Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Khu vực cha</label>
                <select
                  value={selectedKhuVucId}
                  onChange={(e) => {
                    setSelectedKhuVucId(e.target.value);
                    setSelectedDayId("");
                    setSelectedKeId("");
                    setSelectedTangId("");
                  }}
                  className="h-9 w-full rounded border border-gray-200 bg-white px-3 text-sm focus:border-[#00854C] outline-none"
                >
                  <option value="">-- Chọn Khu vực cha --</option>
                  {khuVucOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name} ({opt.code})</option>
                  ))}
                </select>
              </div>

              {/* Day Dropdown (Shown for Ke, Tang, O) */}
              {(level === 'ke' || level === 'tang' || level === 'o') && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Dãy cha</label>
                  <select
                    value={selectedDayId}
                    disabled={!selectedKhuVucId}
                    onChange={(e) => {
                      setSelectedDayId(e.target.value);
                      setSelectedKeId("");
                      setSelectedTangId("");
                    }}
                    className="h-9 w-full rounded border border-gray-200 bg-white px-3 text-sm focus:border-[#00854C] outline-none disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">-- Chọn Dãy cha --</option>
                    {dayOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name} ({opt.code})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ke Dropdown (Shown for Tang, O) */}
              {(level === 'tang' || level === 'o') && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Kệ cha</label>
                  <select
                    value={selectedKeId}
                    disabled={!selectedDayId}
                    onChange={(e) => {
                      setSelectedKeId(e.target.value);
                      setSelectedTangId("");
                    }}
                    className="h-9 w-full rounded border border-gray-200 bg-white px-3 text-sm focus:border-[#00854C] outline-none disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">-- Chọn Kệ cha --</option>
                    {keOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name} ({opt.code})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tang Dropdown (Shown for O) */}
              {level === 'o' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Tầng cha</label>
                  <select
                    value={selectedTangId}
                    disabled={!selectedKeId}
                    onChange={(e) => setSelectedTangId(e.target.value)}
                    className="h-9 w-full rounded border border-gray-200 bg-white px-3 text-sm focus:border-[#00854C] outline-none disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">-- Chọn Tầng cha --</option>
                    {tangOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name} ({opt.code})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* New Component Info */}
          <div className="flex flex-col gap-3.5 border border-gray-100 p-3.5 rounded-lg bg-gray-50/20">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block -mb-1">
              Thông tin thành phần mới
            </span>

            {/* Input Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Mã thành phần <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ví dụ: KV3, D3, K3..."
                className="h-9 w-full rounded border border-gray-200 px-3 text-sm focus:border-[#00854C] focus:ring-1 focus:ring-[#00854C] outline-none transition-all"
              />
            </div>

            {/* Input Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Tên hiển thị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Khu vực C, Kệ K3..."
                className="h-9 w-full rounded border border-gray-200 px-3 text-sm focus:border-[#00854C] focus:ring-1 focus:ring-[#00854C] outline-none transition-all"
              />
            </div>

            {/* Read-only Path Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-gray-400">
                Mã địa chỉ đầy đủ (Path Code)
              </label>
              <div className="h-9 w-full rounded border border-dashed border-gray-200 bg-gray-50 flex items-center px-3 text-sm font-semibold text-[#00854C]">
                {getPathCode()}
              </div>
            </div>

            {/* Status toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-gray-700">Trạng thái hoạt động</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00854C]"></div>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="h-9 rounded bg-[#00854C] px-5 text-sm font-semibold text-white hover:bg-[#007040] transition-colors shadow-sm"
            >
              Thêm mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
