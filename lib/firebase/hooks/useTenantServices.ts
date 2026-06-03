"use client";

/**
 * useTenantServices — the bridge between service functions and UI components.
 *
 * Problem solved (Trap 3 from the review):
 *   After refactoring service files to accept `db`/`auth`/`storage` as
 *   parameters, UI components would have to call:
 *     const { db } = useTenantFirebase();
 *     const result = await getSiteSettings(db);
 *   on every single call — repetitive and noisy.
 *
 * Solution:
 *   This hook returns fully-bound versions of the service functions. Each
 *   returned function has the same signature as the original, minus the first
 *   `db`/`auth`/`storage` argument, which is automatically applied from the
 *   current tenant context.
 *
 *   UI components call:
 *     const { getSiteSettings } = useTenantServices();
 *     const settings = await getSiteSettings();
 *
 * Usage:
 *   Only use inside Client Components (or other "use client" hooks).
 *   Server Components should import service functions directly and pass `db`
 *   from the server-side Firebase admin lookup.
 */

import { useMemo } from "react";
import { useTenantFirebase } from "../TenantFirebaseContext";

// ── Public services (read-only, no auth required) ────────────────────────────
import * as publicSvc from "../services";
// ── Nav services ─────────────────────────────────────────────────────────────
import * as navSvc from "../navServices";
// ── Admin services ────────────────────────────────────────────────────────────
import * as adminSvc from "../adminServices";
// ── Editor services ────────────────────────────────────────────────────────────
import * as editorSvc from "../editorServices";
// ── Storage utils ─────────────────────────────────────────────────────────────
import * as storageSvc from "../storageUtils";

export function useTenantServices() {
  const { db, auth, storage } = useTenantFirebase();

  return useMemo(() => ({
    // ── Public read functions ──────────────────────────────────────────────
    getSiteSettings:           () => publicSvc.getSiteSettings(db),
    getPublishedContentByType: (type: Parameters<typeof publicSvc.getPublishedContentByType>[1]) =>
                                 publicSvc.getPublishedContentByType(db, type),
    getContentBySlug:          (slug: string) => publicSvc.getContentBySlug(db, slug),
    getPublishedEvents:        () => publicSvc.getPublishedEvents(db),
    getCategories:             () => publicSvc.getCategories(db),
    getTags:                   () => publicSvc.getTags(db),
    getPublicMediaAssets:      () => publicSvc.getPublicMediaAssets(db),
    getActiveCampaigns:        () => publicSvc.getActiveCampaigns(db),
    getPublicIbanEntries:      () => publicSvc.getPublicIbanEntries(db),
    getPublicSupporters:       () => publicSvc.getPublicSupporters(db),
    submitVolunteerApplication: (data: Parameters<typeof publicSvc.submitVolunteerApplication>[1]) =>
                                  publicSvc.submitVolunteerApplication(db, data),
    submitContactMessage:      (data: Parameters<typeof publicSvc.submitContactMessage>[1]) =>
                                  publicSvc.submitContactMessage(db, data),

    // ── Logo settings ──────────────────────────────────────────────────────
    getLogoSettings: async () => {
      const s = await publicSvc.getSiteSettings(db);
      return s?.logoSettings ?? null;
    },

    // ── Nav functions ──────────────────────────────────────────────────────
    getNavConfig:   () => navSvc.getNavConfig(db),
    saveNavConfig:  (items: Parameters<typeof navSvc.saveNavConfig>[1]) =>
                      navSvc.saveNavConfig(db, items),
    createNavItem:  (item: Parameters<typeof navSvc.createNavItem>[1]) =>
                      navSvc.createNavItem(db, item),
    deleteNavItem:  (key: string) => navSvc.deleteNavItem(db, key),
    patchNavItem:   (key: string, patch: Parameters<typeof navSvc.patchNavItem>[2]) =>
                      navSvc.patchNavItem(db, key, patch),

    // ── Admin functions ────────────────────────────────────────────────────
    getAdminDashboardStats:      () => adminSvc.getAdminDashboardStats({ db, auth }),
    getBoardMembers:             () => adminSvc.getBoardMembers({ db, auth }),
    createBoardMember:           (m: Parameters<typeof adminSvc.createBoardMember>[1]) =>
                                   adminSvc.createBoardMember({ db, auth }, m),
    updateBoardMember:           (id: string, d: Parameters<typeof adminSvc.updateBoardMember>[2]) =>
                                   adminSvc.updateBoardMember({ db, auth }, id, d),
    deleteBoardMember:           (id: string) => adminSvc.deleteBoardMember({ db, auth }, id),
    getSupporters:               () => adminSvc.getSupporters({ db, auth }),
    createSupporter:             (s: Parameters<typeof adminSvc.createSupporter>[1]) =>
                                   adminSvc.createSupporter({ db, auth }, s),
    updateSupporter:             (id: string, d: Parameters<typeof adminSvc.updateSupporter>[2]) =>
                                   adminSvc.updateSupporter({ db, auth }, id, d),
    deleteSupporter:             (id: string) => adminSvc.deleteSupporter({ db, auth }, id),
    getIbanEntries:              () => adminSvc.getIbanEntries({ db, auth }),
    createIbanEntry:             (e: Parameters<typeof adminSvc.createIbanEntry>[1]) =>
                                   adminSvc.createIbanEntry({ db, auth }, e),
    updateIbanEntry:             (id: string, d: Parameters<typeof adminSvc.updateIbanEntry>[2]) =>
                                   adminSvc.updateIbanEntry({ db, auth }, id, d),
    deleteIbanEntry:             (id: string) => adminSvc.deleteIbanEntry({ db, auth }, id),
    getAdminReports:             () => adminSvc.getAdminReports({ db, auth }),
    createAdminReport:           (r: Parameters<typeof adminSvc.createAdminReport>[1]) =>
                                   adminSvc.createAdminReport({ db, auth }, r),
    updateAdminReport:           (id: string, d: Parameters<typeof adminSvc.updateAdminReport>[2]) =>
                                   adminSvc.updateAdminReport({ db, auth }, id, d),
    deleteAdminReport:           (id: string) => adminSvc.deleteAdminReport({ db, auth }, id),
    getAdminPageBySlug:          (slug: string) => adminSvc.getAdminPageBySlug({ db, auth }, slug),
    getAdminPageDataBySlug:      (slug: string) => adminSvc.getAdminPageDataBySlug({ db, auth }, slug),
    getAdminPages:               () => adminSvc.getAdminPages({ db, auth }),
    upsertAdminPage:             (...args: Parameters<typeof adminSvc.upsertAdminPage> extends [unknown, ...infer R] ? R : never) =>
                                   adminSvc.upsertAdminPage({ db, auth }, ...args),
    getAdminSiteSettings:        () => adminSvc.getAdminSiteSettings({ db, auth }),
    updateAdminSiteSettings:     (d: Parameters<typeof adminSvc.updateAdminSiteSettings>[1]) =>
                                   adminSvc.updateAdminSiteSettings({ db, auth }, d),
    getContactMessages:          () => adminSvc.getContactMessages({ db, auth }),
    updateContactMessageStatus:  (...args: Parameters<typeof adminSvc.updateContactMessageStatus> extends [unknown, ...infer R] ? R : never) =>
                                   adminSvc.updateContactMessageStatus({ db, auth }, ...args),
    getPageBlocks:               (slug: string) => adminSvc.getPageBlocks({ db, auth }, slug),
    savePageBlocks:              (...args: Parameters<typeof adminSvc.savePageBlocks> extends [unknown, ...infer R] ? R : never) =>
                                   adminSvc.savePageBlocks({ db, auth }, ...args),
    upsertPageContent:           (slug: string, data: Parameters<typeof adminSvc.upsertPageContent>[2]) =>
                                   adminSvc.upsertPageContent({ db, auth }, slug, data),
    updateStaffPhotoURL:         (uid: string, photoURL: string) =>
                                   adminSvc.updateStaffPhotoURL({ db, auth }, uid, photoURL),
    getStaffMember:              (uid: string) => adminSvc.getStaffMember({ db, auth }, uid),

    // ── Editor functions ───────────────────────────────────────────────────
    getEditorBlogs:              () => editorSvc.getEditorBlogs({ db, auth }),
    createEditorBlog:            (b: Parameters<typeof editorSvc.createEditorBlog>[1]) =>
                                   editorSvc.createEditorBlog({ db, auth }, b),
    updateEditorBlog:            (id: string, d: Parameters<typeof editorSvc.updateEditorBlog>[2]) =>
                                   editorSvc.updateEditorBlog({ db, auth }, id, d),
    deleteEditorBlog:            (id: string) => editorSvc.deleteEditorBlog({ db, auth }, id),
    getEditorEvents:             () => editorSvc.getEditorEvents({ db, auth }),
    createEditorEvent:           (e: Parameters<typeof editorSvc.createEditorEvent>[1]) =>
                                   editorSvc.createEditorEvent({ db, auth }, e),
    updateEditorEvent:           (id: string, d: Parameters<typeof editorSvc.updateEditorEvent>[2]) =>
                                   editorSvc.updateEditorEvent({ db, auth }, id, d),
    deleteEditorEvent:           (id: string) => editorSvc.deleteEditorEvent({ db, auth }, id),
    getEditorMedia:              () => editorSvc.getEditorMedia({ db, auth }),
    createEditorMedia:           (m: Parameters<typeof editorSvc.createEditorMedia>[1]) =>
                                   editorSvc.createEditorMedia({ db, auth }, m),
    updateEditorMedia:           (id: string, d: Parameters<typeof editorSvc.updateEditorMedia>[2]) =>
                                   editorSvc.updateEditorMedia({ db, auth }, id, d),
    deleteEditorMedia:           (id: string) => editorSvc.deleteEditorMedia({ db, auth }, id),
    getEditorAnnouncements:      () => editorSvc.getEditorAnnouncements({ db, auth }),
    createEditorAnnouncement:    (a: Parameters<typeof editorSvc.createEditorAnnouncement>[1]) =>
                                   editorSvc.createEditorAnnouncement({ db, auth }, a),
    updateEditorAnnouncement:    (id: string, d: Parameters<typeof editorSvc.updateEditorAnnouncement>[2]) =>
                                   editorSvc.updateEditorAnnouncement({ db, auth }, id, d),
    deleteEditorAnnouncement:    (id: string) => editorSvc.deleteEditorAnnouncement({ db, auth }, id),
    getEditorNotifications:      () => editorSvc.getEditorNotifications({ db, auth }),
    markNotificationRead:        (id: string) => editorSvc.markNotificationRead({ db, auth }, id),
    getEditorCampaigns:          () => editorSvc.getEditorCampaigns({ db, auth }),
    createEditorCampaign:        (c: Parameters<typeof editorSvc.createEditorCampaign>[1]) =>
                                   editorSvc.createEditorCampaign({ db, auth }, c),
    updateEditorCampaign:        (id: string, d: Parameters<typeof editorSvc.updateEditorCampaign>[2]) =>
                                   editorSvc.updateEditorCampaign({ db, auth }, id, d),
    deleteEditorCampaign:        (id: string) => editorSvc.deleteEditorCampaign({ db, auth }, id),
    getEditorCategories:         (type?: string) => editorSvc.getEditorCategories({ db, auth }, type),
    createEditorCategory:        (c: Parameters<typeof editorSvc.createEditorCategory>[1]) =>
                                   editorSvc.createEditorCategory({ db, auth }, c),
    updateEditorCategory:        (id: string, d: Parameters<typeof editorSvc.updateEditorCategory>[2]) =>
                                   editorSvc.updateEditorCategory({ db, auth }, id, d),
    deleteEditorCategory:        (id: string) => editorSvc.deleteEditorCategory({ db, auth }, id),
    getEditorTags:               (type?: string) => editorSvc.getEditorTags({ db, auth }, type),
    createEditorTag:             (t: Parameters<typeof editorSvc.createEditorTag>[1]) =>
                                   editorSvc.createEditorTag({ db, auth }, t),
    updateEditorTag:             (id: string, d: Parameters<typeof editorSvc.updateEditorTag>[2]) =>
                                   editorSvc.updateEditorTag({ db, auth }, id, d),
    deleteEditorTag:             (id: string) => editorSvc.deleteEditorTag({ db, auth }, id),

    // ── Storage ────────────────────────────────────────────────────────────
    uploadImage:      (file: File)   => storageSvc.uploadImage(storage, file),
    deleteImageByUrl: (url: string)  => storageSvc.deleteImageByUrl(storage, url),
  }), [db, auth, storage]);
}
