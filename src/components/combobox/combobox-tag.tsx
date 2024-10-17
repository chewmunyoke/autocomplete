import IcCircleX from '../../assets/circle-x.svg'
import type { ComboBoxTagProps } from './types'

export function ComboBoxTag({ value, disabled, onRemove }: ComboBoxTagProps) {
  return (
    <div className="flex h-9 items-center gap-2 rounded-3xl border border-transparent bg-cyan-500 py-1 pl-3 pr-2 font-medium text-slate-100 transition-all group-[.is-disabled]/parent:border-slate-400 group-[.is-disabled]/parent:bg-transparent group-[.is-disabled]/parent:pr-3 group-[.is-disabled]/parent:text-slate-500 motion-reduce:transition-none dark:bg-cyan-700 dark:group-[.is-disabled]/parent:text-slate-300">
      {value}
      {!disabled && (
        <button
          className="rounded-full border border-transparent bg-cyan-600 p-1 transition-colors hover:bg-cyan-700 group-[.is-disabled]/parent:border-slate-400 group-[.is-disabled]/parent:bg-transparent motion-reduce:transition-none dark:bg-cyan-800 dark:hover:bg-cyan-900"
          onClick={onRemove}
        >
          <IcCircleX width={16} height={16} />
        </button>
      )}
    </div>
  )
}
