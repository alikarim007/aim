import React from 'react';
import { Button, Divider, InputBase } from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import ColumnItem from './ColumnItem/ColumnItem';
import Icon from 'components/Icon/Icon';

import './ManageColumnsPopover.scss';

const initialData = {
  columns: {
    left: {
      id: 'left',
      list: [],
    },
    middle: {
      id: 'middle',
      list: [],
    },
    right: {
      id: 'right',
      list: [],
    },
  },
  columnOrder: ['left', 'middle', 'right'],
};
function ManageColumnsPopover({ columnsData, onManageColumns }: any) {
  const [state, setState] = React.useState<any>(initialData);

  function onDragEnd(result: any) {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newList = Array.from(start.list);
      newList.splice(source.index, 1);
      newList.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        list: newList,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
      setState(newState);
      onManageColumns({
        left: newState.columns.left.list,
        middle: newState.columns.middle.list,
        right: newState.columns.right.list,
      });
      return;
    }

    const startList = Array.from(start.list);
    startList.splice(source.index, 1);
    const newStart = {
      ...start,
      list: startList,
    };

    const finishList = Array.from(finish.list);
    finishList.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      list: finishList,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setState(newState);
    onManageColumns({
      left: newState.columns.left.list,
      middle: newState.columns.middle.list,
      right: newState.columns.right.list,
    });
  }

  React.useEffect(() => {
    const newState = { ...state };
    const leftList = columnsData
      .filter((item: any) => item.pin === 'left')
      .map((item: any) => item.key);
    const rightList = columnsData
      .filter((item: any) => item.pin === 'right')
      .map((item: any) => item.key);
    const middleList = columnsData
      .filter((item: any) => item.pin !== 'left' && item.pin !== 'right')
      .map((item: any) => item.key);
    newState.columns.left.list = leftList;
    newState.columns.middle.list = middleList;
    newState.columns.right.list = rightList;
    setState(newState);
  }, [columnsData]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='ManageColumns__container'>
        <div className='ColumnList__container'>
          <div className='ColumnList__title'>Pinned to the left</div>
          <Droppable droppableId='left'>
            {(provided, snapshot) => (
              <div
                className={`ColumnList__items__wrapper ${
                  snapshot.isDraggingOver
                    ? 'ColumnList__items__wrapper__dragging'
                    : ''
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {state.columns.left.list.map((data: any, index: number) => (
                  <ColumnItem key={index} data={data} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className='ColumnList__container'>
          <div className='ColumnList__title'>
            <div className='ManageColumns__Search'>
              <div className='ManageColumns__Search__icon'>
                <Icon name='search' />
              </div>
              <InputBase
                placeholder='Search'
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          </div>
          <Droppable droppableId='middle'>
            {(provided, snapshot) => (
              <div
                className={`ColumnList__items__wrapper ${
                  snapshot.isDraggingOver
                    ? 'ColumnList__items__wrapper__dragging'
                    : ''
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {state.columns.middle.list.map((data: any, index: number) => {
                  return <ColumnItem key={index} data={data} index={index} />;
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className='ColumnList__container'>
          <div className='ColumnList__title'>Pinned to the right</div>
          <Droppable droppableId='right'>
            {(provided, snapshot) => (
              <div
                className={`ColumnList__items__wrapper ${
                  snapshot.isDraggingOver
                    ? 'ColumnList__items__wrapper__dragging'
                    : ''
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {state.columns.right.list.map((data: any, index: number) => {
                  return <ColumnItem key={index} data={data} index={index} />;
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
      <div className='ManageColumns__actions__container'>
        <Button
          variant='text'
          size='small'
          onClick={() =>
            onManageColumns({
              left: [],
              middle: [],
              right: [],
            })
          }
        >
          reset columns order
        </Button>
        <Button variant='text' size='small'>
          show table diff
        </Button>
        <Divider
          style={{ margin: '0 0.875rem' }}
          orientation='vertical'
          flexItem
        />
        <Button variant='text' size='small'>
          <Icon name='eye-show-outline' /> show all
        </Button>
        <Button variant='text' size='small'>
          <Icon name='eye-outline-hide' /> hide all
        </Button>
      </div>
    </DragDropContext>
  );
}

export default React.memo(ManageColumnsPopover);