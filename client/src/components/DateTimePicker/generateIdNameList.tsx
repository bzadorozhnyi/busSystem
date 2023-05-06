function generateIdNameList(from: number, to: number) {
    const list = [];
    for (let i = from; i <= to; i++) {
        list.push({
            id: i.toString(),
            name: i.toString()
        })
    }
    return list;
}

export default generateIdNameList;