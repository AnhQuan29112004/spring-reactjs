import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type PopupType = "success" | "error";

interface PopupState {
  message: string;
  type: PopupType;
}

interface PopupContextValue {
  showPopup: (message: string, type: PopupType) => void;
}

const PopupContext = createContext<PopupContextValue | null>(null);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [popup, setPopup] = useState<PopupState | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const showPopup = useCallback((message: string, type: PopupType) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setPopup({ message, type });
    timeoutRef.current = window.setTimeout(() => {
      setPopup(null);
      timeoutRef.current = null;
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showPopup }), [showPopup]);

  return (
    <PopupContext.Provider value={value}>
      {children}
      {popup ? (
        <div className="pointer-events-none fixed right-4 top-4 z-[1000]">
          <div
            className={`min-w-[280px] rounded-md border px-4 py-3 text-left shadow-lg ${
              popup.type === "success"
                ? "border-[#B7EB8F] bg-[#F6FFED] text-[#135C3B]"
                : "border-[#FFCCC7] bg-[#FFF2F0] text-[#CF1322]"
            }`}
          >
            <p className="font-be_vietnam_pro text-sm font-medium">{popup.message}</p>
          </div>
        </div>
      ) : null}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error("usePopup must be used within PopupProvider");
  }

  return context;
}
