export const commonConst = {
  label: {
  },
  button: {
  },
  message: {
  },
  systemName: "休暇申請管理",
  systemVersion: "0.0.0",
  actionValue: {
    draft: 0,      // 下書き
    panding: 1,    // 承認待ち
    approval: 2,   // 承認
    complete: 3,   // 完了
    reject: 4,     // 差戻
    cancel: 5,     // 取消
  },
  statusColorCode: {
    draft: "#99ccff",        // 下書き
    panding: "#ffcc66",      // 承認待ち
    approval: '',            // 承認
    complete: "#99cc99",     // 完了
    reject: "#ff9999",       // 差戻
    cancel: '',              // 取消
  },

  initialApplicationTypeValues: "0",  // 年次有給休暇申請タイプ
} as const