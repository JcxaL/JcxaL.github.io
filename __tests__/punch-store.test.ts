/**
 * punchStore — the persistent ticket record (localStorage-backed).
 */
import {
  punchStation,
  clearPunches,
  getPunches,
  _resetPunchStore,
} from "@/lib/ticket/punchStore";

describe("punchStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
    _resetPunchStore();
  });

  it("starts with an empty journey", () => {
    expect(getPunches()).toEqual([]);
  });

  it("punches station codes in first-visit order, idempotently", () => {
    punchStation("X01");
    punchStation("B02");
    punchStation("X01");
    expect(getPunches()).toEqual(["X01", "B02"]);
  });

  it("persists the journey across a fresh module read", () => {
    punchStation("A01");
    _resetPunchStore();
    expect(getPunches()).toEqual(["A01"]);
  });

  it("tears up the ticket on clear", () => {
    punchStation("A01");
    clearPunches();
    expect(getPunches()).toEqual([]);
    expect(window.localStorage.getItem("jccl.ticket.v1")).toBeNull();
  });

  it("survives corrupted or foreign stored data", () => {
    window.localStorage.setItem("jccl.ticket.v1", "not json {");
    _resetPunchStore();
    expect(getPunches()).toEqual([]);

    window.localStorage.setItem(
      "jccl.ticket.v1",
      JSON.stringify({ v: 99, punches: "nope" }),
    );
    _resetPunchStore();
    expect(getPunches()).toEqual([]);
  });

  it("filters codes that are not station codes", () => {
    window.localStorage.setItem(
      "jccl.ticket.v1",
      JSON.stringify({ v: 1, punches: ["B02", "<script>", "zzz", "A01"] }),
    );
    _resetPunchStore();
    expect(getPunches()).toEqual(["B02", "A01"]);
  });
});
