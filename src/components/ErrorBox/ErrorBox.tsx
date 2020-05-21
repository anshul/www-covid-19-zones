import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core'
import { flamingo, fireBush, slateBlue, mountainMeadow } from '../../utils/ColorFactory'
import clsx from 'clsx'

interface Props {
  error: Error
}

type Severity = 'error' | 'warning' | 'info' | 'success' | undefined

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: '4px 8px',
    },
    error: {
      backgroundColor: flamingo[100],
    },
    warning: {
      backgroundColor: fireBush[100],
    },
    info: {
      backgroundColor: slateBlue[100],
    },
    success: {
      backgroundColor: mountainMeadow[100],
    },
  })
)

const ErrorBox: React.FC<Props> = ({ error }) => {
  const classes = useStyles()
  let title = error.name.replace('_', ' ')
  let body = error.message
  let severity: Severity = 'error'

  switch (error.name) {
    case 'HTTP_0': {
      severity = 'warning'
      title = 'Failed to connect'
      body = 'Please check your network settings.  If your network is fine, the server is probably down...'
      break
    }
    case 'HTTP_503': {
      severity = 'info'
      title = 'Server is likely under maintenance'
      body = "The server is unavailable.  It's either crashed or under scheduled maintenance"
      break
    }
  }

  if (error.message.search('500') !== -1) {
    severity = 'error'
    title = 'Internal server error.'
    body = 'If the problems continues to occur please contact the team.'
  }

  return (
    <div className={clsx(classes.root, classes[severity])} style={{ whiteSpace: 'pre-wrap' }}>
      <h5>{title}</h5>
      {body}
    </div>
  )
}

export default ErrorBox
