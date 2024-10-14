import React, { useState, useEffect } from 'react';
import './table.css';

export default function Table({
  headData,
  renderHead,
  bodyData,
  renderBody,
  limit,
}) {
  const [dataShow, setDataShow] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const initDataShow = limit && bodyData ? bodyData.slice(0, Number(limit)) : bodyData;
    setDataShow(initDataShow);
  }, [bodyData, limit]);

  let pages = 1;
  let range = [];

  if (limit) {
    const page = Math.floor(bodyData.length / Number(limit));
    pages = bodyData.length % Number(limit) === 0 ? page : page + 1;
    range = [...Array(pages).keys()];
  }

  const selectPage = (page) => {
    const start = Number(limit) * page;
    const end = start + Number(limit);
    setDataShow(bodyData.slice(start, end));
    setCurrentPage(page);
  };

  return (
    <>
      <div className='table-wrapper'>
        <table>
          {headData && renderHead ? (
            <thead>
              <tr>{headData.map((item, index) => renderHead(item, index))}</tr>
            </thead>
          ) : null}
          <tbody>
            {dataShow && renderBody
              ? dataShow.map((item, index) => renderBody(item, index))
              : null}
          </tbody>
        </table>
      </div>
      {pages > 1 ? (
        <div className='table-pagination'>
          {range.map((item, index) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
              className={`table-pagination-item ${
                currentPage === index ? 'active' : ''
              }`}
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              onClick={() => selectPage(index)}
            >
              {item + 1}
            </div>
          ))}
        </div>
      ) : (
        ''
      )}
    </>
  );
}
