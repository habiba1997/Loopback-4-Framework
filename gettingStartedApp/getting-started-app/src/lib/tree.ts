export class Tree {
  private tree = [

    { id: 1, name: 'one', parent: null },
    { id: 2, name: 'oneTwo', parent: 1 },
    { id: 3, name: 'oneThree', parent: 1 },
    { id: 4, name: 'four', parent: null },
    { id: 5, name: 'fourFive', parent: 4 },
    { id: 6, name: 'fourSix', parent: 4 },
    { id: 7, name: 'seven', parent: null },
    { id: 8, name: 'sevenEight', parent: 7 },
    { id: 9, name: 'sevenNine', parent: 7 },
  ];

  public traverseTree(parent?: any) {
    if (parent == undefined) parent = null;

    const array: any = [];
    this.tree.forEach((treeObj: any) => {
      if (parent == treeObj.parent) {
        treeObj.children = this.traverseTree(treeObj.id);
        array.push(treeObj);
      }

    })
    return array;

  }

}
