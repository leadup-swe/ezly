export function move(sourceArray: string[], sourceIndex: number, targetIndex: number, destinationArray?: string[]): [string[], string[]] {
  const newSourceArray = [ ...sourceArray ];
  const removed = newSourceArray.splice(sourceIndex, 1)[0];
  if (destinationArray) {
    const newDestinationArray = [ ...destinationArray ];
    newDestinationArray.splice(targetIndex, 0, removed);
    return [ newSourceArray, newDestinationArray ];
  } else {
    newSourceArray.splice(targetIndex, 0, removed);
    return [ newSourceArray, [] ];
  }
}
