const flags = {
  RENDER_NAVIGATION: true,
  VTEX_ASSETS_URL: true,
}

export const isEnabled = (flag: keyof typeof flags) => flags[flag]
