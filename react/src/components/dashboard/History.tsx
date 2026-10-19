import React from "react";
import { Clipboard } from "../../assets";
import type { DashboardPage } from "./types";

type HistoryProps = {
  activePage: DashboardPage;
  collapsed: boolean;
  onPageChange: (page: DashboardPage) => void;
};

const History: React.FC<HistoryProps> = ({
  activePage,
  collapsed,
  onPageChange,
}) => {
  const isActive = activePage === "history";

  return (
    <section className="w-full">
      {collapsed ? (
        <button
          type="button"
          onClick={() => onPageChange("history")}
          aria-label="View all conversation history"
          aria-current={isActive ? "page" : undefined}
          title="History"
          className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 ${isActive ? "bg-ButtonBg2 text-TextColor" : "text-black hover:bg-ButtonBg2 hover:text-TextColor"}`}
        >
          <span
            aria-hidden="true"
            className="h-5 w-5 bg-current"
            style={{
              maskImage: `url("${Clipboard}")`,
              maskPosition: "center",
              maskRepeat: "no-repeat",
              maskSize: "contain",
              WebkitMaskImage: `url("${Clipboard}")`,
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
            }}
          />
        </button>
      ) : (
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="truncate font-Inter text-[13px] font-medium text-black">
            Recent Conversations
          </h2>
          <button
            type="button"
            onClick={() => onPageChange("history")}
            aria-current={isActive ? "page" : undefined}
            className={`shrink-0 cursor-pointer rounded px-2 py-1 font-Inter text-[11px] transition-colors ${isActive ? "text-TextColor" : "text-Black hover:text-TextColor"}`}
          >
            View all
          </button>
        </div>
      )}
    </section>
  );
};

export default History;
