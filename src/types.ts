//Виртуальный DOM

import { ReactComponent } from "./component"

export type Props = { [_: string]: string | number | boolean | Function }

export interface VirtualReactElement {
  kind: 'element'
  tagname: string
  children?: ReactNode[]
  props?: Props
  key: string
}

export interface VirtualReactComponent {
  kind: 'component'
  instance?: ReactComponent<any, any>
  props: object
  component: { new(): ReactComponent<any, any> }
  key: string
}

export interface VirtualReactText {
  kind: 'text',
  value: string
  key: string
}

//Общий тип
export type ReactNode =
  | VirtualReactText
  | VirtualReactElement
  | VirtualReactComponent

