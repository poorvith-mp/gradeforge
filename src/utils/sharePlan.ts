import type { GradeState } from '../types/grade.ts';
import { validateState } from './storage.ts';

const MAX_URL_LENGTH = 8000;
const MAX_PAYLOAD_BYTES = 64 * 1024; // 64 KB pre-inflate cap

export interface ShareEncodeResult {
  success: boolean;
  url?: string;
  hash?: string;
  error?: string;
}

export interface ShareDecodeResult {
  success: boolean;
  state?: GradeState;
  error?: string;
}

function bytesToBase64url(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = typeof btoa === 'function'
    ? btoa(binary)
    : Buffer.from(bytes).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBytes(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  if (typeof atob === 'function') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

async function deflateBytes(bytes: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream('deflate-raw');
  const writer = cs.writable.getWriter();
  writer.write(bytes as unknown as BufferSource);
  writer.close();
  const chunks: Uint8Array[] = [];
  const reader = cs.readable.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

async function inflateBytes(bytes: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream('deflate-raw');
  const writer = ds.writable.getWriter();
  writer.write(bytes as unknown as BufferSource);
  writer.close();
  const chunks: Uint8Array[] = [];
  const reader = ds.readable.getReader();
  let totalLength = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      totalLength += value.length;
      if (totalLength > 1024 * 1024) {
        throw new Error('Decompressed payload exceeded safety limit');
      }
      chunks.push(value);
    }
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

export function extractSharablePayload(state: GradeState): Record<string, unknown> {
  const isCustom = state.customScales.some((s) => s.id === state.selectedScaleId);
  return {
    s: state.selectedScaleId,
    c: isCustom ? state.customScales.filter((s) => s.id === state.selectedScaleId) : [],
    m: state.semesters.map((sem) => ({
      i: sem.id,
      n: sem.name,
      b: sem.subjects.map((sub) => ({
        i: sub.id,
        n: sub.name,
        c: sub.credits,
        g: sub.gradeLabel,
      })),
    })),
  };
}

export function reconstructSharableState(payload: unknown): GradeState | null {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Record<string, unknown>;
  const rawState: Record<string, unknown> = {
    selectedScaleId: p.s ?? p.selectedScaleId,
    customScales: p.c ?? p.customScales ?? [],
    semesters: Array.isArray(p.m)
      ? (p.m as Record<string, unknown>[]).map((sem) => ({
          id: sem.i ?? sem.id,
          name: sem.n ?? sem.name,
          subjects: Array.isArray(sem.b)
            ? (sem.b as Record<string, unknown>[]).map((sub) => ({
                id: sub.i ?? sub.id,
                name: sub.n ?? sub.name,
                credits: sub.c ?? sub.credits,
                gradeLabel: sub.g ?? sub.gradeLabel,
              }))
            : sem.subjects,
        }))
      : (p.semesters ?? []),
  };
  return validateState(rawState);
}

export async function encodePlanToUrl(
  state: GradeState,
  baseUrl: string = 'https://gradeforge.poorvithmp.com/calculator'
): Promise<ShareEncodeResult> {
  try {
    const payload = extractSharablePayload(state);
    const jsonStr = JSON.stringify(payload);
    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(jsonStr);

    let prefix = 'planr=';
    let encodedData: string;

    if (typeof CompressionStream !== 'undefined') {
      const deflated = await deflateBytes(utf8Bytes);
      encodedData = bytesToBase64url(deflated);
      prefix = 'plan=';
    } else {
      encodedData = bytesToBase64url(utf8Bytes);
    }

    const hash = `#${prefix}${encodedData}`;
    const fullUrl = `${baseUrl}${hash}`;

    if (fullUrl.length > MAX_URL_LENGTH) {
      return {
        success: false,
        error: 'Plan is too large to share via link (> 8,000 characters). Please use JSON export instead.',
      };
    }

    return {
      success: true,
      url: fullUrl,
      hash,
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to encode plan: ${(err as Error).message}`,
    };
  }
}

export async function decodePlanFromHash(hashString: string): Promise<ShareDecodeResult> {
  try {
    const cleanHash = hashString.startsWith('#') ? hashString.slice(1) : hashString;
    if (!cleanHash) {
      return { success: false, error: 'Empty plan hash' };
    }

    let isCompressed = false;
    let base64Data = '';

    if (cleanHash.startsWith('plan=')) {
      isCompressed = true;
      base64Data = cleanHash.slice(5);
    } else if (cleanHash.startsWith('planr=')) {
      isCompressed = false;
      base64Data = cleanHash.slice(6);
    } else {
      return { success: false, error: 'This link is invalid' };
    }

    if (base64Data.length > MAX_PAYLOAD_BYTES) {
      return { success: false, error: 'Shared plan payload exceeds the 64 KB safety limit.' };
    }

    const rawBytes = base64urlToBytes(base64Data);
    if (rawBytes.length > MAX_PAYLOAD_BYTES) {
      return { success: false, error: 'Shared plan payload exceeds the 64 KB safety limit.' };
    }

    let jsonBytes: Uint8Array;
    if (isCompressed) {
      if (typeof DecompressionStream === 'undefined') {
        return { success: false, error: 'Browser does not support DecompressionStream.' };
      }
      jsonBytes = await inflateBytes(rawBytes);
    } else {
      jsonBytes = rawBytes;
    }

    const decoder = new TextDecoder();
    const jsonStr = decoder.decode(jsonBytes);
    const parsed = JSON.parse(jsonStr);

    const validated = reconstructSharableState(parsed);
    if (!validated) {
      return { success: false, error: 'This link is invalid' };
    }

    return {
      success: true,
      state: validated,
    };
  } catch {
    return {
      success: false,
      error: 'This link is invalid',
    };
  }
}
