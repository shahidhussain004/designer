// Lightweight re-exports so imports using "@/lib/utils" resolve correctly.
// This file forwards to the design-system utils implementation used elsewhere
// in the repo. It keeps the public surface small (only `cn`) so existing
// imports in components continue to work without changing many files.

export { cn } from "./design-system/utils";

export type { VariantProps } from "./design-system/utils";
