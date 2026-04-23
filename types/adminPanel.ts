export type BylawStatus = "active" | "archived";
export type ManagedPageStatus = "published" | "draft" | "not-added";
export type ManagedPageType = "page" | "donation";

export interface BylawItem {
  id: string;
  date: string;
  title: string;
  version: string;
  type: string;
  uploadedBy: string;
  status: BylawStatus;
  fileUrl?: string;
}

export type ReportStatus = "published" | "archived";

export interface ReportItem {
  id: string;
  year: string;
  title: string;
  category: string;
  fileSize: string;
  uploadDate: string;
  status: ReportStatus;
  fileType: "PDF" | "DOCX";
  uploadedBy: string;
  fileUrl?: string;
}

export interface IbanDataItem {
  ibanNumber: string;
  bankName: string;
  accountHolderName: string;
  branchName: string;
  bicSwiftCode: string;
  currency: string;
  accountType: string;
}

export interface ContactDetailsItem {
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  emailAddress: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

export interface BoardMemberItem {
  id: string;
  fullName: string;
  roleTitle: string;
  period: string;
  specialization: string;
  photoUrl?: string;
}

export interface SupporterItem {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;

  since: string; // YYYY-MM-DD
  description?: string;
}

export interface ManagedPageSection {
  id: string;
  label: string;
  editorTitle: string;
  content: string;
  imageUrl?: string;
}

export interface ManagedPageItem {
  id: string;
  name: string;
  type: ManagedPageType;
  status: ManagedPageStatus;
  updatedAt: string;
  sections: ManagedPageSection[];
}