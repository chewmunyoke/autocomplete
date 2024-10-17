import {
  FloatingArrow,
  arrow,
  autoPlacement,
  offset,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react'
import { useRef, useState } from 'react'

import IcInfo from '../assets/info.svg'

export default function InfoTooltip({ text }: { text: string }) {
  const arrowRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      autoPlacement(),
      offset(10),
      arrow({
        element: arrowRef,
      }),
    ],
  })

  const hover = useHover(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([hover])

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <IcInfo width={20} height={20} />
      </div>
      {isOpen && (
        <div
          className="z-20 max-w-60 rounded-lg bg-slate-700 px-4 py-2 text-center font-normal text-slate-200 shadow-lg shadow-slate-300 dark:bg-slate-950 dark:text-slate-300 dark:shadow-none"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {text}
          <FloatingArrow
            className="fill-slate-700 dark:fill-slate-950"
            ref={arrowRef}
            context={context}
            width={20}
            height={10}
          />
        </div>
      )}
    </>
  )
}
