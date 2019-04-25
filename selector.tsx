import '../../shared/custom-module.css';
import './style.less';
import React from 'react';
import ReactDom from 'react-dom';
import ExperimentSelector from './components/ExperimentSelector';

CustomElement.init((element, _context) => {
  const initialValue = element.value ? JSON.parse(element.value) : null;
  const config = element.config || {};

  const components = (
    <ExperimentSelector
      clientId={config.clientId}
      accountId={config.accountId}
      webPropertyId={config.webPropertyId}
      profileId={config.profileId}
      initialValue={initialValue}
      disabled={element.disabled}
      customElementApi={CustomElement}
    />
  );

  ReactDom.render(components, document.querySelector('#reactapp'));
});


