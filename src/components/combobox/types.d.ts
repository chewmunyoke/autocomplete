type StrOption = string

type ObjOption = { label: string; value: string }

export type Option = StrOption | ObjOption

export interface ComboBoxProps {
  description?: string
  disabled?: boolean
  filterOptions?(query: string): Option[]
  id?: string
  label?: string
  loading?: boolean
  multiple?: boolean
  onChange?(values: string[]): void
  onInputChange?(event: React.ChangeEvent<HTMLInputElement>): void
  options: Option[] | null
  placeholder?: string
  renderOption?(option: Option, isSelected: boolean): JSX.Element | null
  values: string[]
}

export interface ComboBoxOptionProps {
  children: React.ReactNode
  id: string
  index: number
  isActive: boolean
  isDirty: boolean
  isSelected: boolean
  onClick?(event: React.MouseEvent): void
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
}

export interface ComboBoxTagProps {
  value: string
  disabled?: boolean
  onRemove?(): void
}
