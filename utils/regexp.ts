export const getFirstImageFromMarkdown = (markdown: string) =>
  /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g.exec(markdown)?.[1]
