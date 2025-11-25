import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Icon, Popup } from 'semantic-ui-react';
import selectors from '../../../selectors';
import styles from './BoardSwitcher.module.scss';

const BoardSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  // Get all projects for current user
  const projectIds = useSelector(selectors.selectProjectIdsForCurrentUser) || [];

  // Get all boards from all projects
  const boards = useSelector((state) => {
    const allBoards = [];

    projectIds.forEach(projectId => {
      const boardIds = selectors.selectBoardIdsByProjectId(state, projectId) || [];
      boardIds.forEach(boardId => {
        const board = selectors.selectBoardById(state, boardId);
        if (board) {
          allBoards.push({
            ...board,
            projectId,
          });
        }
      });
    });

    return allBoards;
  });

  const { boardId: currentBoardId, projectId: currentProjectId } = useSelector(selectors.selectPath);
  const currentBoard = boards.find(b => b.id === currentBoardId);

  const recentBoards = boards.slice(0, 5);
  const starredBoards = boards.filter(b => b.isStarred);

  const filteredBoards = searchTerm
    ? boards.filter(board =>
        board.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : boards;

  const toggleSwitcher = useCallback(() => {
    setIsOpen(prev => !prev);
    setSearchTerm('');
  }, []);

  const handleBoardSelect = useCallback((board) => {
    navigate(`/projects/${board.projectId}/boards/${board.id}`);
    setIsOpen(false);
    setSearchTerm('');
  }, [navigate]);

  const handleStarBoard = useCallback((e, boardId) => {
    e.stopPropagation();
    // TODO: Implement star/unstar functionality
    console.log('Star board:', boardId);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + K to open board switcher
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSwitcher();
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, toggleSwitcher]);

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={toggleSwitcher} />}
      {/* Board Switcher Button */}
      <div className={styles.switcherContainer} ref={containerRef}>
        <button
          className={classNames(styles.switcherButton, { [styles.active]: isOpen })}
          onClick={toggleSwitcher}
          aria-label="Board Switcher"
        >
          <Icon name="grid layout" />
          <span className={styles.currentBoardName}>
            {currentBoard?.name || 'Boards'}
          </span>
          <Icon name={isOpen ? 'chevron down' : 'chevron up'} size="small" />
        </button>

        {/* Switcher Panel */}
        {isOpen && (
          <div className={styles.switcherPanel}>
            {/* Search */}
            <div className={styles.searchContainer}>
              <Icon name="search" className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search boards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <kbd className={styles.kbd}>⌘K</kbd>
            </div>

            <div className={styles.boardsContainer}>
              {/* Starred Boards */}
              {starredBoards.length > 0 && !searchTerm && (
                <div className={styles.boardSection}>
                  <div className={styles.sectionHeader}>
                    <Icon name="star" className={styles.starIcon} />
                    <span>Starred</span>
                  </div>
                  {starredBoards.map(board => (
                    <BoardItem
                      key={board.id}
                      board={board}
                      isActive={board.id === currentBoardId}
                      onSelect={() => handleBoardSelect(board)}
                      onStar={handleStarBoard}
                    />
                  ))}
                </div>
              )}

              {/* Recent Boards */}
              {!searchTerm && (
                <div className={styles.boardSection}>
                  <div className={styles.sectionHeader}>
                    <Icon name="clock outline" />
                    <span>Recent</span>
                  </div>
                  {recentBoards.map(board => (
                    <BoardItem
                      key={board.id}
                      board={board}
                      isActive={board.id === currentBoardId}
                      onSelect={() => handleBoardSelect(board)}
                      onStar={handleStarBoard}
                    />
                  ))}
                </div>
              )}

              {/* All Boards / Search Results */}
              <div className={styles.boardSection}>
                <div className={styles.sectionHeader}>
                  <Icon name="trello" />
                  <span>{searchTerm ? 'Search Results' : 'All Boards'}</span>
                  <span className={styles.count}>{filteredBoards.length}</span>
                </div>
                {filteredBoards.length > 0 ? (
                  filteredBoards.map(board => (
                    <BoardItem
                      key={board.id}
                      board={board}
                      isActive={board.id === currentBoardId}
                      onSelect={() => handleBoardSelect(board)}
                      onStar={handleStarBoard}
                    />
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <Icon name="inbox" size="big" />
                    <p>No boards found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <button className={styles.quickAction} onClick={() => { navigate('/'); setIsOpen(false); }}>
                <Icon name="home" />
                <span>Home</span>
              </button>
              {currentProjectId && (
                <button className={styles.quickAction} onClick={() => {
                  // TODO: Implement create board action
                  console.log('Create new board in project:', currentProjectId);
                  setIsOpen(false);
                }}>
                  <Icon name="plus" />
                  <span>New Board</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
};

// Board Item Component
const BoardItem = ({ board, isActive, onSelect, onStar }) => {
  const getBoardColor = () => {
    if (board.background?.type === 'gradient') {
      return board.background.name;
    }
    return board.background?.color || '#0079BF';
  };

  return (
    <div
      className={classNames(styles.boardItem, { [styles.active]: isActive })}
      onClick={onSelect}
    >
      <div
        className={styles.boardColor}
        style={{ background: getBoardColor() }}
      />
      <div className={styles.boardInfo}>
        <span className={styles.boardName}>{board.name}</span>
      </div>
      <button
        className={classNames(styles.starButton, { [styles.starred]: board.isStarred })}
        onClick={(e) => onStar(e, board.id)}
        aria-label="Star board"
      >
        <Icon name={board.isStarred ? 'star' : 'star outline'} />
      </button>
    </div>
  );
};

export default BoardSwitcher;
