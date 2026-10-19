import React, { useEffect, useState } from "react";
import { getCurrentUser, type AuthUser } from "../../auth";
import { Icon } from "../../assets";
import type { DashboardPage } from "./types";

type ProfileProps = {
  activePage: DashboardPage;
  collapsed: boolean;
  onPageChange: (page: DashboardPage) => void;
};

const Profile: React.FC<ProfileProps> = ({
  activePage,
  collapsed,
  onPageChange,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((result) => {
        if (isMounted) setUser(result.user ?? null);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const initial = user?.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <button
      type="button"
      onClick={() => onPageChange("profile")}
      aria-current={activePage === "profile" ? "page" : undefined}
      title={collapsed ? (user?.name ?? "Profile") : undefined}
      className={`flex min-h-11 w-full cursor-pointer items-center rounded-lg py-1 transition-colors ${collapsed ? "justify-center px-0" : "justify-between px-2"} ${activePage === "profile" ? "bg-ButtonBg2 text-TextColor" : "text-black hover:bg-ButtonBg2 hover:text-TextColor"}`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <div
          role="img"
          aria-label={`${user?.name ?? "User"} profile picture`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ButtonBg2 font-Inter font-semibold text-TextColor"
        >
          {initial}
        </div>
        {!collapsed && (
          <span className="truncate font-Inter text-[14px] font-semibold">
            {user?.name ?? "Profile"}
          </span>
        )}
      </span>
      {!collapsed && <img src={Icon} alt="" className="h-5 w-5 shrink-0" />}
    </button>
  );
};

export default Profile;
