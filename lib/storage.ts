import type { CityState, TravelRecord } from "./types";
const RECORDS = "xingji-records-v1";
const STATES = "xingji-city-states-v1";
export const readRecords = (): TravelRecord[] => typeof window === "undefined" ? [] : JSON.parse(localStorage.getItem(RECORDS) || "[]");
export const saveRecords = (records: TravelRecord[]) => localStorage.setItem(RECORDS, JSON.stringify(records));
export const readStates = (): CityState[] => typeof window === "undefined" ? [] : JSON.parse(localStorage.getItem(STATES) || "[]");
export const saveStates = (states: CityState[]) => localStorage.setItem(STATES, JSON.stringify(states));
