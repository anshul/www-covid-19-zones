import React from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Button as MuiButton, ButtonProps, CircularProgress } from '@material-ui/core'
import { FiAlertCircle } from 'react-icons/fi'
import clsx from 'clsx'

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
      startIcon={loading ? <CircularProgress size={18} /> : error ? <FiAlertCircle /> : props.startIcon}
      className={clsx(classes.root, classes.button, className)}
      {...props}
    />
  )
}

export default Button
