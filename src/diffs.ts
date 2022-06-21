import { Props, ReactNode } from "./types"


type AttributesUpdater = {
  set: Props
  remove: string[]
}

interface InsertOperation {
  kind: 'insert',
  node: ReactNode
}

interface UpdateOperation {
  kind: 'update',
  attributes: AttributesUpdater,
  childeren: ChildUpdater[]
}

interface ReplaceOperation {
  kind: 'replace',
  newNode: ReactNode
  callback?: (elem: HTMLElement | Text) => void
}

interface RemoveOperation {
  kind: 'remove'
}

interface SkipOperation {
  kind: 'skip'
}

export type VDomNodeUpdater =
  | UpdateOperation
  | ReplaceOperation
  | SkipOperation

export type ChildUpdater =
  | UpdateOperation
  | ReplaceOperation
  | RemoveOperation
  | SkipOperation
  | InsertOperation

const skip = (): SkipOperation => ({ kind: 'skip' })

const replace = (newNode: ReactNode): ReplaceOperation => ({ kind: 'replace', newNode })

const update = (attributes: AttributesUpdater, childeren: ChildUpdater[]): UpdateOperation => ({
  kind: 'update',
  attributes,
  childeren
})

const remove = (): RemoveOperation => ({ kind: 'remove' })

const insert = (node: ReactNode): InsertOperation => ({ kind: 'insert', node })

const isEqual = (val1: any, val2: any): boolean => {
  return false
}

export const createDiff = (oldNode: ReactNode, newNode: ReactNode): VDomNodeUpdater => {
  if (oldNode.kind == 'text' && newNode.kind == 'text' && oldNode.value == newNode.value) {
    return skip()
  }

  if (oldNode.kind == 'text' || newNode.kind == 'text') {
    return replace(newNode)
  }

  if (oldNode.kind == 'component' && newNode.kind == 'component' && oldNode.component == newNode.component && oldNode.instance) {
    newNode.instance = oldNode.instance
    if (isEqual(oldNode.props, newNode.props)) return skip()
    return newNode.instance.setProps(newNode.props)
  }

  if (oldNode.kind == 'component') {
    oldNode.instance.unmount()
    oldNode.instance = null
    return replace(newNode)
  }

  if (newNode.kind == 'component') {
    newNode.instance = new newNode.component()
    return {
      kind: 'replace',
      newNode: newNode.instance.initProps(newNode.props),
      callback: e => newNode.instance.notifyMounted(e)
    }
  }

  if (oldNode.tagname != newNode.tagname) {
    return replace(newNode)
  }

  const attUpdater: AttributesUpdater = {
    remove: Object.keys(oldNode.props || {})
      .filter(att => Object.keys(newNode).indexOf(att) == -1),
    set: Object.keys(newNode.props || {})
      .filter(att => oldNode.props[att] != newNode.props[att])
      .reduce((upd, att) => ({ ...upd, [att]: newNode.props[att] }), {})
  }

  const childsUpdater: ChildUpdater[] = childsDiff((oldNode.children || []), (newNode.children || []))

  return update(attUpdater, childsUpdater)
}

const removeUntilkey = (operations: ChildUpdater[], elems: [string | number, ReactNode][], key: string | number) => {
  while (elems[0] && elems[0][0] != key) {
    if (elems[0][1].kind == 'component') {
      elems[0][1].instance.unmount()
      elems[0][1].instance = null
    }
    operations.push(remove())
    elems.shift()
  }
}

const insertUntilKey = (operations: ChildUpdater[], elems: [string | number, ReactNode][], key: string | number) => {
  while (elems[0] && elems[0][0] != key) {
    operations.push(insert(elems.shift()[1]))
  }
}

const childsDiff = (oldChilds: ReactNode[], newChilds: ReactNode[]): ChildUpdater[] => {
  let remainingOldChilds: [string | number, ReactNode][] = [];
  let remainingNewChilds: [string | number, ReactNode][] = [];

  for (let i: number = 0; i < oldChilds.length; i++) {
    const oldChild: [string | number, ReactNode] = [oldChilds[i].key, oldChilds[i]];
    remainingOldChilds.push(oldChild);
  }

  for (let i: number = 0; i < newChilds.length; i++) {
    const newChild: [string | number, ReactNode] = [newChilds[i].key, newChilds[i]];
    remainingNewChilds.push(newChild);
  }

  const operations: ChildUpdater[] = []

  let nextUpdKey : string | number = undefined;

  mainLoop:
  for (let i: number = 0; i < remainingOldChilds.length; i++){
    for(let j: number = 0; i < remainingNewChilds.length; j++){
      let [oldKey] = remainingOldChilds[i];
      let [newKey] = remainingNewChilds[j];
      if(oldKey === newKey){
        nextUpdKey = oldKey;
        break mainLoop;
      }
    }
  }

  let [nextUpdateKey] = [nextUpdKey] || [null];

  while (nextUpdateKey) {

    removeUntilkey(operations, remainingOldChilds, nextUpdateKey)

    insertUntilKey(operations, remainingNewChilds, nextUpdateKey)

    operations.push(createDiff(remainingOldChilds.shift()[1], remainingNewChilds.shift()[1]));

    [nextUpdateKey] = remainingOldChilds.find(k => remainingNewChilds.map(k => k[0]).indexOf(k[0]) != -1) || [null]
  }

  removeUntilkey(operations, remainingOldChilds, undefined)

  insertUntilKey(operations, remainingNewChilds, undefined)

  return operations
}