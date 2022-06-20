import { ReactComponent } from './component'
import { Props, ReactNode, VirtualReactComponent, VirtualReactElement, VirtualReactText } from './types'


interface IElementArgs {
  tagname: string,
  className?: string,
  attributes?: Props
  key: string,
  children?: ReactNode[]
}

interface IComponentArgs<P extends Object> {
  props: P,
  key: string,
  component: new() => ReactComponent<P, any>,
}

interface ITextArgs{
  value: string,
  key?: string
}


export class React {
  static createElement(args: IElementArgs): VirtualReactElement {
    const { key, tagname, children, className, attributes } = args;

    const props = {...attributes, className};

    return ({
      kind: 'element',
      tagname,
      key,
      children: children || [],
      props: props
    });
  }

  static createComponent<P extends Object>(args: IComponentArgs<P>): VirtualReactComponent {
    const { key, component, props } = args;
    return ({
      component,
      props,
      key,
      kind: 'component'
    })
  }

  static createText(args: ITextArgs):VirtualReactText{

    const {value, key} = args;

    return ({
      kind: 'text',
      value: value,
      key: key || '2424'
    });
  }
}
