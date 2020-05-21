import { CloseRounded } from '@material-ui/icons'
import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'
import { Col, Row } from 'react-flexbox-grid'
import Searchbar from '../../components/Searchbar'
import { UrlT } from '../../types'
import { slateGrey } from '../../utils/ColorFactory'

interface CompareBarZone {
  name: string
  code: string
}

interface Props {
  zones: readonly CompareBarZone[]
  go: (target: UrlT) => void
}

const useStyles = makeStyles(() =>
  createStyles({
    compareButton: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: slateGrey[100],
      borderRadius: '24px',
      padding: '4px 12px',
      marginRight: '4px',
    },
    compareCross: { cursor: 'pointer', marginLeft: '8px' },
  })
)

const CompareBar: React.FC<Props> = ({ zones, go }) => {
  const classes = useStyles()
  const onSearch = (code: string) => go({ codes: [...zones.map((z) => z.code), code] })
  const onClose = (zone: CompareBarZone) => {
    if (zones.length <= 1) return go({ mode: 'zones' })
    go({ codes: zones.map((z) => z.code).filter((c) => c !== zone.code) })
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <Searchbar onSearch={onSearch} />
        </Col>
      </Row>
      <Row style={{ minHeight: '40px', padding: '8px 0' }}>
        <Col>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {zones.map((zone) => (
              <div key={zone.code} className={classes.compareButton}>
                <p>{zone.name}</p>
                <CloseRounded fontSize='small' className={classes.compareCross} onClick={() => onClose(zone)} />
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default CompareBar
