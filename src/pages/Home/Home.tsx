import React, { useState } from 'react'
import { Row, Grid, Col } from 'react-flexbox-grid'
import Searchbar from '../../components/Searchbar'

const Home: React.FC = () => {
  const [value, setValue] = useState('')

  return (
    <Grid>
      <Row>
        <Col xs={12} xl={6} xlOffset={3}>
          <Searchbar value={value} onChange={(value) => setValue(value)} onSearch={() => { }} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={6}></Col>
        <Col xs={12} xl={6}></Col>
        <Col xs={12} xl={6}></Col>
        <Col xs={12} xl={6}></Col>
      </Row>
      <Row style={{ margin: '8px 0' }}>
        <Col xs={12} xl={4}>
          <div>
            <h3 style={{ marginBottom: '8px' }}>Cases</h3>
            <h4 style={{ marginBottom: 'px' }}>India</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h6>Confirmed</h6>
                <h3 style={{ margin: 0 }}>13,387</h3>
              </div>
              <div>
                <h6>Recovered</h6>
                <h3 style={{ margin: 0 }}>13,387</h3>
              </div>
              <div>
                <h6>Death</h6>
                <h3 style={{ margin: 0 }}>13,387</h3>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Grid>
  )
}

export default Home
