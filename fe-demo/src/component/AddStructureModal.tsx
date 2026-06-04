import React, { useState, useEffect } from "react";
import { X, ShieldAlert } from "lucide-react";
import type { StorageNode } from "./StorageStructure";
import chevron_down_icon from '../assets/chevron_down.svg'

interface AddStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  storageTree: StorageNode[];
  onAdd: (newNode: StorageNode, parentId: string | null) => void;
}

export function AddStructureModal({ isOpen, onClose, storageTree, onAdd }: AddStructureModalProps) {
  const [level, setLevel] = useState<any>({id:'', name:''});
  const [selectedKhuVucId, setSelectedKhuVucId] = useState("");
  const [selectedDayId, setSelectedDayId] = useState("");
  const [selectedKeId, setSelectedKeId] = useState("");
  const [selectedTangId, setSelectedTangId] = useState("");
  
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [status, setStatus] = useState(true);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [openLevelDropdown, setOpenLevelDropdown] = useState(false);

  const levelOptions = [
    {id:'khu_vuc', name:'Khu vực'},
    {id:'day', name:'Dãy'},
    {id:'ke', name:'Kệ'},
    {id:'tang', name:'Tầng'},
    {id:'o', name:'Ô'},
  ];

  const orderOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

  // Reset states when modal is opened/closed or level changes
  useEffect(() => {
    setSelectedKhuVucId("");
    setSelectedDayId("");
    setSelectedKeId("");
    setSelectedTangId("");
    setCode("");
    setName("");
    setDisplayOrder("1");
    setStatus(true);
    setNote("");
    setError("");
  }, [isOpen, level]);

  if (!isOpen) return null;

  const chooseLevel = (selectedLevel: any) => {
    setLevel(selectedLevel);
    setOpenLevelDropdown(false);
  };

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
    if (level.id !== 'khu_vuc' && selectedKhuVucId) {
      const node = findNodeById(storageTree, selectedKhuVucId);
      if (node) parts.push(node.code);
    }
    if (level.id !== 'khu_vuc' && level.id !== 'day' && selectedDayId) {
      const node = findNodeById(storageTree, selectedDayId);
      if (node) parts.push(node.code);
    }
    if (level.id !== 'khu_vuc' && level.id !== 'day' && level.id !== 'ke' && selectedKeId) {
      const node = findNodeById(storageTree, selectedKeId);
      if (node) parts.push(node.code);
    }
    if (level.id === 'o' && selectedTangId) {
      const node = findNodeById(storageTree, selectedTangId);
      if (node) parts.push(node.code);
    }
    if (code) {
      parts.push(code.trim().toUpperCase());
    }
    return parts.join("-") || "Chưa thiết lập";
  };

  // Automatically construct Full Path Name for "Đường dẫn"
  const getPathName = () => {
    const parts: string[] = ["Kho vật chứng A"];
    if (level.id !== 'khu_vuc' && selectedKhuVucId) {
      const node = findNodeById(storageTree, selectedKhuVucId);
      if (node) parts.push(node.name);
    }
    if (level.id !== 'khu_vuc' && level.id !== 'day' && selectedDayId) {
      const node = findNodeById(storageTree, selectedDayId);
      if (node) parts.push(node.name);
    }
    if (level.id !== 'khu_vuc' && level.id !== 'day' && level.id !== 'ke' && selectedKeId) {
      const node = findNodeById(storageTree, selectedKeId);
      if (node) parts.push(node.name);
    }
    if (level.id === 'o' && selectedTangId) {
      const node = findNodeById(storageTree, selectedTangId);
      if (node) parts.push(node.name);
    }
    return parts.join(" / ");
  };

  const getLevelLabel = () => {
    switch (level.id) {
      case 'khu_vuc': return "khu vực";
      case 'day': return "dãy";
      case 'ke': return "kệ";
      case 'tang': return "tầng";
      case 'o': return "ô";
      default: return "thành phần";
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!level.id) {
      setError("Vui lòng chọn Cấp cấu trúc.");
      return;
    }
    if (!code.trim()) {
      setError(`Vui lòng nhập Mã ${getLevelLabel()}.`);
      return;
    }
    if (!name.trim()) {
      setError("Vui lòng nhập Tên hiển thị.");
      return;
    }

    let parentId: string | null = null;

    if (level.id !== 'khu_vuc') {
      if (!selectedKhuVucId) {
        setError("Vui lòng chọn Khu vực cha.");
        return;
      }
      parentId = selectedKhuVucId;
    }

    if (level.id === 'ke' || level.id === 'tang' || level.id === 'o') {
      if (!selectedDayId) {
        setError("Vui lòng chọn Dãy cha.");
        return;
      }
      parentId = selectedDayId;
    }

    if (level.id === 'tang' || level.id === 'o') {
      if (!selectedKeId) {
        setError("Vui lòng chọn Kệ cha.");
        return;
      }
      parentId = selectedKeId;
    }

    if (level.id === 'o') {
      if (!selectedTangId) {
        setError("Vui lòng chọn Tầng cha.");
        return;
      }
      parentId = selectedTangId;
    }

    // Assemble new node
    const newNode: StorageNode = {
      id: Date.now().toString(),
      level: level.id,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      status: status,
      orderIndex: Number(displayOrder),
      note: note.trim(),
      children: []
    };

    onAdd(newNode, parentId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] transition-opacity">
      <div className="w-full max-w-lg custom-shadow-structure-modal-add bg-white rounded-lg py-5 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">
        <div className="flex flex-col w-full gap-[20px]">  
          {/* Header */}
          <div className="flex items-center justify-between px-5">
            <span className="text-semibold-16 text-[#000000E0]">Chỉnh sửa thành phần cấu trúc</span>
            
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
            <div className="mx-5 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-100 p-3 text-sm text-rose-700">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="flex flex-col">
              
            <div className="px-[30px] flex flex-col gap-[15px]">
              {/* Section 1: Tổng quan cấu trúc */}
              <div className="flex flex-col w-full items-start gap-[10px] rounded py-[10px] px-[17px] border border-[#F0F0F0]">
                <label className="text-bold-14 text-[#000000E0]">Tổng quan cấu trúc</label>
                
                {/* Đường dẫn */}
                <div className="flex flex-col w-full">
                  <div className="w-full rounded border-[0.8px] border-[#D9D9D9] bg-[#0000000A] flex items-center py-[5px] px-[12px] gap-[10px]">
                    <div className="flex items-center py-[2px] px-[4px] text-left">
                      <span className="font-be_vietnam_pro font-normal leading-[19.5px] tracking-normal text-[#00000040]" style={{fontSize:'13px'}}>Đường dẫn: </span>
                      <span className="font-be_vietnam_pro font-normal leading-[19.5px] tracking-normal text-[#1677ff] ml-1" style={{fontSize:'13px'}}>{getPathName()}</span>
                    </div>
                  </div>
                </div>

                {/* Level + Parent Select Layout in Section 1 */}
                <div className="flex flex-col w-full gap-3 mt-1">
                  {/* Row 1: Cấp cấu trúc (50%) & Khu vực cha (50%) */}
                  <div className="grid grid-cols-2 gap-4 w-full items-end">
                    <div className="flex flex-col gap-1.5 w-full items-start">
                      <span className="text-medium-14 text-[#000000E0]">Cấp cấu trúc <span className="text-red-500">*</span></span>
                      <div className="relative w-full">
                        <div 
                          onClick={() => setOpenLevelDropdown(!openLevelDropdown)} 
                          className="rounded border-[0.8px] border-[#00000033] bg-white py-[6px] px-[12px] flex justify-between items-center w-full cursor-pointer min-h-[36px]"
                        >
                          <span className={`font-be_vietnam_pro font-normal leading-[100%] tracking-normal ${level.id ? 'text-black' : 'text-[#00000033]'} py-[2px]`} style={{fontSize:'14px'}} >
                            {level.name || "Chọn cấp cấu trúc..."}
                          </span>
                          <img src={chevron_down_icon} alt="" />
                        </div>
                        <div className={`flex flex-col w-full absolute left-0 top-[40px] gap-[7px] items-start bg-white rounded-lg border border-[#E0E0E0] px-[14px] py-3 z-50 ${openLevelDropdown ? "" : "hidden"}`} style={{boxShadow: "0px 4px 4px 0px #00000040"}}>
                          {levelOptions.map((item, key) => (
                            <span 
                              onClick={() => chooseLevel(item as any)} 
                              key={key} 
                              className="text-roboto-16 text-[#364153] cursor-pointer w-full text-left hover:bg-black/10 py-1 px-2 rounded"
                            >
                              {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {level.id !== 'khu_vuc' && level.id !== '' ? (
                      <div className="flex flex-col gap-1.5 w-full items-start">
                        <span className="text-medium-14 text-[#000000E0]">Khu vực cha <span className="text-red-500">*</span></span>
                        <select
                          value={selectedKhuVucId}
                          onChange={(e) => {
                            setSelectedKhuVucId(e.target.value);
                            setSelectedDayId("");
                            setSelectedKeId("");
                            setSelectedTangId("");
                          }}
                          className="h-9 w-full rounded border-[0.8px] border-[#00000033] bg-white px-3 text-sm focus:border-[#00854C] outline-none"
                        >
                          <option value="">Chọn Khu vực...</option>
                          {khuVucOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                        </select>
                      </div>
                    ) : <div />}
                  </div>

                  {/* Row 2: Parent selects depending on level */}
                  {level.id === 'ke' && (
                    <div className="flex flex-col gap-1.5 w-full items-start">
                      <span className="text-medium-14 text-[#000000E0]">Dãy cha <span className="text-red-500">*</span></span>
                      <select
                        value={selectedDayId}
                        disabled={!selectedKhuVucId}
                        onChange={(e) => {
                          setSelectedDayId(e.target.value);
                          setSelectedKeId("");
                          setSelectedTangId("");
                        }}
                        className="h-9 w-full rounded border-[0.8px] border-[#00000033] bg-white px-3 text-sm focus:border-[#00854C] outline-none disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">Chọn Dãy cha...</option>
                        {dayOptions.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {level.id === 'tang' && (
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="flex flex-col gap-1.5 w-full items-start">
                        <span className="text-medium-14 text-[#000000E0]">Dãy cha <span className="text-red-500">*</span></span>
                        <select
                          value={selectedDayId}
                          disabled={!selectedKhuVucId}
                          onChange={(e) => {
                            setSelectedDayId(e.target.value);
                            setSelectedKeId("");
                            setSelectedTangId("");
                          }}
                          className="h-9 w-full rounded border-[0.8px] border-[#00000033] bg-white px-3 text-sm focus:border-[#00854C] outline-none disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="">Chọn Dãy cha...</option>
                          {dayOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5 w-full items-start">
                        <span className="text-medium-14 text-[#000000E0]">Kệ cha <span className="text-red-500">*</span></span>
                        <select
                          value={selectedKeId}
                          disabled={!selectedDayId}
                          onChange={(e) => {
                            setSelectedKeId(e.target.value);
                            setSelectedTangId("");
                          }}
                          className="h-9 w-full rounded border-[0.8px] border-[#00000033] bg-white px-3 text-sm focus:border-[#00854C] outline-none disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="">Chọn Kệ cha...</option>
                          {keOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {level.id === 'o' && (
                    <div className="grid grid-cols-3 gap-4 w-full">
                      <div className="flex flex-col gap-1.5 w-full items-start">
                        <span className="text-medium-14 text-[#000000E0]">Dãy cha <span className="text-red-500">*</span></span>
                        <select
                          value={selectedDayId}
                          disabled={!selectedKhuVucId}
                          onChange={(e) => {
                            setSelectedDayId(e.target.value);
                            setSelectedKeId("");
                            setSelectedTangId("");
                          }}
                          className="h-9 w-full rounded border-[0.8px] border-[#00000033] bg-white px-3 text-sm focus:border-[#00854C] outline-none disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="">Chọn Dãy...</option>
                          {dayOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5 w-full items-start">
                        <span className="text-medium-14 text-[#000000E0]">Kệ cha <span className="text-red-500">*</span></span>
                        <select
                          value={selectedKeId}
                          disabled={!selectedDayId}
                          onChange={(e) => {
                            setSelectedKeId(e.target.value);
                            setSelectedTangId("");
                          }}
                          className="h-9 w-full rounded border-[0.8px] border-[#00000033] bg-white px-3 text-sm focus:border-[#00854C] outline-none disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="">Chọn Kệ...</option>
                          {keOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5 w-full items-start">
                        <span className="text-medium-14 text-[#000000E0]">Tầng cha <span className="text-red-500">*</span></span>
                        <select
                          value={selectedTangId}
                          disabled={!selectedKeId}
                          onChange={(e) => setSelectedTangId(e.target.value)}
                          className="h-9 w-full rounded border-[0.8px] border-[#00000033] bg-white px-3 text-sm focus:border-[#00854C] outline-none disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="">Chọn Tầng...</option>
                          {tangOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Thông tin thành phần (level) */}
              <div className="flex flex-col items-start gap-3 w-full border border-gray-100 p-3.5 rounded-lg bg-gray-50/20">
                <span className="text-bold-14 text-[#000000E0] capitalize">
                  Thông tin {getLevelLabel()}
                </span>
                {level.id === '' && level.name === ''?<span>Vui lòng chọn cấu trúc để tiếp tục</span>:
                <>
                {/* Row 1: Mã [level] & Tên hiển thị */}
                <div className="grid grid-cols-2 w-full gap-4">
                  <div className="flex flex-col items-start gap-1.5">
                    <label className="text-medium-14 text-[#000000E0] capitalize">
                      Mã {getLevelLabel()} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Ví dụ: KV3, D3, K3..."
                      className="w-full rounded border-[0.8px] py-[6px] border-[#D9D9D9] px-3 text-normal-14 text-black outline-none focus:border-[#00854C]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 items-start">
                    <label className="text-medium-14 text-[#000000E0]">
                      Tên hiển thị <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Khu vực C, Kệ K3..."
                      className="w-full rounded border-[0.8px] py-[6px] border-[#D9D9D9] px-3 text-normal-14 text-black outline-none focus:border-[#00854C]"
                    />
                  </div>
                </div>

                {/* Row 2: Thứ tự hiển thị & (Trạng thái hoạt động OR Mã địa chỉ đầy đủ) */}
                <div className="grid grid-cols-2 w-full gap-4">
                  <div className="flex flex-col items-start gap-1.5">
                    <label className="text-medium-14 text-[#000000E0]">
                      Thứ tự hiển thị <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(e.target.value)}
                      className="w-full rounded border-[0.8px] py-[6px] border-[#D9D9D9] px-3 text-normal-14 text-black bg-white outline-none focus:border-[#00854C]"
                    >
                      {orderOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {level.id === 'khu_vuc' ? (
                    <div className="flex flex-col items-start gap-1.5">
                      <label className="text-medium-14 text-[#000000E0]">
                        Trạng thái hoạt động <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={status ? "true" : "false"}
                        onChange={(e) => setStatus(e.target.value === "true")}
                        className="w-full rounded border-[0.8px] py-[6px] border-[#D9D9D9] px-3 text-normal-14 text-black bg-white outline-none focus:border-[#00854C]"
                      >
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Tạm ngừng</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-1.5">
                      <label className="text-medium-14 text-[#000000E0]">
                        Mã địa chỉ đầy đủ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={getPathCode()}
                        className="w-full rounded border-[0.8px] py-[6px] border-[#D9D9D9] px-3 text-normal-14 text-[#1677ff] bg-[#F5F5F5] cursor-not-allowed outline-none font-semibold"
                      />
                    </div>
                  )}
                </div>

                {/* Row 3: Mã địa chỉ đầy đủ for level.id === 'khu_vuc' */}
                {level.id === 'khu_vuc' && (
                  <div className="flex flex-col items-start gap-1.5 w-full">
                    <label className="text-medium-14 text-[#000000E0]">
                      Mã địa chỉ đầy đủ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={getPathCode()}
                      className="w-full rounded border-[0.8px] py-[6px] border-[#D9D9D9] px-3 text-normal-14 text-[#1677ff] bg-[#F5F5F5] cursor-not-allowed outline-none font-semibold"
                    />
                  </div>
                )}

                {/* Row 4: Ghi chú */}
                <div className="flex flex-col items-start gap-1.5 w-full">
                  <label className="text-medium-14 text-[#000000E0]">
                    Ghi chú
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, 300))}
                    placeholder="Ghi chú các thông tin đặc biệt, cảnh báo vận hành..."
                    className="w-full h-20 rounded border-[0.8px] py-[6px] border-[#D9D9D9] px-3 bg-white text-normal-14 text-black outline-none focus:border-[#00854C] resize-none"
                    maxLength={300}
                  />
                  <div className="w-full text-right text-xs text-gray-400 mt-1">
                    {note.length} / 300
                  </div>
                </div>
                </>
                }
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-4 px-[30px]">
              <button
                type="button"
                onClick={onClose}
                className="h-9 rounded border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="h-9 rounded bg-[#00854C] px-5 text-sm font-semibold text-white hover:bg-[#007040] transition-colors shadow-sm"
              >
                Áp dụng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
