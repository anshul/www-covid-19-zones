import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'
import { Col, Row } from 'react-flexbox-grid'
import Searchbar from '../../components/Searchbar'
import { UrlT } from '../../types'

interface CompareBarZone {
  name: string
  code: string
}

interface Props {
  zones: readonly CompareBarZone[]
  go: (target: UrlT) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: theme.spacing(1),
    },
  })
)

const CompareBar: React.FC<Props> = ({ zones, go }) => {
  const classes = useStyles()
  const onSearch = (code: string) => go({ codes: [...zones.map((z) => z.code), code] })

  return (
    <Row className={classes.root}>
      <Col xs={12}>
        <Searchbar onSearch={onSearch} placeHolder='Add state/city to compare' />
      </Col>
    </Row>
  )
}

export default CompareBar
