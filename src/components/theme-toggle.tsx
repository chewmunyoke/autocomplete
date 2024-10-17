import { useEffect, useState } from 'react'

import IcMoon from '../assets/moon.svg'
import IcSun from '../assets/sun.svg'

type ThemeType = 'light' | 'dark'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeType>('light')

  const handleChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme') as ThemeType
    if (currentTheme) {
      setTheme(currentTheme)
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  return (
    <label
      className="fixed right-4 top-4 block cursor-pointer rounded-full bg-cyan-500 p-3 text-slate-100 shadow-lg transition-colors hover:bg-cyan-600 motion-reduce:transition-none dark:bg-cyan-700 dark:hover:bg-cyan-800"
      htmlFor="mode-toggle"
    >
      <input
        className="focus:outline-primary with-focus-ring absolute inset-0 cursor-pointer appearance-none rounded-full border-transparent dark:focus:border-cyan-500 dark:focus:ring-cyan-300"
        type="checkbox"
        role="switch"
        id="theme-toggle"
        aria-checked={theme === 'dark'}
        checked={theme === 'dark'}
        onChange={handleChange}
      />
      <IcSun className="dark:hidden" width={24} height={24} />
      <IcMoon className="hidden dark:block" width={24} height={24} />
      <span className="sr-only">Toggle light / dark mode</span>
    </label>
  )
}
