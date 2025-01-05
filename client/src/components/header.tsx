"use client"

import { commonConst } from "@/consts/commonConst";

export default function Header() {
  const createHeader = () => {
    return (
      <>
        {/* <span className="navbar-brand font-white ms-3">Leave Connect</span> */}
        <span className="navbar-brand ms-3">{commonConst.systemName}</span>
        <div className="navbar-brand version">
          <span className="ms-5">ver</span><span className="ms-2">{commonConst.systemVersion}</span>
        </div>
      </>
    )
  }

  return (
    <>
      <nav className="navbar pc-only">
        {createHeader()}
      </nav>
      <nav className="navbar sp-only">
        {createHeader()}
      </nav>
    </>
  );
};
