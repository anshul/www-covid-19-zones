import React from 'react'
import { Row, Col } from 'react-flexbox-grid'

interface Props {
  slug: string
}

const ZoneRoot: React.FC<Props> = ({ slug }) => {
  return (
    <Row>
      <Col xs={12}></Col>
    </Row>
  )
}

export default ZoneRoot
