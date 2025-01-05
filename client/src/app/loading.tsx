"use client"

export default function Loading() {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center">
        <div className="spinner-border position-fixed loading-view" role="status">
        </div>
      </div>
    </>
  );
}