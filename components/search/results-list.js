import React from 'react'
import PropTypes from 'prop-types'

import url from 'url'
import moment from 'moment'

import NLink from 'next/link'
import styled from 'styled-components'

import {
  Flex, Box,
  Link,
  Text,
  Divider,
  theme
} from 'ooni-components'

import Flag from '../flag'

const StyledResultTag = styled.div`
  margin-top: -4px;
  border-radius: 16px;
  padding: 8px 16px;
  height: 32px;
  line-height: 1;
  font-size: 16px;
`

const ResultTagFilled = styled(StyledResultTag)`
  background-color: ${props => props.theme.colors.gray7};
  color: ${props => props.theme.colors.white};
`

const ResultTagHollow = styled(StyledResultTag)`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.gray7};
  color: ${props => props.theme.colors.gray7};
`

const ResultTag = ({msmt}) => {
  if (msmt.confirmed === true) {
    return <ResultTagFilled>
      Confirmed
    </ResultTagFilled>
  //} else if (msmt.failure === true) {
  //  return <StyledResultTag>
  //    Failure
  //  </StyledResultTag>
  } else if (msmt.anomaly === true) {
    return <ResultTagHollow>
      Anomaly
    </ResultTagHollow>
  } else {
    return <StyledResultTag>Normal</StyledResultTag>
  }
}


const ASNBox = ({asn}) => {
  const justNumber = asn.split('AS')[1]
  return <Text bold color='gray7'>AS {justNumber}</Text>
}

ASNBox.propTypes = {
  asn: PropTypes.string
}

// XXX add this to the design system
const StyledViewDetailsLink = styled(Link)`
  cursor: pointer;
  color: ${props => props.theme.colors.blue5};
  &:hover {
    color: ${props => props.theme.colors.blue9};
  }
`

const ViewDetailsLink = ({reportId, input}) => {
  let href = `/measurement?report_id=${reportId}`
  if (input) {
    href += `&input=${input}`
  }
  return (
    <NLink href={href}>
      <StyledViewDetailsLink href={href}>»</StyledViewDetailsLink>
    </NLink>
  )
}

ViewDetailsLink.propTypes = {
  reportId: PropTypes.string,
  input: PropTypes.string,
}

const StyledColorCode = styled.div`
  height: 80px;
  width: 5px;
  margin-right: 10px;
  margin-top: 1px;
  margin-bottom: 1px;
`

/*
const ColorCodeFailed = styled(StyledColorCode)`
  background-color: ${props => props.theme.colors.orange4};
`
*/

const colorNormal = theme.colors.green7
const colorError = theme.colors.yellow5
const colorConfirmed = theme.colors.red8
const colorAnomaly = theme.colors.yellow8

const ColorCodeConfirmed = styled(StyledColorCode)`
  background-color: ${colorConfirmed};
`
const ColorCodeAnomaly = styled(StyledColorCode)`
  background-color: ${colorAnomaly};
`
const ColorCodeNormal = styled(StyledColorCode)`
  background-color: ${colorNormal};
`

const ColorCode = ({msmt}) => {
  if (msmt.confirmed === true) {
    return <ColorCodeConfirmed />
  //} else if (msmt.failure === true) {
  //  return <ColorCodeFailed />
  } else if (msmt.anomaly === true) {
    return <ColorCodeAnomaly />
  }
  return <ColorCodeNormal />
}

ColorCode.propTypes = {
  msmt: PropTypes.object
}

const ResultRow = styled(Flex)`
  color: ${props => props.theme.colors.gray7};
  background-color: #ffffff;
  :hover {
    background-color: ${props => props.theme.colors.gray1};
  }
  border-bottom: 1px solid ${props => props.theme.colors.gray4};
`
const HTTPSPrefix = styled.span`
  color: ${props => props.theme.colors.green8};
`
const Hostname = styled.span`
  color: ${props => props.theme.colors.black};
`

const ResultInput = styled.div`
  font-size: 16px;
  color: ${props => props.theme.colors.gray5};
`

const ResultItem = ({msmt}) => {
  const pathMaxLen = 10
  let input = msmt.input
  if (input) {
    const p = url.parse(input)
    let path = p.path
    if (path && path.length > pathMaxLen) {
      path = `${path.substr(0, pathMaxLen)}…`
    }
    if (p.protocol && p.protocol === 'http:') {
      input = <span><Hostname>{p.host}</Hostname>{path}</span>
    } else if (p.protocol && p.protocol === 'https:') {
      input = <span><HTTPSPrefix>https</HTTPSPrefix>{'://'}<Hostname>{p.host}</Hostname>{path}</span>
    }
  }
  return (
    <ResultRow alignItems='center' justifyContent='center'>
      <Box width={1/3}>
        <Flex alignItems='center' justifyContent='center'>
          <Box flex='auto' width={1/16}>
            <ColorCode msmt={msmt} />
          </Box>
          <Box flex='auto' width={2/16}>
            <Text bold color='gray8'>{msmt.probe_cc}</Text>
          </Box>
          <Box flex='auto' width={5/16}>
            <Flag countryCode={msmt.probe_cc} />
          </Box>
          <Box flex='auto' width={8/16}>
            <ASNBox asn={msmt.probe_asn} />
          </Box>
        </Flex>
      </Box>
      <Box width={2/3}>
        <Flex flexDirection='column'>
          <Box>
            {input &&
              <ResultInput>
                {input}
              </ResultInput>}
          </Box>
          <Box>
            <Flex>
              <Box pr={2} width={7/16}>
                {msmt.testName}
              </Box>
              <Box width={4/16}>
                {moment(msmt.measurement_start_time).format('YYYY-MM-DD')}
              </Box>
              <Box width={4/16}>
                <ResultTag msmt={msmt} />
              </Box>
              <Box width={1/16}>
                <ViewDetailsLink reportId={msmt.report_id} input={msmt.input} />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </ResultRow>
  )
}

ResultItem.propTypes = {
  msmt: PropTypes.object
}

const LegendColorBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
  float: left;
  margin-right: 10px;
`

const StyledLegendItem = styled.div`
  float: left;
  margin-right: 20px;
`

const LegendItem = ({color, label}) => {
  return <StyledLegendItem>
    <LegendColorBox color={color}/> {label}
  </StyledLegendItem>
}

const LegendContainer = styled.div`
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px;
`

const ResultTable = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  margin: 8px;
  line-height: 1.5;
`

const ResultsList = ({results, testNamesKeyed}) => {
  return (
    <ResultTable>
      <LegendContainer>
        <LegendItem color={colorAnomaly} label='Anomaly' />
        <LegendItem color={colorConfirmed} label='Confirmed' />
        <LegendItem color={colorNormal} label='OK' />
        <LegendItem color={colorError} label='Error' />
      </LegendContainer>
      <Divider width='100%' color='gray5'/>
      {results.map((msmt, idx) => {
        msmt.testName = testNamesKeyed[msmt.test_name]
        return <div key={idx}>
          <ResultItem msmt={msmt} />
        </div>
      })}
    </ResultTable>
  )
}

ResultsList.propTypes = {
  results: PropTypes.array,
  testNamesKeyed: PropTypes.object,
}

export default ResultsList
