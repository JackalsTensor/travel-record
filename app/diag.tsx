"use client";
import { useEffect, useRef, useState } from "react";
import { probeStorage, readMirror, readRecords, readStates } from "@/lib/storage";

type Log = { t: string; msg: string };
type Snap = { origin: string; href: string; ua: string; time: string; keyCount: number; keys: string[]; recordsRawLen: number; records: number; states: number; mirror: number; probePrev: boolean; visits: number };

const readVisits = () => { try { const m = document.cookie.match(/(?:^|;\s*)xingji-visits=(\d+)/); return m ? parseInt(m[1], 10) : 0; } catch { return 0; } };
const getRaw = (k: string): string | null => { try { return localStorage.getItem(k); } catch { return null; } };

/** 手机可见的诊断面板：仅当 URL 带 ?diag=1 时渲染，不参与正常 UI。 */
export default function Diag({ records, lost, onClose }: { records: number; lost: boolean; onClose: () => void }) {
  const [snap, setSnap] = useState<Snap | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const mounted = useRef(false);
  const addLog = (msg: string) => setLogs(l => [...l.slice(-19), { t: new Date().toLocaleTimeString(), msg }]);
  const snapshot = (): Snap => {
    const keys: string[] = [];
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k) keys.push(k); } } catch { /* 枚举失败 */ }
    const raw = getRaw("xingji-records-v1");
    return { origin: location.origin, href: location.href, ua: navigator.userAgent, time: new Date().toLocaleString(), keyCount: keys.length, keys, recordsRawLen: raw ? raw.length : 0, records: readRecords().length, states: readStates().length, mirror: readMirror(), probePrev: probeStorage(), visits: readVisits() };
  };
  useEffect(() => { setSnap(snapshot()); addLog("页面加载：完成 storage 快照"); }, []);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; } // 跳过加载时的初始 records 变化，避免与快照重复
    const raw = getRaw("xingji-records-v1");
    addLog(`records 状态→${records} 条；立即 getItem 读回：${raw === null ? "键不存在" : `${readRecords().length} 条 / ${raw.length} 字节`}（origin=${location.origin}）`);
  }, [records]);
  return <div className="diag"><button className="diag-close" aria-label="关闭诊断面板" onClick={onClose}>×</button><p className="eyebrow">XINGJI / DIAG</p>{snap && <><p><b>origin</b> {snap.origin}</p><p><b>href</b> {snap.href}</p><p><b>时间</b> {snap.time}</p><p><b>UA</b> {snap.ua}</p><p><b>localStorage</b> {snap.keyCount} 个 key：{snap.keys.join("、") || "（无）"}</p><p><b>xingji-records-v1</b> {snap.recordsRawLen > 0 ? `${snap.recordsRawLen} 字节` : "不存在"}</p><p><b>loadRecords</b> {snap.records} 条 · states {snap.states} 条 · mirror {snap.mirror}</p><p><b>上一会话探针</b> {snap.probePrev ? "存活" : "不存在"}</p><p><b>cookie 访问计数</b> {snap.visits}</p><p><b>丢失判定</b> {lost ? "是 → 页面顶部应显示红色横幅" : "否"}</p><div className="diag-log">{logs.map((l, i) => <p key={i}><time>{l.t}</time> {l.msg}</p>)}</div><button className="diag-refresh" onClick={() => setSnap(snapshot())}>重新检测</button></>}</div>;
}
