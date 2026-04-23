"use client";

import Link from "next/link";

const quickStats = [
  { label: "Board Members", value: 12, bg: "bg-[#cfe1f6]" },
  { label: "Active Supporters", value: 34, bg: "bg-[#cfead4]" },
  { label: "Annual Reports", value: 7, bg: "bg-[#f1ddb0]" },
];

const recentChanges = [
  {
    title: "MG Information — Mission Statement updated",
    date: "Updated on January 15, 2024",
    href: "/adminPanel/page-management",
  },
  {
    title: "Annual Report 2023 uploaded",
    date: "Updated on January 10, 2024",
    href: "/adminPanel/reports",
  },
  {
    title: "Board Member Dr. Ahmet Yılmaz added",
    date: "Updated on January 5, 2024",
    href: "/adminPanel/board-members",
  },
];

const contentStatus = [
  { title: "MG Information", status: "Up to date", color: "text-[#27ae60]" },
  { title: "Board Members", status: "Needs Review", color: "text-[#f39c12]" },
  { title: "Homepage Slider", status: "Up to date", color: "text-[#27ae60]" },
];

export default function AdminDashboardSections() {
  return (
    <div className="space-y-6">
      <section className="rounded-[22px] bg-[#e5e5e5] p-6 shadow-md">
        <h2 className="mb-4 text-[22px] font-semibold text-black">Quick Stats</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {quickStats.map((item) => (
            <div
              key={item.label}
              className={`${item.bg} rounded-[18px] px-8 py-6 shadow-sm`}
            >
              <div className="text-[42px] font-bold text-black">{item.value}</div>
              <div className="mt-2 text-[16px] text-black">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] bg-[#e5e5e5] p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[22px] font-semibold text-black">Recent Changes</h2>
          <Link
            href="/adminPanel/page-management"
            className="rounded-[10px] bg-white px-5 py-3 shadow-sm"
          >
            Manage All
          </Link>
        </div>

        <div className="space-y-3">
          {recentChanges.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-[16px] bg-[#d8d8d8] px-6 py-4 shadow-sm"
            >
              <div>
                <h3 className="text-[18px] font-medium text-black">{item.title}</h3>
                <p className="text-[15px] text-[#444]">{item.date}</p>
              </div>

              <Link
                href={item.href}
                className="rounded-[10px] bg-[#27ae60] px-7 py-3 text-white"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] bg-[#e5e5e5] p-6 shadow-md">
        <h2 className="mb-4 text-[22px] font-semibold text-black">Content Status</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {contentStatus.map((item) => (
            <div
              key={item.title}
              className="rounded-[16px] bg-[#d8d8d8] px-6 py-5 shadow-sm"
            >
              <h3 className="text-[18px] font-medium text-black">{item.title}</h3>
              <p className={`mt-4 text-[16px] ${item.color}`}>● {item.status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] bg-[#e5e5e5] p-6 shadow-md">
        <h2 className="mb-4 text-[22px] font-semibold text-black">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Link
            href="/adminPanel/page-management"
            className="rounded-[12px] bg-[#cfdcf0] px-6 py-4 shadow-sm"
          >
            Edit MG Info
          </Link>
          <Link
            href="/adminPanel/board-members"
            className="rounded-[12px] bg-[#ddccb0] px-6 py-4 shadow-sm"
          >
            + Add Board Member
          </Link>
          <Link
            href="/adminPanel/reports"
            className="rounded-[12px] bg-[#cfe6c9] px-6 py-4 shadow-sm"
          >
            Upload Report
          </Link>
          <Link
            href="/adminPanel/contact-details"
            className="rounded-[12px] bg-[#d9d9d9] px-6 py-4 shadow-sm"
          >
            Update Contacts
          </Link>
        </div>
      </section>
    </div>
  );
}