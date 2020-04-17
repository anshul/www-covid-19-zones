import React, { useState } from 'react'
import { graphql } from 'babel-plugin-relay/macro'

import { makeStyles, createStyles } from '@material-ui/styles'
import Autocomplete from 'react-autocomplete'
import { FiSearch } from 'react-icons/fi'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import ErrorBox from '../ErrorBox'
import { QueryRenderer } from 'react-relay'
import environment from '../../relayEnvironment'
import { SearchbarQuery } from '../../__generated__/SearchbarQuery.graphql'

interface Props {
  onSearch: () => void
}

const useStyles = makeStyles(() =>
  createStyles({
    inputRoot: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fafafa',
      borderRadius: '12px',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 12px',
    },
    input: {
      boxSizing: 'border-box',
      textIndent: '36px',
      width: '100%',
      height: '100%',
      outline: 'none',
      border: 'none',
      padding: '12px',
      fontSize: '16px',
      borderRadius: '12px',
      fontFamily: 'Poppins, sans-serif',
    },
    inputIcon: {
      width: '24px',
      height: '24px',
      position: 'absolute',
      marginLeft: '16px',
    },
    button: {
      height: '48px',
    },
    menu: {
      marginTop: '8px',
      marginLeft: '8px',
      marginRight: '8px',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px',
      borderBottom: '1px solid #e4e4e4',
      transitionDuration: '0.3s',
      '&:hover': {
        backgroundColor: '#e4e4e4',
      },
    },
    menuItemHighlighted: {
      backgroundColor: '#eee',
    },
    parentZone: {
      color: '#646464',
    },
    linkText: {
      textDecoration: 'unset',
      color: 'inherit',
    },
  })
)

const Searchbar: React.FC<Props> = ({ onSearch }) => {
  const [value, setValue] = useState('')

  const classes = useStyles()

  const onChange = (value: string) => {
    setValue(value)
  }

  return (
    <QueryRenderer<SearchbarQuery>
      environment={environment}
      query={graphql`
        query SearchbarQuery($searchQuery: String) {
          zonesList(searchQuery: $searchQuery) {
            slug
            name
            parentZone {
              name
            }
          }
        }
      `}
      variables={{ searchQuery: value }}
      render={({ error, props }) => {
        if (error) {
          return <ErrorBox error={error} />
        } else if (props) {
          return (
            <Autocomplete
              autoHighlight
              wrapperStyle={{}}
              value={value}
              items={(props.zonesList as any[]) || []}
              getItemValue={(item) => item.name}
              onChange={(e) => onChange(e.target.value)}
              onSelect={(_, item) => setValue(item.slug)}
              renderInput={(props) => (
                <div className={classes.inputRoot}>
                  <input {...props} placeholder='How is your country/city doing?' className={classes.input} />
                  <FiSearch className={classes.inputIcon} />
                  <button onClick={onSearch} className={classes.button}>
                    Search
                  </button>
                </div>
              )}
              renderItem={(item, isHighlighted) => {
                const path = item.slug.split('/')[item.slug.split('/').length - 1]

                return (
                  <Link className={classes.linkText} key={item.slug} to={`zone/${path}`}>
                    <div className={clsx(classes.menuItem, { [classes.menuItemHighlighted]: isHighlighted })}>
                      <p>{item.name}</p>
                      <p className={classes.parentZone}>{item.parentZone.name}</p>
                    </div>
                  </Link>
                )
              }}
              renderMenu={(children) => <div className={classes.menu}>{children}</div>}
            />
          )
        }
        return 'Loading'
      }}
    />
  )
}

export default Searchbar
