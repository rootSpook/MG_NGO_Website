import { serverTimestamp, type FieldValue } from "firebase/firestore";

// ─────────────────────────────────────────────────────────────────────────────
// Metadata helpers
//
// These helpers return plain objects that are spread into Firestore write
// payloads. They use serverTimestamp() so the timestamp is set by Firestore
// on the server, not by the client clock.
// ─────────────────────────────────────────────────────────────────────────────

/** Returns createdAt + updatedAt fields for a new document. */
export function createMetadata(): { createdAt: FieldValue; updatedAt: FieldValue } {
  return {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

/** Returns only the updatedAt field for an existing document update. */
export function updateMetadata(): { updatedAt: FieldValue } {
  return {
    updatedAt: serverTimestamp(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Soft delete helper
//
// Collections that support soft deletion store a `deletedAt` timestamp instead
// of being physically removed. This allows the Security Rules to filter them
// out of public reads while preserving the data for audit purposes.
//
// Affected collections: contentItems, mediaAssets, contactMessages
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the fields needed to mark a document as soft-deleted. */
export function softDeleteMetadata(): { deletedAt: FieldValue; updatedAt: FieldValue } {
  return {
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}
