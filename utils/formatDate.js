const fmtDate = date => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    console.log(day, month, year)

    return `${day}-${month + 1}-${year}`
}


module.exports = fmtDate;