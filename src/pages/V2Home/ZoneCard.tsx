import { graphql } from 'babel-plugin-relay/macro'
import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { Typography } from '@material-ui/core'
import { createFragmentContainer } from 'react-relay'
import { ZoneCard_zone } from '../../__generated__/ZoneCard_zone.graphql'
import { Row } from 'react-flexbox-grid'
import NumberPill from './NumberPill'
import { HighlightOffTwoTone } from '@material-ui/icons'
interface Props {
  lineColor: string
  zone: ZoneCard_zone
  ipmColor: (count: number) => string
  iColor: (count: number) => string
  canRemove: boolean
  onRemove?: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      padding: theme.spacing(1),
    },
    title: {
      fontSize: '22px',
      fontWeight: 800,
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'top',
    },
    subtitle: {
      fontSize: '11px',
      fontWeight: 600,
      paddingBottom: theme.spacing(0.5),
    },
    term: {
      width: '60px',
      fontWeight: 400,
      fontSize: '0.7em',
    },
    numberRow: {
      display: 'flex',
      alignItems: 'center',
    },
    removeButton: {
      marginTop: '-10px',
      padding: '3px 6px',
      color: '#c30',
      cursor: 'pointer',
      '&:hover': {
        color: 'black',
      },
    },
  })
)

const ZoneCard: React.FC<Props> = ({ zone, lineColor, ipmColor, iColor, canRemove, onRemove }) => {
  const classes = useStyles()
  return (
    <div key={zone.code} className={classes.root}>
      <Typography className={classes.title} variant='h1' style={{ color: lineColor }}>
        {zone.name}
        {canRemove && <HighlightOffTwoTone fontSize='small' color='action' className={classes.removeButton} onClick={onRemove} />}
      </Typography>
      <Typography className={classes.subtitle}>
        Population {zone.fEstPopulation} ({zone.fEstPopulationYear})
      </Typography>
      <Row bottom='xs' className={classes.numberRow}>
        <span className={classes.term}>Infections</span>
        <NumberPill count={zone.cumulativeInfections} color={iColor} />
      </Row>
      <Row bottom='xs' className={classes.numberRow}>
        <span className={classes.term}>Per million</span>
        <NumberPill count={zone.perMillionInfections} color={ipmColor} />
      </Row>
    </div>
  )
}

export default createFragmentContainer(ZoneCard, {
  zone: graphql`
    fragment ZoneCard_zone on V2Zone {
      code
      name
      fEstPopulation
      fEstPopulationYear
      perMillionInfections
      cumulativeInfections
    }
  `,
})
