
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import selectors from '../../../selectors';
import Header from '../Header';
import Favorites from '../Favorites';
import HomeActions from '../HomeActions';
import Project from '../../projects/Project';
import BoardActions from '../../boards/BoardActions';
import BottomNav from '../BottomNav';
import GmailSidebar from '../GmailSidebar';

import styles from './Fixed.module.scss';

const Fixed = React.memo(() => {
  const { projectId } = useSelector(selectors.selectPath);
  const board = useSelector(selectors.selectCurrentBoard);
  const [isGmailOpen, setIsGmailOpen] = useState(false);

  const handleGmailToggle = () => {
    setIsGmailOpen((prev) => !prev);
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <Favorites />
      {projectId === undefined && <HomeActions />}
      {projectId && <Project />}
      {board && !board.isFetching && <BoardActions />}
      <BottomNav onGmailToggle={handleGmailToggle} />
      <GmailSidebar isOpen={isGmailOpen} onClose={() => setIsGmailOpen(false)} />
    </div>
  );
});

export default Fixed;
