import React from "react";
import { SidebarList } from "../../constants";
import type { DashboardPage } from "./types";

type DashBoardListProps = {
  activePage: DashboardPage;
  collapsed: boolean;
  onPageChange: (page: DashboardPage) => void;
};

const pageByName: Record<string, DashboardPage> = {
  Chat: "chat",
  Settings: "settings",
};

const DashBoardList: React.FC<DashBoardListProps> = ({
  activePage,
  collapsed,
  onPageChange,
}) => {
  return (
    <ul className="flex w-full flex-col items-start gap-2">
      {SidebarList.map((item) => (
        <li key={item.id} className="w-full">
          {(() => {
            const page = pageByName[item.name];
            const isActive = activePage === page;

            return (
              <button
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.name}
                title={collapsed ? item.name : undefined}
                className={`flex h-10 w-full cursor-pointer items-center rounded-lg font-Inter text-[14px] font-medium transition-colors duration-150 ${collapsed ? "justify-center px-0" : "gap-3 px-4"} ${isActive ? "bg-ButtonBg2 text-TextColor" : "text-black hover:bg-ButtonBg2 hover:text-TextColor"}`}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 bg-current"
                  style={{
                    maskImage: `url("${item.icon}")`,
                    maskPosition: "center",
                    maskRepeat: "no-repeat",
                    maskSize: "contain",
                    WebkitMaskImage: `url("${item.icon}")`,
                    WebkitMaskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "contain",
                  }}
                />
                {!collapsed && <span>{item.name}</span>}
              </button>
            );
          })()}
        </li>
      ))}
    </ul>
  );
};

export default DashBoardList;
