import { useEffect, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'

type UseLongPressOptions = {
  delay?: number
  moveThreshold?: number
  disabled?: boolean
}

type UseLongPressHandlers = {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void
  onContextMenu: (event: ReactMouseEvent<HTMLElement>) => void
}

export function useLongPress(
  callback: (event: ReactPointerEvent<HTMLElement>) => void,
  options: UseLongPressOptions = {},
): UseLongPressHandlers {
  const { delay = 520, moveThreshold = 16, disabled = false } = options
  const timerRef = useRef<number | null>(null)
  const pointerIdRef = useRef<number | null>(null)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const eventRef = useRef<ReactPointerEvent<HTMLElement> | null>(null)
  const longPressFiredRef = useRef(false)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const cancel = () => {
    clearTimer()
    pointerIdRef.current = null
    longPressFiredRef.current = false
  }

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [])

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled) {
      return
    }

    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    clearTimer()
    longPressFiredRef.current = false
    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    startYRef.current = event.clientY
    eventRef.current = event

    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      longPressFiredRef.current = true
      if (eventRef.current) {
        callback(eventRef.current)
      }
    }, delay)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled || pointerIdRef.current !== event.pointerId || longPressFiredRef.current) {
      return
    }

    const distanceX = Math.abs(event.clientX - startXRef.current)
    const distanceY = Math.abs(event.clientY - startYRef.current)
    if (distanceX > moveThreshold || distanceY > moveThreshold) {
      cancel()
    }
  }

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    cancel()
  }

  const onPointerCancel = (event: React.PointerEvent<HTMLElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    cancel()
  }

  const onContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      return
    }

    event.preventDefault()
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onContextMenu,
  }
}
