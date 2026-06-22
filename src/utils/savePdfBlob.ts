import {
  getPersistedFileHandle,
  removePersistedFileHandle,
  setPersistedFileHandle,
} from '@/utils/persistedFileHandleDb';

type SaveFilePickerOptions = {
  suggestedName?: string;
  types?: Array<{ description: string; accept: Record<string, string[]> }>;
  /** Chromium: open picker in Downloads for faster replace workflow */
  startIn?: 'downloads' | 'documents' | 'desktop';
};

type WindowWithSaveFilePicker = Window &
  typeof globalThis & {
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  };

const pdfPickerTypes: SaveFilePickerOptions['types'] = [
  { description: 'PDF document', accept: { 'application/pdf': ['.pdf'] } },
];

function namesMatch(handleName: string, suggestedName: string): boolean {
  return handleName.localeCompare(suggestedName, undefined, { sensitivity: 'accent' }) === 0;
}

/** Chromium extends file handles with permission helpers (not in all TypeScript DOM libs). */
type FileHandlePermission = FileSystemFileHandle & {
  queryPermission?: (descriptor: { mode: 'readwrite' }) => Promise<PermissionState>;
  requestPermission?: (descriptor: { mode: 'readwrite' }) => Promise<PermissionState>;
};

async function tryWriteWithPersistedHandle(
  blob: Blob,
  suggestedName: string,
  persistKey: string,
): Promise<boolean> {
  let handle: FileSystemFileHandle | undefined;
  try {
    handle = await getPersistedFileHandle(persistKey);
  } catch {
    return false;
  }
  if (!handle || !namesMatch(handle.name, suggestedName)) {
    return false;
  }

  const fh = handle as FileHandlePermission;
  try {
    if (typeof fh.queryPermission === 'function') {
      let perm = await fh.queryPermission({ mode: 'readwrite' });
      if (perm === 'prompt' && typeof fh.requestPermission === 'function') {
        perm = await fh.requestPermission({ mode: 'readwrite' });
      }
      if (perm !== 'granted') {
        await removePersistedFileHandle(persistKey);
        return false;
      }
    }
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return true;
  } catch {
    await removePersistedFileHandle(persistKey);
    return false;
  }
}

export type SavePdfBlobOptions = {
  /** If set, after the first successful save-picker write, reuse that file for silent overwrite when the filename still matches. */
  persistKey: string;
};

/**
 * Saves a PDF: prefers a remembered file handle (smooth overwrite), else File System Access
 * save picker (starts in Downloads), else classic download fallback.
 */
export async function savePdfBlob(
  blob: Blob,
  suggestedName: string,
  fallbackDownload: () => void,
  options?: SavePdfBlobOptions,
): Promise<void> {
  const w = window as WindowWithSaveFilePicker;
  if (typeof w.showSaveFilePicker !== 'function') {
    fallbackDownload();
    return;
  }

  const persistKey = options?.persistKey;
  if (persistKey) {
    const wrote = await tryWriteWithPersistedHandle(blob, suggestedName, persistKey);
    if (wrote) return;
  }

  try {
    const handle = await w.showSaveFilePicker({
      suggestedName,
      types: pdfPickerTypes,
      startIn: 'downloads',
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    if (persistKey) {
      await setPersistedFileHandle(persistKey, handle);
    }
    return;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return;
    }
  }

  fallbackDownload();
}
