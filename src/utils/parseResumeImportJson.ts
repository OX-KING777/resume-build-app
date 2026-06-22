/**
 * Escape inner text so it is safe inside a JSON double-quoted string.
 * Preserves common JSON escape pairs (e.g. \\n as two chars) when already present.
 */
function escapeInnerForJsonString(inner: string): string {
  let out = '';
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    const cp = c.charCodeAt(0);

    if (c === '\\') {
      const next = inner[i + 1];
      if (
        next === '\\' ||
        next === '"' ||
        next === '/' ||
        next === 'b' ||
        next === 'f' ||
        next === 'n' ||
        next === 'r' ||
        next === 't'
      ) {
        out += c + next;
        i++;
        continue;
      }
      if (next === 'u' && /^[0-9a-fA-F]{4}/.test(inner.slice(i + 2, i + 6))) {
        out += inner.slice(i, i + 6);
        i += 5;
        continue;
      }
      out += '\\\\';
      continue;
    }

    if (c === '"') {
      out += '\\"';
      continue;
    }

    if (cp === 9) {
      out += '\\t';
      continue;
    }
    if (cp === 10) {
      out += '\\n';
      continue;
    }
    if (cp === 13) {
      if (inner[i + 1] === '\n') {
        out += '\\n';
        i++;
      } else {
        out += '\\r';
      }
      continue;
    }
    if (cp < 32) {
      out += `\\u${cp.toString(16).padStart(4, '0')}`;
      continue;
    }

    out += c;
  }
  return out;
}

/**
 * If "Cover Letter" has raw newlines / tabs inside the quotes, re-escape that value so JSON.parse succeeds.
 */
function tryRepairCoverLetterMultilineString(raw: string): string | null {
  const marker = '"Cover Letter"';
  const mi = raw.indexOf(marker);
  if (mi === -1) return null;

  let j = mi + marker.length;
  while (j < raw.length && /\s/.test(raw[j])) j++;
  if (raw[j] !== ':') return null;
  j++;
  while (j < raw.length && /\s/.test(raw[j])) j++;
  if (raw[j] !== '"') return null;

  const valueStart = j + 1;
  let escaped = false;
  let k = valueStart;
  let needsRepair = false;

  while (k < raw.length) {
    const c = raw[k];
    if (escaped) {
      escaped = false;
      k++;
      continue;
    }
    if (c === '\\') {
      escaped = true;
      k++;
      continue;
    }
    if (c === '"') {
      const inner = raw.slice(valueStart, k);
      if (!needsRepair) return null;
      const escapedInner = escapeInnerForJsonString(inner);
      return raw.slice(0, valueStart) + escapedInner + raw.slice(k);
    }

    const code = c.charCodeAt(0);
    if (code === 9 || code === 10 || code === 13 || code < 32) {
      needsRepair = true;
    }
    k++;
  }

  return null;
}

function enhanceJsonParseError(e: unknown): Error {
  const base = e instanceof Error ? e.message : String(e);
  if (/control character|Bad control/i.test(base)) {
    return new Error(
      `${base} Tip: every line break inside "Cover Letter" must be written as \\n in the JSON, not as a real new line. Remove any text accidentally pasted inside that string (for example editor or terminal output).`,
    );
  }
  return e instanceof Error ? e : new Error(String(e));
}

/** Parse pasted resume JSON; repairs common multiline Cover Letter mistakes, then throws a helpful error if still invalid. */
export function parseResumeImportJson(jsonStr: string): unknown {
  const trimmed = jsonStr.trim();
  try {
    return JSON.parse(trimmed);
  } catch (first) {
    const repaired = tryRepairCoverLetterMultilineString(trimmed);
    if (repaired !== null) {
      try {
        return JSON.parse(repaired);
      } catch (second) {
        throw enhanceJsonParseError(second);
      }
    }
    throw enhanceJsonParseError(first);
  }
}
