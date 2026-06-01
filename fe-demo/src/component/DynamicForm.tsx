import { type ChangeEvent } from "react";
import reset_icon from "../assets/reset.svg";
import required_icon from "../assets/required.svg";
import search_icon from "../assets/search-icon.svg";
import choose_file from "../assets/choose-file.svg";
import { StorageStructure } from "./StorageStructure";

export type FormFieldType = 'text' | 'date' | 'select' | 'textarea' | 'file' | 'tree';

export interface FormOption {
  label: string;
  value: string | number;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: FormOption[];
  disabled?: boolean;
  hasSearchBtn?: boolean;
  fullWidth?: boolean;
  deleteBtn?:{
    label?:string,
    icon?:string,
    onClick?:()=>void,
  }
}

export interface FormSection {
  title: string;
  fields: FormField[];
  hasResetBtn?: boolean;
  
  actionBtn?:{
    label?:string,
    icon?:string,
    onClick?:()=>void,
  }
}

export interface DynamicFormProps {
  sections: FormSection[];
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onFileChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  fileName?: string;
  onReset?: () => void;
}

const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return "";
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export function DynamicForm({
  sections,
  formData,
  onChange,
  onFileChange,
  fileName,
  onReset,
}: DynamicFormProps) {
  const handleInputChange = (field: string) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    onChange(field, event.target.value);
  };

  const isFullWidth = (field: FormField) =>
    field.fullWidth ||
    field.type === "textarea" ||
    field.type === "file" ||
    field.type === "tree";

  return (
    <>
      {sections.map((section, sIndex) => (
        <div key={sIndex} className={`${sIndex > 0 ? "mt-5" : ""} flex w-full flex-col items-start gap-[10px] rounded-md border border-[#BCBCBC] p-[10px]`}>
          <div className="flex w-full items-center justify-between">
            <span className="title-form">{section.title}</span>
            {section.hasResetBtn && onReset && (
              <button
                type="button"
                onClick={onReset}
                className="flex items-center justify-center gap-2 rounded-[4px] bg-[#00854C] px-4 py-[6px]"
              >
                <img src={reset_icon} className="invert brightness-100" alt="reset" />
                <span className="text-normal text-white">Nhập lại thông tin</span>
              </button>
            )}
            {section.actionBtn && section.actionBtn?.onClick && (
              <button
                type="button"
                onClick={section.actionBtn?.onClick}
                className="flex items-center justify-center gap-2 rounded-[4px] bg-[#00854C] px-4 py-[6px]"
              >
                <img src={reset_icon} className="invert brightness-100" alt="reset" />
                <span className="text-normal text-white">{section.actionBtn?.label}</span>
              </button>
            )}
          </div>

          <div className="flex w-full flex-col gap-5">
            {/* Split fields into chunks of 2 for grid cols 2 */}
            {(() => {
              const rows = [];
              let i = 0;
              while (i < section.fields.length) {
                const field1 = section.fields[i];
                const field2 = section.fields[i + 1];
                
                // If textarea or file, render as full width
                if (field1 && isFullWidth(field1)) {
                   rows.push(
                     <div key={field1.name} className={`flex w-full flex-col items-start gap-2 ${field1.type === "tree" ? "" : "px-[10px]"}`}>
                       {field1.label && (
                         <div className="flex">
                           <span className="text-normal mr-1 font-medium">{field1.label}</span>
                           {field1.required && <img src={required_icon} alt="required" />}
                         </div>
                       )}
                       {field1.type === 'textarea' && (
                         <div className={field1.deleteBtn ? "flex gap-[10px] w-full items-center" : "w-full"}>
                           <textarea
                             value={getNestedValue(formData, field1.name) || ""}
                             onChange={handleInputChange(field1.name)}
                             disabled={field1.disabled}
                             className="text-placeholder w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 pt-2"
                             placeholder={field1.placeholder}
                           />
                           {field1.deleteBtn && field1.deleteBtn.onClick && (
                             <button
                               type="button"
                               onClick={field1.deleteBtn.onClick}
                               className=""
                             >
                               {field1.deleteBtn.icon && <img src={field1.deleteBtn.icon} alt="delete" />}
                               
                             </button>
                           )}
                         </div>
                       )}
                       {field1.type === 'file' && (
                         <div className={field1.deleteBtn ? "flex gap-[10px] w-full items-center" : "w-full"}>
                           <label className="flex w-fit cursor-pointer items-center justify-center rounded-[4px] border border-[#D9D9D9] bg-white px-4 shadow-sm">
                             <img src={choose_file} alt="choose file" />
                             <span className="text-normal ml-2 py-1 pr-4">Chọn file</span>
                             <span className="text-[20px] text-[#2B2B2B]">{fileName}</span>
                             <input type="file" className="hidden" onChange={onFileChange} disabled={field1.disabled} />
                           </label>
                           {field1.deleteBtn && field1.deleteBtn.onClick && (
                             <button
                               type="button"
                               onClick={field1.deleteBtn.onClick}
                               className=""
                             >
                               {field1.deleteBtn.icon && <img src={field1.deleteBtn.icon} alt="delete" />}
                               
                             </button>
                           )}
                         </div>
                       )}
                       {field1.type === 'tree' && (
                         <div className="w-full">
                           <StorageStructure
                             value={getNestedValue(formData, field1.name)}
                             onChange={(val) => onChange(field1.name, val)}
                           />
                         </div>
                       )}
                     </div>
                   );
                   i++;
                } else if (field2 && !isFullWidth(field2)) {
                   // Render 2 cols
                   rows.push(
                     <div key={`${field1.name}-${field2.name}`} className="grid grid-cols-2 gap-6 max-sm:grid-cols-1 px-[10px]">
                       {[field1, field2].map((field) => (
                         <div key={field.name} className="flex flex-col gap-2">
                           <div className="flex">
                             <span className="text-normal mr-1 font-medium">{field.label}</span>
                             {field.required && <img src={required_icon} alt="required" />}
                           </div>
                           <div className={field.hasSearchBtn || field.deleteBtn ? "flex gap-[10px] items-center" : ""}>
                             {field.type === 'select' ? (
                               <select
                                 value={getNestedValue(formData, field.name) || ""}
                                 onChange={handleInputChange(field.name)}
                                 disabled={field.disabled}
                                 className={`text-normal h-8 w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 ${
                                   getNestedValue(formData, field.name) ? "text-black/85" : "text-black/25"
                                 }`}
                               >
                                 <option value="" disabled>
                                   {field.placeholder || `Chọn ${field.label}`}
                                 </option>
                                 {field.options?.map((opt) => (
                                   <option key={opt.value} value={opt.value}>
                                     {opt.label}
                                   </option>
                                 ))}
                               </select>
                             ) : (
                               <input
                                 type={field.type}
                                 value={getNestedValue(formData, field.name) || ""}
                                 onChange={handleInputChange(field.name)}
                                 disabled={field.disabled}
                                 className={`h-8 w-full rounded-[4px] border-[0.8px] border-[#D9D9D9] bg-white px-4 py-[7px] ${field.type === 'date' ? 'date' : 'text-placeholder'}`}
                                 placeholder={field.placeholder}
                               />
                             )}
                             {field.hasSearchBtn && (
                               <button type="button" className="rounded-[4px] bg-[#00854C] px-3 py-[2px]">
                                 <img src={search_icon} className="h-6 w-6 invert brightness-100" alt="search" />
                               </button>
                             )}
                             {field.deleteBtn && field.deleteBtn.onClick && (
                               <button
                                 type="button"
                                 onClick={field.deleteBtn.onClick}
                                 className=""
                               >
                                 {field.deleteBtn.icon && <img src={field.deleteBtn.icon} alt="delete" />}
                                 
                               </button>
                             )}
                           </div>
                         </div>
                       ))}
                     </div>
                   );
                   i += 2;
                } else {
                   // Render 1 col for remaining
                   rows.push(
                     <div key={field1.name} className="grid grid-cols-2 gap-6 max-sm:grid-cols-1 px-[10px]">
                       <div className="flex flex-col gap-2">
                         <div className="flex">
                           <span className="text-normal mr-1 font-medium">{field1.label}</span>
                           {field1.required && <img src={required_icon} alt="required" />}
                         </div>
                         <div className={field1.hasSearchBtn || field1.deleteBtn ? "flex gap-[10px] items-center" : ""}>
                           {field1.type === 'select' ? (
                             <select
                               value={getNestedValue(formData, field1.name) || ""}
                               onChange={handleInputChange(field1.name)}
                               disabled={field1.disabled}
                               className={`text-normal h-8 w-full rounded border-[0.8px] border-[#D9D9D9] bg-white px-4 ${
                                 getNestedValue(formData, field1.name) ? "text-black/85" : "text-black/25"
                               }`}
                             >
                               <option value="" disabled>
                                 {field1.placeholder || `Chọn ${field1.label}`}
                               </option>
                               {field1.options?.map((opt) => (
                                 <option key={opt.value} value={opt.value}>
                                   {opt.label}
                                 </option>
                               ))}
                             </select>
                           ) : (
                             <input
                               type={field1.type}
                               value={getNestedValue(formData, field1.name) || ""}
                               onChange={handleInputChange(field1.name)}
                               disabled={field1.disabled}
                               className={`h-8 w-full rounded-[4px] border-[0.8px] border-[#D9D9D9] bg-white px-4 py-[7px] ${field1.type === 'date' ? 'date' : 'text-placeholder'}`}
                               placeholder={field1.placeholder}
                             />
                           )}
                           {field1.hasSearchBtn && (
                             <button type="button" className="rounded-[4px] bg-[#00854C] px-3 py-[2px]">
                               <img src={search_icon} className="h-6 w-6 invert brightness-100" alt="search" />
                             </button>
                           )}
                           {field1.deleteBtn && field1.deleteBtn.onClick && (
                             <button
                               type="button"
                               onClick={field1.deleteBtn.onClick}
                               className="flex items-center justify-center gap-1 rounded-[4px] bg-[#FF4D4F] px-3 py-[4px] text-white hover:bg-[#FF7875]"
                             >
                               {field1.deleteBtn.icon && <img src={field1.deleteBtn.icon} alt="delete" />}
                               
                             </button>
                           )}
                         </div>
                       </div>
                     </div>
                   );
                   i++;
                }
              }
              return rows;
            })()}
          </div>
        </div>
      ))}
    </>
  );
}
