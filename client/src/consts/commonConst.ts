export const commonConst = {
  label: {
  },
  button: {
  },
  message: {
  },
  systemName: "休暇申請・スキル管理",
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

  PAID_HOLIDAY_TYPE_VALUE: 0,                    // 年次有給休暇　申請タイプ値
  PAID_HOLIDAY_REGULATE_TYPE_VALUE: 99,          // 日数調整 申請タイプ値
  APPLICATION_CLASSIFICATION_ALL_DAYS_VALUE: 0,  // 全日休暇 設定値
  APPLICATION_CLASSIFICATION_TIME_VALUE: 3,      // 時間単位休暇 設定値
  USER_EFFECTIVE_STATUS: 1,                      // 有効なユーザのステータス
} as const