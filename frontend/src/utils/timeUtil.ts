// 1. Return 'Today at' or 'Yesterday at' or date string based on 'time' param
export function getDateString(time: number): string {
    const currentTime = new Date()
    const messageTime = new Date(time)

    const diffDay = currentTime.getDate() - messageTime.getDate()
    const diffMonth = currentTime.getMonth() - messageTime.getMonth()
    const diffYear = currentTime.getFullYear() - messageTime.getFullYear()

    if (diffDay === 0 && diffMonth === 0 && diffYear === 0) {
        return 'Today at '
    } else if (diffDay === 1 && diffMonth === 0 && diffYear === 0) {
        return 'Yesterday at '
    } else {
        return `${messageTime.getDate()}/${messageTime.getMonth()}/${messageTime.getFullYear()} at `
    }
}

export function getTimeString(time: number): string {
    return new Date(time).toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    })
}
