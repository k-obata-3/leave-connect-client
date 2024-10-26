const utils = {

  getSessionStorageName() {
    return 'leave-connect';
  },
  getLocalCurrentDate() {
    return new Date();
  },
  getLocalDate(dateStr) {
    return new Date(dateStr);
  },
  getDateString(dateVal, separator) {
    let localDate = dateVal.toLocaleDateString().split('/');
    let year = localDate[0];
    let month = "0" + localDate[1];
    let date = "0" + localDate[2];

    return `${year}${separator}${month.slice(-2)}${separator}${date.slice(-2)}`;
  },
  getTimeString(dateVal) {
    let localDate = dateVal.toLocaleTimeString().split(':');
    let hours = "0" + localDate[0];
    let minutes = "0" + localDate[1];
    return `${hours.slice(-2)}:${minutes.slice(-2)}`;
  },
  getServiceYears(date) {
    let dateNow = this.getLocalCurrentDate();
    if(!date || date > dateNow) {
      return "";
    }

    let timeDiff = dateNow.getTime() - date.getTime(); 
    let daysDiff = timeDiff / (1000 * 3600 * 24);
    const DAYS_PER_MONTH = 365 / 12;
    let year = Math.floor(daysDiff / 365);
    let month = Math.floor((daysDiff - 365 * year) / DAYS_PER_MONTH);
    // let day = Math.floor((daysDiff - 365 * year - DAYS_PER_MONTH * month));

    return `${year}年${month}ヶ月`
  },
  setSessionStorage(key, value) {
    const storage = sessionStorage;
    const item = storage?.getItem(this.getSessionStorageName());
    if(!item) {
      storage.setItem(this.getSessionStorageName(), JSON.stringify({}));
    }

    const newItem = JSON.parse(item);
    if (newItem) {
      newItem[key] = value;
      storage.setItem(this.getSessionStorageName(), JSON.stringify(newItem));
    }
  },
  getSessionStorage(key) {
    const storage = sessionStorage;
    const item = storage?.getItem(this.getSessionStorageName());
    if(item) {
      const obj= JSON.parse(item);
      if(key in obj) {
        return obj[key];
      }
    }

    return;
  }
}
module.exports = utils;