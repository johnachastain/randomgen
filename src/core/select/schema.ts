// core/select — Zod schema + validation for the Row/Table content format (design target E).
//
// Separate from index.ts so the selection ENGINE stays dependency-free; importing this module opts
// into zod. Validates tables loaded as DATA (design target F: "a table as data, not code") — catching
// malformed rows before they reach pickWeighted.

import { z } from "zod"
import type { Table } from "./index"

// A Row is the positional tuple [value, tags[], weight]. Value non-empty; weight a finite, nonnegative
// number (0 = a row pickWeighted skips; negatives are authoring errors).
export const RowSchema = z.tuple([
  z.string().min(1),
  z.array(z.string()),
  z.number().finite().nonnegative(),
])

export const TableSchema = z.array(RowSchema)

export type ValidateResult =
  | { ok: true; table: Table }
  | { ok: false; errors: string[] }

// Parse unknown data (e.g. a JSON-loaded table) into a typed Table, or a list of readable errors.
export function validateTable(data: unknown): ValidateResult {
  const res = TableSchema.safeParse(data)
  if (res.success) return { ok: true, table: res.data as Table }
  return { ok: false, errors: res.error.issues.map(i => `${i.path.join(".") || "(root)"}: ${i.message}`) }
}
