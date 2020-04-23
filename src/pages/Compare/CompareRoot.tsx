import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'
import { CompareRoot_data } from '../../__generated__/CompareRoot_data.graphql'
import { Grid, Row, Col } from 'react-flexbox-grid'
import Searchbar from '../../components/Searchbar'
import { slateGrey } from '../../utils/ColorFactory'
import { IoIosClose } from 'react-icons/io'
import CustomLineChart from '../../components/CustomLineChart'

interface Props {
  data: CompareRoot_data
  onCompare: (codes: string[]) => void
}

const CompareRoot: React.FC<Props> = ({ data, onCompare }) => {
  const codes = data.zones.map((zone) => [zone.code, zone.name] || []) || []
  return (
    <Grid>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <Searchbar onSearch={(code) => onCompare(codes.map((code) => code[0]).concat([code]))} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {codes.map((code) => (
              <div
                key={code[0]}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: slateGrey[100],
                  borderRadius: '24px',
                  padding: '4px 12px',
                  marginRight: '4px',
                }}
              >
                {code[1]}
                <IoIosClose
                  style={{ cursor: 'pointer', marginLeft: '8px', backgroundColor: slateGrey[200], borderRadius: '50%' }}
                  onClick={() => {
                    const currentCodeIdx = codes.indexOf(code)
                    onCompare(
                      codes
                        .slice(0, currentCodeIdx)
                        .concat(codes.slice(currentCodeIdx + 1))
                        .map((code) => code[0])
                    )
                  }}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <Row>
        {data.totalCases.map((cases) => (
          <Col key={cases.zoneName} xs={12} xl={codes.length > 2 ? 4 : 6}>
            <p>
              Total Confirmed Cases (<b>{cases.zoneName}</b>)
            </p>
            <h4>{cases.count}</h4>
          </Col>
        ))}
      </Row>
      <Row>
        <CustomLineChart
          title='New Cases'
          height={350}
          xAxisKey={data.newCases.xAxisKey}
          lineKeys={data.newCases.lineKeys}
          data={data.newCases.data}
        />
      </Row>
    </Grid>
  )
}

export default createFragmentContainer(CompareRoot, {
  data: graphql`
    fragment CompareRoot_data on CompareStats {
      zones {
        code
        slug
        name
        parentZone {
          slug
          code
          name
        }
      }
      totalCases {
        zoneName
        count
      }
      newCases {
        data
        lineKeys
        xAxisKey
      }
    }
  `,
})
