"use client"

import React from 'react'
import { useEffect, useState } from 'react';

import { pagerConst } from '@/consts/pagerConst';

export default function Pager(params: any) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pager, setPager] = useState([{
    page: pagerConst.initialCurrentPage,
    active: false,
  }]);

  useEffect(() =>{
    setPageList(params.params.page);
  },[params])

  const setPageList = (page: any) => {
    let pageList: any = [];
    let limit = params.params.limit;
    let pegeCount = Math.ceil(params.params.totalCount / limit);
    for (let i = 1; i <= pegeCount; i++) {
      let isActive = page === i ? true : false;
      pageList.push({page: i, active: isActive});
    }
    setPager(pageList);
    setCurrentPage(page);
  }

  const onPageClick = (page: any) => {
    if(currentPage !== page) {
      params.params.pageClickFnc(page);
      setPageList(page);
      const contentParent = document.getElementsByClassName('content-parent');
      if(contentParent.length){
        contentParent[0].scroll({
          top: 0,
          behavior: "instant",
        })
      }
      window.scroll({
        top: 0,
        behavior: "instant",
      });
    }
  }

  return (
    <nav className="pager" hidden={!pager.length}>
      <ul className="pagination">
        <li className={currentPage !== pagerConst.initialCurrentPage ? 'page-item' : 'page-item disabled'} onClick={() => {
          if(currentPage !== 1) {
            onPageClick(currentPage - 1)
          }}}>
          <a className="page-link">{pagerConst.button.prev}</a>
        </li>
        {
          pager.map((page, index) => (
            <li key={page.page} className={page.active || page.page === currentPage ? 'page-item active' : 'page-item'} onClick={() =>onPageClick(page.page)}>
              <a className="page-link">{page.page}</a>
            </li>
          ))
        }
        <li className={currentPage !== pager.length ? 'page-item' : 'page-item disabled'} onClick={() => {
          if(currentPage !== pager.length) {
            onPageClick(currentPage + 1);
          }}}>
          <a className="page-link">{pagerConst.button.next}</a>
        </li>
      </ul>
    </nav>

  )
};
