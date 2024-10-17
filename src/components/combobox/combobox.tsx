import {
  autoUpdate,
  offset,
  size,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import cx from 'classnames'
import { useEffect, useId, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { CSSTransition } from 'react-transition-group'

import IcSearchX from '../../assets/search-x.svg'
import IcSearch from '../../assets/search.svg'
import IcSpinner from '../../assets/spinner.svg'
import { ComboBoxOption } from './combobox-option'
import { ComboBoxTag } from './combobox-tag'
import type { ComboBoxProps, Option } from './types'

export function ComboBox({
  description,
  disabled = false,
  filterOptions,
  id,
  label,
  loading = false,
  multiple = false,
  onChange,
  onInputChange,
  options,
  placeholder,
  renderOption,
  values,
}: ComboBoxProps) {
  let ownId = useId()
  ownId = id ?? ownId

  const inputRef = useRef<HTMLInputElement | null>(null)

  const [ownOptions, setOwnOptions] = useState(options)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [maxHeight, setMaxHeight] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (nextOpen, event, reason) => {
      setIsOpen(nextOpen)
      if (reason === 'escape-key' && event?.target) {
        const input = event.target as HTMLInputElement
        input.blur()
      }
    },
    middleware: [
      offset(4),
      size({
        apply({ availableHeight }) {
          flushSync(() => {
            setMaxHeight(availableHeight)
          })
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, {
    role: 'combobox',
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    focus,
    dismiss,
    role,
  ])

  const handleSelectOption = (option: Option) => {
    let newValues = new Set(values)

    let selectedOption
    if (typeof option === 'string') {
      selectedOption = option
    } else if (typeof option === 'object' && option.value) {
      selectedOption = option.value
    }
    if (!selectedOption) return

    if (multiple) {
      if (newValues.has(selectedOption)) {
        newValues.delete(selectedOption)
      } else {
        newValues.add(selectedOption)
      }
      setQuery('')
      const input = inputRef.current as HTMLInputElement
      input.focus()
    } else {
      newValues = new Set([selectedOption])
      setQuery(selectedOption)
    }

    onChange?.([...newValues])
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let query = event.target.value
    setQuery(query)

    if (onInputChange) {
      onInputChange?.(event)
    } else if (filterOptions) {
      setOwnOptions(filterOptions(query))
    } else if (options) {
      query = query.toLowerCase()
      const newOptions = options.filter((option) => {
        if (typeof option === 'string') {
          return option.toLowerCase().includes(query)
        }
        if (typeof option === 'object' && (option.label || option.value)) {
          return (
            option.label.toLowerCase().includes(query) ||
            option.value.toLowerCase().includes(query)
          )
        }
        return false
      })
      setOwnOptions(newOptions)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      !ownOptions ||
      !['Enter', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)
    )
      return

    event.preventDefault()
    setIsDirty(true)

    switch (event.key) {
      case 'Enter':
        handleSelectOption(ownOptions[activeIndex])
        break
      case 'ArrowUp':
        setActiveIndex((prevIndex) => {
          let newIndex = prevIndex - 1
          if (newIndex < 0) {
            newIndex = ownOptions.length - 1
          }
          return newIndex
        })
        break
      case 'ArrowDown':
        setActiveIndex((prevIndex) => {
          let newIndex = prevIndex + 1
          if (newIndex >= ownOptions.length) {
            newIndex = 0
          }
          return newIndex
        })
        break
      case 'Home':
        setActiveIndex(0)
        break
      case 'End':
        setActiveIndex(ownOptions.length - 1)
        break
    }
  }

  const handleClearClick = () => {
    setQuery('')
    onChange?.([])
  }

  useEffect(() => {
    setActiveIndex(0)
    setIsDirty(false)
  }, [isOpen])

  useEffect(() => {
    if (JSON.stringify(options) !== JSON.stringify(ownOptions)) {
      setOwnOptions(options)
    }
  }, [options])

  useEffect(() => {
    setActiveIndex(0)
  }, [ownOptions])

  useEffect(() => {
    if (!multiple) {
      const input = inputRef.current as HTMLInputElement
      input.blur()
      setQuery(values[0] ?? '')
      setIsOpen(false)
    } else {
      setQuery('')
    }
  }, [multiple, values])

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          className="font-semibold"
          id={`${ownId}-label`}
          htmlFor={`${ownId}-input`}
        >
          {label}
        </label>
      )}
      <div
        className={cx(
          'group/parent with-focus-ring relative flex items-center rounded-lg border-slate-200 bg-white shadow-sm shadow-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:shadow-none',
          {
            'is-disabled pointer-events-none border-slate-400 bg-slate-300 text-slate-400 dark:border-slate-400 dark:bg-slate-500':
              disabled,
          }
        )}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {!disabled && (query || values.length > 0) ? (
          <button
            className="group/button hover:with-box-shadow relative rounded-full p-2 transition-colors hover:bg-cyan-300/50 focus:outline-none motion-reduce:transition-none"
            onClick={handleClearClick}
          >
            <IcSearchX width={24} height={24} />
            <span className="absolute bottom-full left-1/2 z-20 hidden -translate-x-1/2 rounded-lg bg-slate-700 px-4 py-2 font-medium text-slate-200 group-hover/button:block dark:bg-slate-950 dark:text-slate-300">
              Clear
            </span>
          </button>
        ) : (
          <div className="p-2">
            <IcSearch width={24} height={24} />
          </div>
        )}
        <div className="flex flex-auto flex-row flex-wrap items-center gap-1 self-stretch py-1">
          {multiple &&
            values.length > 0 &&
            values.map((value) => (
              <ComboBoxTag
                key={value}
                value={value}
                disabled={disabled}
                onRemove={() => handleSelectOption(value)}
              />
            ))}
          <input
            className="h-8 min-w-fit flex-auto bg-transparent px-2 focus:outline-none"
            role="combobox"
            id={`${ownId}-input`}
            aria-autocomplete="list"
            aria-controls={`${ownId}-list`}
            aria-disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-labelledby={`${ownId}-label`}
            placeholder={!disabled ? placeholder : undefined}
            value={query}
            disabled={disabled}
            ref={inputRef}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="size-10 p-2">
          {loading && (
            <IcSpinner className="animate-spin" width={24} height={24} />
          )}
        </div>
        {ownOptions && (
          <CSSTransition
            classNames="listbox-"
            in={isOpen}
            timeout={200}
            unmountOnExit
          >
            <ul
              className="absolute top-full z-10 w-full overflow-y-auto rounded-md border border-slate-200 bg-white p-2 shadow-md shadow-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:shadow-none"
              role="listbox"
              id={`${ownId}-list`}
              aria-activedescendant={`${ownId}-option-${activeIndex}`}
              aria-multiselectable={multiple}
              aria-roledescription={description}
              ref={refs.setFloating}
              style={{
                ...floatingStyles,
                maxHeight: `calc(${maxHeight}px - 2rem)`,
              }}
              {...getFloatingProps()}
            >
              {ownOptions.length > 0 ? (
                ownOptions.map((option, index) => {
                  const isSelected =
                    typeof option === 'string'
                      ? values.includes(option)
                      : typeof option === 'object' && option.value
                        ? values.includes(option.value)
                        : false
                  return (
                    <ComboBoxOption
                      key={`${ownId}-option-${index}`}
                      id={`${ownId}-option-${index}`}
                      index={index}
                      isActive={index === activeIndex}
                      isDirty={isDirty}
                      isSelected={isSelected}
                      onClick={() => handleSelectOption(option)}
                      setActiveIndex={setActiveIndex}
                    >
                      {renderOption
                        ? renderOption(option, isSelected)
                        : typeof option === 'string'
                          ? option
                          : typeof option === 'object' && option.label
                            ? option.label
                            : ''}
                    </ComboBoxOption>
                  )
                })
              ) : (
                <div className="p-2">No results were found</div>
              )}
            </ul>
          </CSSTransition>
        )}
      </div>
      {description && <span>{description}</span>}
    </div>
  )
}
