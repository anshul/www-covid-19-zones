import { Button as MuiButton, ButtonProps, CircularProgress } from '@material-ui/core'
import { AddAlertOutlined } from '@material-ui/icons'
import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

interface Props {
  error?: boolean
  loading?: boolean
  customColor?: string
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      fontWeight: 400,
    },
    button: {
      border: 'none',
      fontWeight: 400,
      padding: '4px 16px',
      borderRadius: '24px',
      textTransform: 'unset',
      transitionDuration: '0.3s',
      '&:active,&:focus': {
        outline: 'none',
      },
    },
  })
)

const Button: React.FC<ButtonProps & Props> = ({ className, error, loading, customColor, ...props }) => {
  const classes = useStyles()

  return (
    <MuiButton
      variant='text'
      startIcon={loading ? <CircularProgress size={18} /> : error ? <AddAlertOutlined /> : props.startIcon}
      className={clsx(classes.root, classes.button, className)}
      {...props}
    />
  )
}

export default Button
