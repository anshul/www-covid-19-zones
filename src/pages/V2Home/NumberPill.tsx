import React from 'react'
import { createStyles, makeStyles } from '@material-ui/styles'
import { Typography } from '@material-ui/core'
import { pickTextColor } from '../../utils/ColorFactory'
interface Props {
  color?: (count: number) => string
  count?: number | null
  allowNegative?: boolean
}

const useStyles = makeStyles(() =>
  createStyles({
    number: {
      fontSize: '11px',
      minWidth: '35px',
      padding: '0',
    },
    numberPill: {
      textAlign: 'center',
      fontSize: '11px',
      padding: '.15em .25em',
      borderRadius: '.35em',
    },
  })
)

const NumberPill: React.FC<Props> = ({ color = () => '#eeeeee', count, allowNegative }) => {
  const classes = useStyles()
  return (
    <span className={classes.number}>
      <Typography
        style={{
          backgroundColor: color(count || 0),
          color: pickTextColor(color(count || 0)),
          border: `1px solid ${color(count || 0)}`,
        }}
        className={classes.numberPill}
      >
        {count && (count >= 0 || allowNegative) ? count : ''}
      </Typography>
    </span>
  )
}

export default NumberPill
