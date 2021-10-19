import styles from './index.module.scss';

import React, { FC } from 'react';
import classNames from 'classnames';

import Playground from '@layouts/Playground';

const App: FC = () => {
  return (
    <div className={classNames(styles.appRoot)}>
      <Playground />
    </div>
  );
};

export default App;
