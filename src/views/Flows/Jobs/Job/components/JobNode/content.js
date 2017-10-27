import React from 'react'
import PropTypes from 'prop-types'

import escapeHtml from 'util/escapeHtml'
import ansiHTML from 'ansi-html'

import Button from 'components/Button'
import Loading from 'components/Loading'

import classes from './node.scss'
export default function JobNodeContent ({ fetching, log, emptyText, onClose }) {
  const show = !!log || !fetching
  const h = !show ? '' : (log ? ansiHTML(escapeHtml(log)) : emptyText)
  return <code className={classes.code}>
    {!show && <Loading size={20} />}
    {show && <div dangerouslySetInnerHTML={{ __html: h }} />}
    {show && !!log && <Button className={`btn-primary hide ${classes.close}`}
      size='sm' useSpinner={false} onClick={onClose}
    >
      Close
    </Button>}
  </code>
}
JobNodeContent.propTypes = {
  log: PropTypes.string,
  emptyText: PropTypes.string,
  fetching: PropTypes.bool,
  onClose: PropTypes.func
}
JobNodeContent.defaultProps = {
  emptyText: '无日志'
}
