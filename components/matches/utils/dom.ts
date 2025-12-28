export type ContainerOffsets = { left: number; right: number };

export function readHorizontalPadding(container: HTMLElement): ContainerOffsets {
  const styles = window.getComputedStyle(container);
  const left = Number.parseInt(styles.paddingLeft || "0", 10) || 0;
  const right = Number.parseInt(styles.paddingRight || "0", 10) || 0;
  return { left, right };
}
