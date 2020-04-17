import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import { Line } from 'react-chartjs-2'

interface Props {
  slug: string
}

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: '#eb841f',
      borderColor: '#eb841f',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#eb841f',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#eb841f',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 5,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: '#7cd690',
      borderColor: '#7cd690',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#7cd690',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#7cd690',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 5,
      pointHitRadius: 10,
      data: [11, 75, 23, 71, 16, 35, 50],
    },
  ],
}

const ZoneRoot: React.FC<Props> = ({ slug }) => {
  return (
    <Row>
      <Col xs={12}>
        <Line
          data={data}
          options={{
            title: {
              text: `${slug} Cases`,
            },
            color: ['#eb841f', '#7cd690'],
          }}
        />
      </Col>
    </Row>
  )
}

export default ZoneRoot
