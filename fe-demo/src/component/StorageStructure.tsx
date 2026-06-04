import React, { useState, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  Warehouse, 
  Layers, 
  Grid3X3, 
  ListCollapse, 
  Box, 
  Folder 
} from "lucide-react";
import dot_green from "../assets/dot-green.svg";
import phong_icon from '../assets/phong_icon.svg'
import ke_icon from '../assets/ke_icon.svg'
import tang_icon from '../assets/tang_icon.svg'
import o_icon from '../assets/o_icon.svg'
import day_icon from '../assets/day_icon.svg'
import expand_icon from '../assets/expand_icon.svg'
import shrink_icon from '../assets/shrink_icon.svg'
import trash_2_icon from  "../assets/trash-2.svg";
import update_green_icon from  "../assets/update_green.svg";


export interface StorageNode {
  id: string;
  level: 'khu_vuc' | 'day' | 'ke' | 'tang' | 'o' |'';
  code: string;
  name: string;
  status: boolean;
  orderIndex?: number;
  note?: string;
  children?: StorageNode[];
}

export const initialStorageTree: StorageNode[] = [
  {
    id: "1",
    level: "khu_vuc",
    code: "KV1",
    name: "Khu vực A - Vật chứng ma túy",
    status: true,
    children: [
      {
        id: "1-1",
        level: "day",
        code: "D1",
        name: "Dãy 1",
        status: true,
        children: [
          {
            id: "1-1-1",
            level: "ke",
            code: "K1",
            name: "Kệ K1",
            status: true,
            children: [
              {
                id: "1-1-1-1",
                level: "tang",
                code: "T1",
                name: "Tầng 1",
                status: true,
                children: [
                  {
                    id: "1-1-1-1-1",
                    level: "o",
                    code: "O1",
                    name: "Ô O1",
                    status: true,
                  },
                  {
                    id: "1-1-1-1-2",
                    level: "o",
                    code: "O2",
                    name: "Ô O2",
                    status: true,
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "2",
    level: "khu_vuc",
    code: "KV2",
    name: "Khu vực B - Vật chứng vũ khí",
    status: true,
    children: [
      {
        id: "2-1",
        level: "day",
        code: "D2",
        name: "Dãy 2",
        status: true,
        children: [
          {
            id: "2-1-1",
            level: "ke",
            code: "K2",
            name: "Kệ K2",
            status: true,
            children: [
              {
                id: "2-1-1-1",
                level: "tang",
                code: "T2",
                name: "Tầng 2",
                status: true,
                children: [
                  {
                    id: "2-1-1-1-1",
                    level: "o",
                    code: "O3",
                    name: "Ô O3",
                    status: true,
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'khu_vuc':
      return <img src={phong_icon} alt="" />;
    case 'day':
      return <img src={day_icon} alt="" />;
    case 'ke':
      return <img src={ke_icon} alt="" />;
    case 'tang':
      return <img src={tang_icon} alt="" />;
    case 'o':
      return <img src={o_icon} alt="" />;
    default:
      return <img src={phong_icon} alt="" />;
  }
};

const getLevelName = (level: string) => {
  switch (level) {
    case 'khu_vuc': return 'Khu vực';
    case 'day': return 'Dãy';
    case 'ke': return 'Kệ';
    case 'tang': return 'Tầng';
    case 'o': return 'Ô';
    default: return level;
  }
};

interface StorageStructureProps {
  value?: StorageNode[];
  onChange?: (value: StorageNode[]) => void;
}

export function StorageStructure({ value, onChange }: StorageStructureProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "1": true,
    "1-1": true,
    "1-1-1": true,
    "1-1-1-1": true,
    "2": true,
    "2-1": true,
    "2-1-1": true,
    "2-1-1-1": true,
  });

  const treeData = value || initialStorageTree;

  useEffect(() => {
    if (!value && onChange) {
      onChange(initialStorageTree);
    }
  }, [value, onChange]);

  const renderNode = (node: StorageNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expandedNodes[node.id];

    const toggleExpand = (e: React.MouseEvent) => {
      e.stopPropagation();
      setExpandedNodes(prev => ({
        ...prev,
        [node.id]: !prev[node.id]
      }));
    };

    return (
      <div key={node.id} className="w-full flex flex-col pl-7 gap-[5px]">
        <div 
          style={{ paddingLeft: `${0}px` }}
          className="group flex items-center justify-between rounded-md hover:bg-emerald-50/40 transition-colors"
        >
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <div className="w-6 h-6 flex items-center justify-center cursor-pointer select-none " onClick={toggleExpand}>
              {hasChildren ? (
                isExpanded ? (
                  <img src={shrink_icon} alt="" />
                ) : (
                  <img src={expand_icon} alt="" />
                )
              ) : (
                <div className=""></div>
              )}
            </div>

            <div className="w-6 h-6 flex items-center justify-center">
              {getLevelIcon(node.level)}
            </div>

            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-[14px] font-medium text-gray-800 truncate">{node.name}</span>
              
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 pr-6">
            <img className="cursor-pointer" src={update_green_icon} alt="" />
            <img className="cursor-pointer" src={trash_2_icon} alt="" />
            
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="flex flex-col w-full">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full rounded-md bg-white shadow-sm">

      <div className="w-full overflow-y-auto max-h-[500px] custom-scrollbar">
        {treeData.length > 0 ? (
          <div className="flex flex-col w-full p-[10px] pl-2 gap-[4px] rounded-[4px]">
            {treeData.map(node => renderNode(node, 0))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Folder className="w-12 h-12 stroke-1 mb-2" />
            <span className="text-sm">Chưa có vị trí lưu trữ nào được cấu hình</span>
          </div>
        )}
      </div>
    </div>
  );
}
