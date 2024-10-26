"use client"

export default function LoadingView() {
  return (
    <div className="d-flex justify-content-center pt-5">
      <div className="spinner-border position-fixed" role="status">
        {/* <span className="visually-hidden">Loading...</span> */}
      </div>
      <h5 className="pt-5">読込中</h5>
    </div>
  );
};
