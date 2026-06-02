export const createSlug = (title, id) => {
  if (!title) return id;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${slug}-${id}`;
};
