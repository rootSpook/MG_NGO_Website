"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useEditorPanel } from "@/context/EditorPanelContext";

export default function NotificationDropdown() {
  const { notifications, setNotifications } = useEditorPanel();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function markOneAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full p-2 transition hover:bg-[#ececec]"
      >
        <Bell
          className={`h-5 w-5 ${
            unreadCount > 0 ? "text-[#2f80ed]" : "text-[#7c7c7c]"
          }`}
          fill={unreadCount > 0 ? "#2f80ed" : "transparent"}
        />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#ff5b5b]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-[16px] bg-white shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-[15px] font-semibold text-black">
              Bildirimler
            </span>

            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-[13px] text-[#2f80ed]"
            >
              <CheckCheck className="h-4 w-4" />
              Tümünü okundu yap
            </button>
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-4 text-[14px] text-[#666]">
                Bildirim bulunmuyor.
              </div>
            ) : (
              notifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => markOneAsRead(item.id)}
                  className={`block w-full border-b px-4 py-3 text-left text-[14px] ${
                    item.isRead ? "bg-white" : "bg-[#eef5ff]"
                  }`}
                >
                  <div className="text-[#222]">{item.title}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}