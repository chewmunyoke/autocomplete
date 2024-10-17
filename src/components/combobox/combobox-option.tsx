import cx from 'classnames'
import { useEffect, useRef } from 'react'

import type { ComboBoxOptionProps } from './types'

export function ComboBoxOption({
  children,
  id,
  index,
  isActive,
  isDirty,
  isSelected,
  onClick,
  setActiveIndex,
}: ComboBoxOptionProps) {
  const listItemRef = useRef<HTMLLIElement>(null)

  const handleMouseEnter = () => {
    setActiveIndex(index)
  }

  useEffect(() => {
    if (isActive && isDirty) {
      const listItem = listItemRef.current as HTMLLIElement
      listItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [isActive, isDirty])

  return (
    <li
      className={cx('group/li', {
        'is-active': isActive,
        'is-selected': isSelected,
      })}
      role="option"
      id={id}
      aria-selected={isSelected}
      ref={listItemRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
    >
      <div className="rounded-md p-2 transition-colors group-[.is-active]/li:bg-slate-200 group-[.is-selected]/li:font-bold group-[.is-selected]/li:text-cyan-500 motion-reduce:transition-none dark:focus:bg-slate-600 dark:group-[.is-active]/li:bg-slate-600 dark:group-[.is-selected]/li:text-cyan-400">
        {children}
      </div>
    </li>
  )
}
