import cx from 'classnames'
import React, { Fragment, useEffect, useState } from 'react'

import IcCircleCheck from './assets/circle-check.svg'
import IcCircle from './assets/circle.svg'
import ComboBox from './components/combobox'
import type { Option } from './components/combobox/types'
import InfoTooltip from './components/info-tooltip'
import ThemeToggle from './components/theme-toggle'
import { countryList, countryObj } from './data/countries'

interface Attribute {
  falseLabel: string
  trueLabel: string
  falseInfo?: string
  trueInfo?: string
  status: boolean
}

let timeout: ReturnType<typeof setTimeout> | undefined

function App() {
  const countryOptions = countryList.map(({ country_code, country_name }) => ({
    label: country_name,
    value: country_code,
  }))

  const [attributes, setAttributes] = useState<Record<string, Attribute>>({
    disabled: {
      falseLabel: 'enabled',
      trueLabel: 'disabled',
      status: false,
    },
    multiple: {
      falseLabel: 'single select',
      trueLabel: 'multiple select',
      status: false,
      // max selection?
    },
    optionObject: {
      falseLabel: 'string options',
      trueLabel: 'label-value pair options',
      falseInfo: 'options: string[]',
      trueInfo: 'options: { label: string; value: string }[]',
      status: false,
    },
    customFilter: {
      falseLabel: 'native option filter',
      trueLabel: 'custom option filter',
      falseInfo:
        'Only able to search via name (affects only `synchronous` mode)',
      trueInfo:
        'Able to search all properties, including calling code and flag emoji (affects only `synchronous` mode)',
      status: false,
    },
    customRender: {
      falseLabel: 'native option render',
      trueLabel: 'custom option render',
      status: false,
    },
    async: {
      falseLabel: 'synchronous',
      trueLabel: 'asynchronous',
      status: false,
    },
  })
  const [options, setOptions] = useState<Option[] | null>(
    attributes.async.status
      ? null
      : attributes.optionObject.status
        ? countryOptions
        : Object.values(countryObj).map((value) => value.name)
  )
  const [selectedData, setSelectedData] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const description = `Attributes: ${Object.keys(attributes)
    .reduce((prev: string[], curr: string) => {
      const label = attributes[curr].status
        ? attributes[curr].trueLabel
        : attributes[curr].falseLabel
      return [...prev, String(label)]
    }, [])
    .join(', ')}`

  const filterOptions = (query: string): Option[] => {
    query = query.toLowerCase()
    const countries = countryList.filter((country) => {
      return Object.values(country).some((value) => {
        return value.toLowerCase().includes(query)
      })
    })
    const newOptions = countries.map(({ country_code, country_name }) => {
      if (attributes.optionObject.status) {
        return {
          label: country_name,
          value: country_code,
        }
      } else {
        return country_name
      }
    })
    return newOptions
  }

  const handleDataChange = (values: string[]) => {
    setSelectedData(values)
    if (values.length === 0 && attributes.async.status) {
      setOptions(null)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeout)

    const query = event.target.value
    if (!query) {
      setOptions(null)
      setIsLoading(false)
    } else {
      setIsLoading(true)
      timeout = setTimeout(() => {
        setOptions(filterOptions(query))
        setIsLoading(false)
      }, 1000)
    }
  }

  useEffect(() => {
    if (!attributes.multiple.status && selectedData.length > 1) {
      setSelectedData(selectedData.slice(0, 1))
    }
  }, [attributes.multiple.status, selectedData])

  useEffect(() => {
    setOptions(
      attributes.async.status
        ? null
        : attributes.optionObject.status
          ? countryOptions
          : Object.values(countryObj).map((value) => value.name)
    )
  }, [attributes])

  return (
    <main className="flex h-screen w-screen justify-center overflow-hidden bg-slate-200 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
      <div className="h-full max-h-screen w-full max-w-xl overflow-y-auto px-4 pb-4 pt-4 transition-all motion-reduce:transition-none sm:pt-[10vh] md:pt-[20vh]">
        <div className="rounded-xl bg-slate-50 shadow-md shadow-slate-300 dark:bg-slate-800 dark:shadow-none">
          <div className="flex flex-col">
            <div className="flex flex-col gap-2 p-6">
              <h2 className="text-lg font-bold">Attributes</h2>
              <div className="grid grid-cols-[2fr_1fr_2fr] items-center gap-4">
                {Object.entries(attributes).map(([key, value]) => (
                  <Fragment key={key}>
                    <div
                      className={cx(
                        'flex gap-x-2 justify-self-end text-right',
                        {
                          'font-semibold text-cyan-500 dark:text-cyan-400':
                            !value.status,
                        }
                      )}
                    >
                      {value.falseInfo && (
                        <InfoTooltip text={String(value.falseInfo)} />
                      )}
                      <label
                        id={`switch-${key}-label-false`}
                        htmlFor={`switch-${key}`}
                      >
                        {value.falseLabel}
                      </label>
                    </div>
                    <input
                      className="switch justify-self-center"
                      type="checkbox"
                      role="switch"
                      id={`switch-${key}`}
                      aria-checked={value.status}
                      aria-labelledby={`switch-${key}-label-${value.status}`}
                      checked={value.status}
                      onChange={() => {
                        setAttributes((prevAttributes) => ({
                          ...prevAttributes,
                          [key]: {
                            ...prevAttributes[key],
                            status: !prevAttributes[key].status,
                          },
                        }))
                      }}
                    />
                    <div
                      className={cx('flex flex-wrap gap-x-2', {
                        'font-semibold text-cyan-500 dark:text-cyan-400':
                          value.status,
                      })}
                    >
                      <label
                        id={`switch-${key}-label-true`}
                        htmlFor={`switch-${key}`}
                      >
                        {attributes[key].trueLabel}
                      </label>
                      {attributes[key].trueInfo && (
                        <InfoTooltip text={String(attributes[key].trueInfo)} />
                      )}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <hr className="border-slate-200 dark:border-slate-600" />
            <div className="flex flex-col gap-6 p-6">
              <ComboBox
                description={description}
                disabled={attributes.disabled.status}
                filterOptions={
                  attributes.customFilter.status ? filterOptions : undefined
                }
                id="combobox-1"
                label="Country"
                loading={isLoading}
                multiple={attributes.multiple.status}
                onChange={handleDataChange}
                onInputChange={
                  attributes.async.status ? handleInputChange : undefined
                }
                options={options}
                placeholder="Type to begin searching"
                renderOption={
                  attributes.customRender.status
                    ? (option, isSelected) => {
                        let key
                        if (typeof option === 'string') {
                          key = Object.keys(countryObj).find(
                            (country) => countryObj[country].name === option
                          )
                        } else if (typeof option === 'object') {
                          key = option.value
                        }
                        return key ? (
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <div className="flex gap-2">
                                <span>{countryObj[key].icon}</span>
                                <span>{key}</span>
                              </div>
                              <span>{countryObj[key].name}</span>
                            </div>
                            {isSelected ? (
                              <IcCircleCheck width={20} height={20} />
                            ) : (
                              <IcCircle width={20} height={20} />
                            )}
                          </div>
                        ) : null
                      }
                    : undefined
                }
                values={selectedData}
              />
            </div>
          </div>
        </div>
      </div>
      <ThemeToggle />
    </main>
  )
}

export default App
