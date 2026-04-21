export const DEFAULT_MEMBER_COLORS = [
  "#7EB8C9",
  "#C97E8A",
  "#85C98A",
  "#C9A84C",
  "#A07EC9",
  "#C9907E",
  "#7EC9B8",
]

export function createDefaultMemberForm() {
  return {
    name: "",
    email: "",
    password: "",
    role: "member",
    color: DEFAULT_MEMBER_COLORS[0],
  }
}

export function formatDisplayDate(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function getRandomMemberColor() {
  return DEFAULT_MEMBER_COLORS[Math.floor(Math.random() * DEFAULT_MEMBER_COLORS.length)]
}
