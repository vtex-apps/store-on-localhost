declare global {
  
}

interface Window extends Window, GlobalThis {
  pixelManagerEvents: any[]
  Element: any
}