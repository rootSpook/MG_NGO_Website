"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/adminPanel/dashboard" },
  { label: "Page Management", href: "/adminPanel/page-management" },
  { label: "Bylaws", href: "/adminPanel/bylaws" },
  { label: "Reports", href: "/adminPanel/reports" },
  { label: "IBAN Data", href: "/adminPanel/iban-data" },
  { label: "Contact Details", href: "/adminPanel/contact-details" },
  { label: "Homepage Content", href: "/adminPanel/homepage-content" },
  { label: "Board Members", href: "/adminPanel/board-members" },
  { label: "Supporters", href: "/adminPanel/supporters" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] rounded-[22px] bg-[#f5f5f5] p-5 shadow-md">
      <div className="mb-8 flex items-center">
        <span className="text-[22px] font-semibold text-black">Admin</span>
      </div>

      <nav className="space-y-3">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-[12px] px-4 py-3 text-[16px] transition ${
                active
                  ? "bg-[#dce8f7] text-[#2f80ed]"
                  : "text-black hover:bg-[#ececec]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}