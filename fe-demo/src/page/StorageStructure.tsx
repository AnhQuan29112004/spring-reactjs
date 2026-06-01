import { useState, useMemo } from "react";
import { 
  Warehouse, 
  Columns2, 
  LayoutGrid, 
  Layers, 
  Box, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  X,
  FileText,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface StorageNode {
  id: string;
  level: "khu_vuc" | "day" | "ke" | "tang" | "o";
  code: string;
  name: string;
  status: boolean;
  orderIndex?: number;
  note?: string;
  children?: StorageNode[];
}

const initialStorageTree: StorageNode[] = [
  {
    id: "kv-1",
    level: "khu_vuc",
    code: "KV1",
    name: "Khu vực A - Phòng Ma Túy",
    status: true,
    orderIndex: 1,
    note: "Khu vực lưu trữ các tang vật chuyên biệt chuyên án ma túy",
    children: [
      {
        id: "day-1-1",
        level: "day",
        code: "D1",
        name: "Dãy A1",
        status: true,
        orderIndex: 1,
        note: "Dãy sát tường phía Tây",
        children: [
          {
            id: "ke-1-1-1",
            level: "ke",
            code: "K1",
            name: "Kệ A1-1",
            status: true,
            orderIndex: 1,
            note: "Kệ chịu lực cao",
            children: [
              {
                id: "tang-1-1-1-1",
                level: "tang",
                code: "T1",
                name: "Tầng 1",
                status: true,
                orderIndex: 1,
                note: "Tầng trệt của kệ",
                children: [
                  {
                    id: "o-1-1-1-1-1",
                    level: "o",
                    code: "O1",
                    name: "Ô A1-1-1-1",
                    status: true,
                    orderIndex: 1,
                    note: "Ô góc trái chứa vật chứng kích thước nhỏ",
                  },
                  {
                    id: "o-1-1-1-1-2",
                    level: "o",
                    code: "O2",
                    name: "Ô A1-1-1-2",
                    status: false,
                    orderIndex: 2,
                    note: "Ô góc phải",
                  }
                ]
              },
              {
                id: "tang-1-1-1-2",
                level: "tang",
                code: "T2",
                name: "Tầng 2",
                status: true,
                orderIndex: 2,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: "day-1-2",
        level: "day",
        code: "D2",
        name: "Dãy A2",
        status: true,
        orderIndex: 2,
        children: []
      }
    ]
  },
  {
    id: "kv-2",
    level: "khu_vuc",
    code: "KV2",
    name: "Khu vực B - Tang vật thông thường",
    status: true,
    orderIndex: 2,
    note: "Khu vực lưu trữ các vật chứng khác",
    children: [
      {
        id: "day-2-1",
        level: "day",
        code: "D1",
        name: "Dãy B1",
        status: true,
        orderIndex: 1,
        children: [
          {
            id: "ke-2-1-1",
            level: "ke",
            code: "K1",
            name: "Kệ B1-1",
            status: true,
            orderIndex: 1,
            children: []
          }
        ]
      }
    ]
  }
];

export default function StorageStructurePage() {
  const [treeData, setTreeData] = useState<StorageNode[]>(initialStorageTree);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "kv-1": true,
    "day-1-1": true,
    "ke-1-1-1": true,
    "tang-1-1-1-1": true,
    "kv-2": true
  });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedNode, setSelectedNode] = useState<StorageNode | null>(null);

  // Form states
  const [formLevel, setFormLevel] = useState<"khu_vuc" | "day" | "ke" | "tang" | "o">("khu_vuc");
  const [selectedKhuVucId, setSelectedKhuVucId] = useState("");
  const [selectedDayId, setSelectedDayId] = useState("");
  const [selectedKeId, setSelectedKeId] = useState("");
  const [selectedTangId, setSelectedTangId] = useState("");

  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formOrderIndex, setFormOrderIndex] = useState(1);
  const [formStatus, setFormStatus] = useState(true);
  const [formNote, setFormNote] = useState("");

  // Toggle expand/collapse helper
  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Helper to recursive flat list of specific level
  const getFlatNodesOfLevel = (nodes: StorageNode[], level: "khu_vuc" | "day" | "ke" | "tang" | "o"): StorageNode[] => {
    let result: StorageNode[] = [];
    nodes.forEach(node => {
      if (node.level === level) {
        result.push(node);
      }
      if (node.children) {
        result = [...result, ...getFlatNodesOfLevel(node.children, level)];
      }
    });
    return result;
  };

  // Flatten nodes for dropdown selection
  const allKhuVuc = useMemo(() => getFlatNodesOfLevel(treeData, "khu_vuc"), [treeData]);
  
  const allDayFiltered = useMemo(() => {
    if (!selectedKhuVucId) return [];
    const kv = allKhuVuc.find(n => n.id === selectedKhuVucId);
    return kv?.children || [];
  }, [selectedKhuVucId, allKhuVuc]);

  const allKeFiltered = useMemo(() => {
    if (!selectedDayId) return [];
    const day = allDayFiltered.find(n => n.id === selectedDayId);
    return day?.children || [];
  }, [selectedDayId, allDayFiltered]);

  const allTangFiltered = useMemo(() => {
    if (!selectedKeId) return [];
    const ke = allKeFiltered.find(n => n.id === selectedKeId);
    return ke?.children || [];
  }, [selectedKeId, allKeFiltered]);

  // Recursively find a node by ID and its parent in the tree
  const findNodeAndParent = (
    nodes: StorageNode[], 
    targetId: string, 
    parent: StorageNode | null = null
  ): { node: StorageNode; parent: StorageNode | null } | null => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return { node, parent };
      }
      if (node.children) {
        const found = findNodeAndParent(node.children, targetId, node);
        if (found) return found;
      }
    }
    return null;
  };

  // Recursively build parent path codes
  const getParentPathCodes = (): string => {
    const parts: string[] = [];
    if (formLevel === "khu_vuc") return "";
    
    if (selectedKhuVucId) {
      const kv = allKhuVuc.find(n => n.id === selectedKhuVucId);
      if (kv) {
        parts.push(kv.code);
        if (formLevel === "day") return parts.join("-");
      }
    }
    if (selectedDayId) {
      const d = allDayFiltered.find(n => n.id === selectedDayId);
      if (d) {
        parts.push(d.code);
        if (formLevel === "ke") return parts.join("-");
      }
    }
    if (selectedKeId) {
      const k = allKeFiltered.find(n => n.id === selectedKeId);
      if (k) {
        parts.push(k.code);
        if (formLevel === "tang") return parts.join("-");
      }
    }
    if (selectedTangId) {
      const t = allTangFiltered.find(n => n.id === selectedTangId);
      if (t) {
        parts.push(t.code);
        if (formLevel === "o") return parts.join("-");
      }
    }
    return parts.join("-");
  };

  const pathCode = useMemo(() => {
    const parentPath = getParentPathCodes();
    if (!parentPath) return formCode;
    return formCode ? `${parentPath}-${formCode}` : parentPath;
  }, [formLevel, selectedKhuVucId, selectedDayId, selectedKeId, selectedTangId, formCode]);

  // Open modal for adding a new structure
  const handleOpenAddModal = (parent?: StorageNode) => {
    setModalMode("add");
    setSelectedNode(null);
    setFormCode("");
    setFormName("");
    setFormOrderIndex(1);
    setFormStatus(true);
    setFormNote("");
    
    if (parent) {
      // Auto pre-populate parent dropdowns if adding from a direct node "+ icon"
      if (parent.level === "khu_vuc") {
        setFormLevel("day");
        setSelectedKhuVucId(parent.id);
      } else if (parent.level === "day") {
        setFormLevel("ke");
        const found = findNodeAndParent(treeData, parent.id);
        if (found?.parent) setSelectedKhuVucId(found.parent.id);
        setSelectedDayId(parent.id);
      } else if (parent.level === "ke") {
        setFormLevel("tang");
        const foundKe = findNodeAndParent(treeData, parent.id);
        if (foundKe?.parent) {
          setSelectedDayId(foundKe.parent.id);
          const foundDay = findNodeAndParent(treeData, foundKe.parent.id);
          if (foundDay?.parent) setSelectedKhuVucId(foundDay.parent.id);
        }
        setSelectedKeId(parent.id);
      } else if (parent.level === "tang") {
        setFormLevel("o");
        const foundTang = findNodeAndParent(treeData, parent.id);
        if (foundTang?.parent) {
          setSelectedKeId(foundTang.parent.id);
          const foundKe = findNodeAndParent(treeData, foundTang.parent.id);
          if (foundKe?.parent) {
            setSelectedDayId(foundKe.parent.id);
            const foundDay = findNodeAndParent(treeData, foundKe.parent.id);
            if (foundDay?.parent) setSelectedKhuVucId(foundDay.parent.id);
          }
        }
        setSelectedTangId(parent.id);
      }
    } else {
      setFormLevel("khu_vuc");
      setSelectedKhuVucId("");
      setSelectedDayId("");
      setSelectedKeId("");
      setSelectedTangId("");
    }
    
    setIsModalOpen(true);
  };

  // Open modal for editing a node
  const handleOpenEditModal = (node: StorageNode) => {
    setModalMode("edit");
    setSelectedNode(node);
    setFormLevel(node.level);
    setFormCode(node.code);
    setFormName(node.name);
    setFormOrderIndex(node.orderIndex || 1);
    setFormStatus(node.status);
    setFormNote(node.note || "");

    // Track up the parent hierarchy to populate dependent dropdowns
    const info = findNodeAndParent(treeData, node.id);
    if (info?.parent) {
      const p = info.parent;
      if (p.level === "khu_vuc") {
        setSelectedKhuVucId(p.id);
      } else if (p.level === "day") {
        setSelectedDayId(p.id);
        const gp = findNodeAndParent(treeData, p.id);
        if (gp?.parent) setSelectedKhuVucId(gp.parent.id);
      } else if (p.level === "ke") {
        setSelectedKeId(p.id);
        const gp = findNodeAndParent(treeData, p.id);
        if (gp?.parent) {
          setSelectedDayId(gp.parent.id);
          const ggp = findNodeAndParent(treeData, gp.parent.id);
          if (ggp?.parent) setSelectedKhuVucId(ggp.parent.id);
        }
      } else if (p.level === "tang") {
        setSelectedTangId(p.id);
        const gp = findNodeAndParent(treeData, p.id);
        if (gp?.parent) {
          setSelectedKeId(gp.parent.id);
          const ggp = findNodeAndParent(treeData, gp.parent.id);
          if (ggp?.parent) {
            setSelectedDayId(ggp.parent.id);
            const gggp = findNodeAndParent(treeData, ggp.parent.id);
            if (gggp?.parent) setSelectedKhuVucId(gggp.parent.id);
          }
        }
      }
    }
    setIsModalOpen(true);
  };

  // Delete node recursively
  const handleDeleteNode = (id: string) => {
    const nodeInfo = findNodeAndParent(treeData, id);
    if (!nodeInfo) return;
    
    if (confirm(`Bạn chắc chắn muốn xóa "${nodeInfo.node.name}" và toàn bộ các cấp con bên trong?`)) {
      const removeNodeFromList = (list: StorageNode[]): StorageNode[] => {
        return list
          .filter(n => n.id !== id)
          .map(n => {
            if (n.children) {
              return { ...n, children: removeNodeFromList(n.children) };
            }
            return n;
          });
      };
      setTreeData(removeNodeFromList(treeData));
    }
  };

  // Submit modal form (Add/Edit)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode || !formName) {
      alert("Vui lòng điền đầy đủ Mã và Tên cấu trúc!");
      return;
    }

    if (modalMode === "add") {
      const newNode: StorageNode = {
        id: `node-${Date.now()}`,
        level: formLevel,
        code: formCode,
        name: formName,
        status: formStatus,
        orderIndex: Number(formOrderIndex),
        note: formNote,
        children: formLevel !== "o" ? [] : undefined
      };

      // Determine parent ID to append
      let parentId = "";
      if (formLevel === "day") parentId = selectedKhuVucId;
      else if (formLevel === "ke") parentId = selectedDayId;
      else if (formLevel === "tang") parentId = selectedKeId;
      else if (formLevel === "o") parentId = selectedTangId;

      if (!parentId && formLevel !== "khu_vuc") {
        alert("Vui lòng chọn đầy đủ các cấp cha hợp lệ!");
        return;
      }

      if (formLevel === "khu_vuc") {
        setTreeData(prev => [...prev, newNode].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)));
      } else {
        const addNodeToTree = (list: StorageNode[]): StorageNode[] => {
          return list.map(n => {
            if (n.id === parentId) {
              const children = n.children ? [...n.children, newNode] : [newNode];
              // Sort by orderIndex
              children.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
              return { ...n, children };
            }
            if (n.children) {
              return { ...n, children: addNodeToTree(n.children) };
            }
            return n;
          });
        };
        setTreeData(prev => addNodeToTree(prev));
        // Expand the parent so the user immediately sees the added node
        setExpandedNodes(prev => ({ ...prev, [parentId]: true }));
      }
    } else {
      // Edit mode
      if (!selectedNode) return;
      
      const updateNodeInTree = (list: StorageNode[]): StorageNode[] => {
        return list.map(n => {
          if (n.id === selectedNode.id) {
            return {
              ...n,
              code: formCode,
              name: formName,
              status: formStatus,
              orderIndex: Number(formOrderIndex),
              note: formNote
            };
          }
          if (n.children) {
            const updatedChildren = updateNodeInTree(n.children);
            updatedChildren.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            return { ...n, children: updatedChildren };
          }
          return n;
        });
      };
      setTreeData(prev => updateNodeInTree(prev));
    }

    setIsModalOpen(false);
  };

  // Helper to render correct Level Label and Icon
  const getLevelInfo = (level: "khu_vuc" | "day" | "ke" | "tang" | "o") => {
    switch (level) {
      case "khu_vuc":
        return { label: "Khu vực", color: "text-[#135C3B] bg-[#E8F5E9]", border: "border-[#135C3B]/20", icon: Warehouse };
      case "day":
        return { label: "Dãy", color: "text-[#00854C] bg-[#E8F8F0]", border: "border-[#00854C]/20", icon: Columns2 };
      case "ke":
        return { label: "Kệ", color: "text-[#1976D2] bg-[#E3F2FD]", border: "border-[#1976D2]/20", icon: LayoutGrid };
      case "tang":
        return { label: "Tầng", color: "text-[#F57C00] bg-[#FFF3E0]", border: "border-[#F57C00]/20", icon: Layers };
      case "o":
        return { label: "Ô", color: "text-[#7B1FA2] bg-[#F3E5F5]", border: "border-[#7B1FA2]/20", icon: Box };
    }
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: StorageNode, depth: number = 0) => {
    const isExpanded = expandedNodes[node.id];
    const info = getLevelInfo(node.level);
    const Icon = info.icon;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="w-full">
        {/* Node content row */}
        <div 
          style={{ paddingLeft: `${depth * 28 + 12}px` }}
          className="group flex items-center justify-between border-b border-[#EDF1ED] bg-white py-3 pr-4 transition-all hover:bg-[#F3F7F5]"
        >
          <div className="flex items-center gap-3">
            {/* Expand / Collapse trigger */}
            {node.level !== "o" ? (
              <button 
                onClick={() => toggleExpand(node.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/5"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-[#5A5A5A]" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-[#5A5A5A]" />
                )}
              </button>
            ) : (
              <div className="w-6" /> // spacer for leaf nodes
            )}

            {/* Level badge */}
            <span className={`inline-flex items-center gap-1 rounded-[6px] px-2 py-0.5 text-xs font-semibold ${info.color} border ${info.border}`}>
              <Icon className="h-3.5 w-3.5" />
              {info.label}
            </span>

            {/* Code */}
            <span className="font-be_vietnam_pro text-sm font-semibold text-[#1F1F1F] bg-gray-100 rounded px-1.5 py-0.5">
              {node.code}
            </span>

            {/* Name */}
            <span className="font-be_vietnam_pro text-sm text-[#303030] font-medium">
              {node.name}
            </span>

            {/* Active Status */}
            <span className="inline-flex items-center gap-1.5 text-xs">
              <span className={`h-2.5 w-2.5 rounded-full ${node.status ? "bg-[#1A8F5B]" : "bg-[#E03B3B]"}`} />
              <span className={node.status ? "text-[#1A8F5B]" : "text-[#E03B3B]"}>
                {node.status ? "Hoạt động" : "Tạm dừng"}
              </span>
            </span>
          </div>

          {/* Action buttons (only visible on hover, or always on tablet/mobile) */}
          <div className="flex items-center gap-2 opacity-95 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
            {node.level !== "o" && (
              <button
                type="button"
                title={`Thêm cấp con cho ${node.name}`}
                onClick={() => handleOpenAddModal(node)}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#C9D3C9] bg-white text-[#135C3B] hover:bg-[#E8F5E9] hover:border-[#135C3B]"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              title="Chỉnh sửa thông tin"
              onClick={() => handleOpenEditModal(node)}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#C9D3C9] bg-white text-[#1D6FE8] hover:bg-[#E3F2FD] hover:border-[#1976D2]"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Xóa thành phần"
              onClick={() => handleDeleteNode(node.id)}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#C9D3C9] bg-white text-[#D94C45] hover:bg-[#FDE8E8] hover:border-[#D94C45]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Children Render with motion transition */}
        {node.level !== "o" && node.children && (
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-[#FAFCFA]/40"
              >
                {node.children.length > 0 ? (
                  node.children.map(child => renderTreeNode(child, depth + 1))
                ) : (
                  <div 
                    style={{ paddingLeft: `${(depth + 1) * 28 + 12}px` }}
                    className="py-3 text-xs text-[#7A7A7A] italic border-b border-[#EDF1ED]"
                  >
                    Chưa có cấu trúc cấp dưới. Click nút (+) để thêm mới.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <div className="w-full p-1">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="py-2 text-left font-be_vietnam_pro text-[32px] font-bold leading-[40px] text-[#135C3B]">
            Cấu trúc kho phân tầng
          </h1>
          <p className="text-sm text-[#5A5A5A] font-be_vietnam_pro">
            Quản lý khu vực, dãy, kệ, tầng và ô chứa vật chứng theo dạng cây đệ quy trực quan
          </p>
        </div>
        <button
          onClick={() => handleOpenAddModal()}
          className="flex items-center gap-2 rounded-[8px] bg-[#135C3B] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0C9254] transition-all shadow-md shadow-[#135C3B]/10 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Thêm mới thành phần
        </button>
      </div>

      {/* Main tree list container */}
      <div className="overflow-hidden rounded-[12px] bg-white border border-[#E2E8E2] shadow-sm">
        {/* Table header style */}
        <div className="flex items-center justify-between bg-[#F6F8F6] px-4 py-4 border-b border-[#EDF1ED] text-sm font-semibold text-[#303030]">
          <div>Tên thành phần cấu trúc / Phân tầng</div>
          <div className="hidden lg:block pr-16">Thao tác</div>
        </div>

        {/* Tree content */}
        <div className="divide-y divide-[#EDF1ED]">
          {treeData.length > 0 ? (
            treeData.map(node => renderTreeNode(node, 0))
          ) : (
            <div className="px-4 py-12 text-center text-sm text-[#7A7A7A]">
              Chưa cấu hình cấu trúc kho nào. Bấm nút Thêm mới để tạo Khu vực đầu tiên.
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Form Modal (Task 2.3) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-[16px] shadow-2xl overflow-hidden border border-[#E2E8E2]"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between bg-[#F6F8F6] px-6 py-4 border-b border-[#EDF1ED]">
                <h3 className="text-lg font-bold font-be_vietnam_pro text-[#135C3B]">
                  {modalMode === "add" ? "Thêm mới thành phần cấu trúc" : `Chỉnh sửa: ${selectedNode?.name}`}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-black/5 text-[#7A7A7A]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Form body */}
              <form onSubmit={handleSubmitForm} className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
                
                {/* 1. Level selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#303030]">
                    Cấp cấu trúc <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={modalMode === "edit"}
                    value={formLevel}
                    onChange={(e) => {
                      const lvl = e.target.value as any;
                      setFormLevel(lvl);
                      // Reset parent selections when level changes
                      setSelectedKhuVucId("");
                      setSelectedDayId("");
                      setSelectedKeId("");
                      setSelectedTangId("");
                    }}
                    className="h-10 w-full rounded-[8px] border border-[#C9D3C9] bg-white px-3 text-sm focus:border-[#135C3B] focus:ring-1 focus:ring-[#135C3B] outline-none disabled:bg-gray-100 disabled:text-[#7A7A7A]"
                  >
                    <option value="khu_vuc">1. Khu vực</option>
                    <option value="day">2. Dãy (nằm trong Khu vực)</option>
                    <option value="ke">3. Kệ (nằm trong Dãy)</option>
                    <option value="tang">4. Tầng (nằm trong Kệ)</option>
                    <option value="o">5. Ô (nằm trong Tầng)</option>
                  </select>
                </div>

                {/* 2. Dependent Dropdowns (Dynamic parents) */}
                {formLevel !== "khu_vuc" && (
                  <div className="p-4 rounded-[12px] bg-[#F6F8F6] border border-[#EDF1ED] flex flex-col gap-4">
                    <span className="text-xs font-bold text-[#5A5A5A] uppercase tracking-wider">
                      Phân cấp cha của thành phần
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Khu vực cha dropdown */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#5A5A5A]">Khu vực cha *</label>
                        <select
                          disabled={modalMode === "edit"}
                          value={selectedKhuVucId}
                          onChange={(e) => {
                            setSelectedKhuVucId(e.target.value);
                            setSelectedDayId("");
                            setSelectedKeId("");
                            setSelectedTangId("");
                          }}
                          className="h-9 rounded-[6px] border border-[#C9D3C9] bg-white px-2.5 text-xs outline-none focus:border-[#135C3B] disabled:bg-gray-100"
                        >
                          <option value="">-- Chọn Khu Vực --</option>
                          {allKhuVuc.map(kv => (
                            <option key={kv.id} value={kv.id}>{kv.name} ({kv.code})</option>
                          ))}
                        </select>
                      </div>

                      {/* Dãy cha dropdown */}
                      {["day", "ke", "tang", "o"].includes(formLevel) && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#5A5A5A]">Dãy cha *</label>
                          <select
                            disabled={modalMode === "edit" || !selectedKhuVucId}
                            value={selectedDayId}
                            onChange={(e) => {
                              setSelectedDayId(e.target.value);
                              setSelectedKeId("");
                              setSelectedTangId("");
                            }}
                            className="h-9 rounded-[6px] border border-[#C9D3C9] bg-white px-2.5 text-xs outline-none focus:border-[#135C3B] disabled:bg-gray-100"
                          >
                            <option value="">-- Chọn Dãy --</option>
                            {allDayFiltered.map(d => (
                              <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Kệ cha dropdown */}
                      {["ke", "tang", "o"].includes(formLevel) && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#5A5A5A]">Kệ cha *</label>
                          <select
                            disabled={modalMode === "edit" || !selectedDayId}
                            value={selectedKeId}
                            onChange={(e) => {
                              setSelectedKeId(e.target.value);
                              setSelectedTangId("");
                            }}
                            className="h-9 rounded-[6px] border border-[#C9D3C9] bg-white px-2.5 text-xs outline-none focus:border-[#135C3B] disabled:bg-gray-100"
                          >
                            <option value="">-- Chọn Kệ --</option>
                            {allKeFiltered.map(k => (
                              <option key={k.id} value={k.id}>{k.name} ({k.code})</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Tầng cha dropdown */}
                      {["tang", "o"].includes(formLevel) && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#5A5A5A]">Tầng cha *</label>
                          <select
                            disabled={modalMode === "edit" || !selectedKeId}
                            value={selectedTangId}
                            onChange={(e) => setSelectedTangId(e.target.value)}
                            className="h-9 rounded-[6px] border border-[#C9D3C9] bg-white px-2.5 text-xs outline-none focus:border-[#135C3B] disabled:bg-gray-100"
                          >
                            <option value="">-- Chọn Tầng --</option>
                            {allTangFiltered.map(t => (
                              <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Code, Name, Order Index in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#303030]">
                      Mã cấu trúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: KV1, D1, K2"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase().replace(/\s/g, ""))}
                      className="h-10 rounded-[8px] border border-[#C9D3C9] px-3 text-sm outline-none focus:border-[#135C3B]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#303030]">
                      Tên cấu trúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Khu vực A, Kệ đựng vật chứng"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="h-10 rounded-[8px] border border-[#C9D3C9] px-3 text-sm outline-none focus:border-[#135C3B]"
                    />
                  </div>
                </div>

                {/* Path Code (Read-only generated string) */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#303030] flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#135C3B]" />
                    Mã địa chỉ đầy đủ (Path Code)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={pathCode || "--"}
                    className="h-10 rounded-[8px] border border-[#EDF1ED] bg-[#F6F8F6] px-3 text-sm text-[#135C3B] font-mono font-bold tracking-wider outline-none cursor-not-allowed"
                  />
                  <p className="text-xs text-[#7A7A7A] italic">
                    Hệ thống tự động nối từ các mã cấp cha (VD: KV1-D1-K1-T1).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Order Index */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#303030]">
                      Thứ tự hiển thị
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formOrderIndex}
                      onChange={(e) => setFormOrderIndex(Number(e.target.value))}
                      className="h-10 rounded-[8px] border border-[#C9D3C9] px-3 text-sm outline-none focus:border-[#135C3B]"
                    />
                  </div>

                  {/* Status Toggle */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#303030]">
                      Trạng thái hoạt động
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormStatus(!formStatus)}
                      className={`flex h-10 w-fit items-center gap-2 rounded-[8px] border px-4 transition-all ${
                        formStatus 
                          ? "border-[#1A8F5B]/30 bg-[#E8F8F0] text-[#1A8F5B]" 
                          : "border-[#E03B3B]/30 bg-[#FFF2F2] text-[#E03B3B]"
                      }`}
                    >
                      {formStatus ? (
                        <>
                          <ToggleRight className="h-5 w-5" />
                          <span>Đang hoạt động</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-5 w-5" />
                          <span>Dừng hoạt động</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#303030]">Ghi chú</label>
                  <textarea
                    rows={3}
                    placeholder="Nhập mô tả thêm về vị trí lưu trữ này..."
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    className="rounded-[8px] border border-[#C9D3C9] p-3 text-sm outline-none focus:border-[#135C3B] resize-none"
                  />
                </div>

                {/* Modal footer / Actions */}
                <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#EDF1ED]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-[8px] border border-[#C9D3C9] px-5 py-2.5 text-sm font-semibold text-[#303030] hover:bg-[#F6F8F6] transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="rounded-[8px] bg-[#135C3B] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0C9254] transition-all shadow-md shadow-[#135C3B]/5"
                  >
                    {modalMode === "add" ? "Thêm mới" : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
