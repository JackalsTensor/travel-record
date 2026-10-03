import type { CityState, TravelRecord } from "./types";
const RECORDS = "xingji-records-v1";
const STATES = "xingji-city-states-v1";
/** 容错读取：损坏 JSON 或非数组时返回 []，避免整个页面因脏数据崩溃。 */
const parseArray = <T,>(raw: string | null): T[] => { if (!raw) return []; try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : []; } catch { return []; } };
export const readRecords = (): TravelRecord[] => typeof window === "undefined" ? [] : parseArray<TravelRecord>(localStorage.getItem(RECORDS));
/** 保存成功返回 true；配额超限等失败返回 false（不再抛异常，让调用方可见地处理）。 */
export const saveRecords = (records: TravelRecord[]): boolean => { try { localStorage.setItem(RECORDS, JSON.stringify(records)); return true; } catch { return false; } };
export const readStates = (): CityState[] => typeof window === "undefined" ? [] : parseArray<CityState>(localStorage.getItem(STATES));
export const saveStates = (states: CityState[]): boolean => { try { localStorage.setItem(STATES, JSON.stringify(states)); return true; } catch { return false; } };
const PROBE = "xingji-storage-probe-v1"; // 每次加载写入时间戳，下次加载检查上一会话的探针是否还在
const MIRROR = "xingji-records-mirror-v1"; // 上次成功保存时的记录条数（仅诊断用，不参与业务读写）
/** 返回 true 表示上一次会话写入的探针仍然存在（localStorage 可跨会话持久化）。 */
export const probeStorage = (): boolean => { try { const prev = localStorage.getItem(PROBE); localStorage.setItem(PROBE, String(Date.now())); return prev !== null; } catch { return false; } };
export const writeMirror = (count: number): void => { try { localStorage.setItem(MIRROR, String(count)); } catch { /* 镜像失败不影响主流程 */ } };
export const readMirror = (): number => { try { const n = parseInt(localStorage.getItem(MIRROR) || "0", 10); return Number.isFinite(n) ? n : 0; } catch { return 0; } };
