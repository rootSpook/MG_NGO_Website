"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import {
  BylawItem,
  ReportItem,
  IbanDataItem,
  ContactDetailsItem,
  BoardMemberItem,
  SupporterItem,
  ManagedPageItem,
} from "@/types/adminPanel";
import {
  mockBylaws,
  mockReports,
  mockIbanData,
  mockContactDetails,
  mockBoardMembers,
  mockSupporters,
  mockManagedPages,
} from "@/lib/adminPanelMockData";

interface AdminPanelContextType {
  bylaws: BylawItem[];
  setBylaws: Dispatch<SetStateAction<BylawItem[]>>;
  addBylaw: (item: BylawItem) => void;
  updateBylaw: (id: string, updatedData: Partial<BylawItem>) => void;
  deleteBylaw: (id: string) => void;
  getBylawById: (id: string) => BylawItem | undefined;

  reports: ReportItem[];
  setReports: Dispatch<SetStateAction<ReportItem[]>>;
  addReport: (item: ReportItem) => void;
  updateReport: (id: string, updatedData: Partial<ReportItem>) => void;
  deleteReport: (id: string) => void;
  getReportById: (id: string) => ReportItem | undefined;

  ibanData: IbanDataItem;
  setIbanData: Dispatch<SetStateAction<IbanDataItem>>;
  updateIbanData: (updatedData: Partial<IbanDataItem>) => void;

  contactDetails: ContactDetailsItem;
  setContactDetails: Dispatch<SetStateAction<ContactDetailsItem>>;
  updateContactDetails: (updatedData: Partial<ContactDetailsItem>) => void;

  boardMembers: BoardMemberItem[];
  setBoardMembers: Dispatch<SetStateAction<BoardMemberItem[]>>;
  addBoardMember: (item: BoardMemberItem) => void;
  updateBoardMember: (id: string, updatedData: Partial<BoardMemberItem>) => void;
  deleteBoardMember: (id: string) => void;
  getBoardMemberById: (id: string) => BoardMemberItem | undefined;

  supporters: SupporterItem[];
  setSupporters: Dispatch<SetStateAction<SupporterItem[]>>;
  addSupporter: (item: SupporterItem) => void;
  updateSupporter: (id: string, updatedData: Partial<SupporterItem>) => void;
  deleteSupporter: (id: string) => void;
  getSupporterById: (id: string) => SupporterItem | undefined;

  managedPages: ManagedPageItem[];
  setManagedPages: Dispatch<SetStateAction<ManagedPageItem[]>>;
  updateManagedPage: (id: string, updatedData: Partial<ManagedPageItem>) => void;
  getManagedPageById: (id: string) => ManagedPageItem | undefined;
  addManagedPageToSite: (id: string) => void;
}

const AdminPanelContext = createContext<AdminPanelContextType | null>(null);

export function AdminPanelProvider({ children }: { children: ReactNode }) {
  const [bylaws, setBylaws] = useState<BylawItem[]>(mockBylaws);
  const [reports, setReports] = useState<ReportItem[]>(mockReports);
  const [ibanData, setIbanData] = useState<IbanDataItem>(mockIbanData);
  const [contactDetails, setContactDetails] =
    useState<ContactDetailsItem>(mockContactDetails);
  const [boardMembers, setBoardMembers] =
    useState<BoardMemberItem[]>(mockBoardMembers);
  const [supporters, setSupporters] = useState<SupporterItem[]>(mockSupporters);
  const [managedPages, setManagedPages] =
    useState<ManagedPageItem[]>(mockManagedPages);

  function addBylaw(item: BylawItem) {
    setBylaws((prev) => [item, ...prev]);
  }

  function updateBylaw(id: string, updatedData: Partial<BylawItem>) {
    setBylaws((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }

  function deleteBylaw(id: string) {
    setBylaws((prev) => prev.filter((item) => item.id !== id));
  }

  function getBylawById(id: string) {
    return bylaws.find((item) => item.id === id);
  }

  function addReport(item: ReportItem) {
    setReports((prev) => [item, ...prev]);
  }

  function updateReport(id: string, updatedData: Partial<ReportItem>) {
    setReports((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }

  function deleteReport(id: string) {
    setReports((prev) => prev.filter((item) => item.id !== id));
  }

  function getReportById(id: string) {
    return reports.find((item) => item.id === id);
  }

  function updateIbanData(updatedData: Partial<IbanDataItem>) {
    setIbanData((prev) => ({ ...prev, ...updatedData }));
  }

  function updateContactDetails(updatedData: Partial<ContactDetailsItem>) {
    setContactDetails((prev) => ({ ...prev, ...updatedData }));
  }

  function addBoardMember(item: BoardMemberItem) {
    setBoardMembers((prev) => [item, ...prev]);
  }

  function updateBoardMember(id: string, updatedData: Partial<BoardMemberItem>) {
    setBoardMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }

  function deleteBoardMember(id: string) {
    setBoardMembers((prev) => prev.filter((item) => item.id !== id));
  }

  function getBoardMemberById(id: string) {
    return boardMembers.find((item) => item.id === id);
  }

  function addSupporter(item: SupporterItem) {
    setSupporters((prev) => [item, ...prev]);
  }

  function updateSupporter(id: string, updatedData: Partial<SupporterItem>) {
    setSupporters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }

  function deleteSupporter(id: string) {
    setSupporters((prev) => prev.filter((item) => item.id !== id));
  }

  function getSupporterById(id: string) {
    return supporters.find((item) => item.id === id);
  }

  function updateManagedPage(id: string, updatedData: Partial<ManagedPageItem>) {
    setManagedPages((prev) =>
      prev.map((page) => (page.id === id ? { ...page, ...updatedData } : page))
    );
  }

  function getManagedPageById(id: string) {
    return managedPages.find((page) => page.id === id);
  }

  function addManagedPageToSite(id: string) {
    setManagedPages((prev) =>
      prev.map((page) =>
        page.id === id
          ? {
              ...page,
              status: "draft",
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : page
      )
    );
  }

  const value = useMemo(
    () => ({
      bylaws,
      setBylaws,
      addBylaw,
      updateBylaw,
      deleteBylaw,
      getBylawById,

      reports,
      setReports,
      addReport,
      updateReport,
      deleteReport,
      getReportById,

      ibanData,
      setIbanData,
      updateIbanData,

      contactDetails,
      setContactDetails,
      updateContactDetails,

      boardMembers,
      setBoardMembers,
      addBoardMember,
      updateBoardMember,
      deleteBoardMember,
      getBoardMemberById,

      supporters,
      setSupporters,
      addSupporter,
      updateSupporter,
      deleteSupporter,
      getSupporterById,

      managedPages,
      setManagedPages,
      updateManagedPage,
      getManagedPageById,
      addManagedPageToSite,
    }),
    [
      bylaws,
      reports,
      ibanData,
      contactDetails,
      boardMembers,
      supporters,
      managedPages,
    ]
  );

  return (
    <AdminPanelContext.Provider value={value}>
      {children}
    </AdminPanelContext.Provider>
  );
}

export function useAdminPanel() {
  const context = useContext(AdminPanelContext);

  if (!context) {
    throw new Error("useAdminPanel must be used within AdminPanelProvider");
  }

  return context;
}