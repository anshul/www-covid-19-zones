import React from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Row, Col } from 'react-flexbox-grid'
import { Breadcrumbs, Button } from '@material-ui/core'
import { IoIosAdd } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { slateGrey } from '../../utils/ColorFactory'
import { UrlT } from '../../types'
import Searchbar from '../../components/Searchbar'

interface ZoneBarZone {
  name: string
  code: string
  parent?: {
    name: string
    code: string
  } | null
}

interface Props {
  zone: ZoneBarZone
  go: (target: UrlT) => void
}

const useStyles = makeStyles(() =>
  createStyles({
    parentZoneLinkText: {
      color: slateGrey[500],
      textDecoration: 'none',
      fontWeight: 500,
    },
    zoneLinkText: {
      color: slateGrey[700],
      textDecoration: 'none',
      fontWeight: 700,
    },
  })
)

const ZoneBar: React.FC<Props> = ({ zone, go }) => {
  const classes = useStyles()
  const onCompare = () => go({ mode: 'compare' })
  const onSearch = (code: string) => go({ codes: [code] })

  return (
    <>
      <Row>
        <Col xs={12}>
          <Searchbar onSearch={onSearch} />
        </Col>
      </Row>
      <Row style={{ minHeight: '40px' }}>
        <Col>
          <Breadcrumbs style={{ marginLeft: '10px' }}>
            {zone && zone.parent && (
              <Link className={classes.parentZoneLinkText} color='inherit' to={`/v2/zones/${zone.parent.code}`}>
                {zone.parent.name}
              </Link>
            )}
            <p className={classes.zoneLinkText}>{zone.name}</p>
          </Breadcrumbs>
        </Col>
        <Col xs>
          <Button
            style={{ marginLeft: '25px' }}
            size='small'
            disableElevation
            variant='contained'
            color='secondary'
            startIcon={<IoIosAdd />}
            onClick={onCompare}
          >
            Compare
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default ZoneBar
