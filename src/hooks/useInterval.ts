import React from 'react'

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = React.useRef(() => {
    // empty function
  })
  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
