import { React } from "./react";
import { renderDOM, applyUpdate } from "./render";
import { ReactComponent } from "./component";
import { ReactNode } from "./types";
import App from "./App";

interface NewItemFormState {
    name: string
}

interface NewItemFormProps {
    addItem: (name: string) => void
}

// class NewItemForm extends ReactComponent<NewItemFormProps, NewItemFormState> {

//     state = { name: '' }

//     render() {
//         return React.createElement({
//             tagname: 'form',
//             key: 'f',
//             attributes: {
//                 onsubmit: (e: Event) => {
//                     e.preventDefault()
//                     this.props.addItem(this.state.name)
//                     this.setState(() => ({ name: '' }))
//                 }
//             },
//             children: [
//                 React.createElement({
//                     tagname: 'label',
//                     key: 'label',
//                     className: 'preLabel',
//                     children: [
//                         React.createText({
//                             value: 'Новый элемент'
//                         })
//                     ]
//                 }),
//                 React.createElement({
//                     tagname: 'input',
//                     key: 'i-n',
//                     attributes:{
//                         value: this.state.name,
//                         oninput: (e: any) => this.setState(s => ({...s, name: e.target.value}))
//                     },
//                     children: []
//                 })
//             ]
//         })
//     }
// }

// interface ToDoItem {
//     name: string
//     done: boolean
// }

// interface ToDoState {
//     items: ToDoItem[]
// }

// class ToDoComponent extends ReactComponent<{}, ToDoState> {

//     state: ToDoState = { items: [] }

//     toggleItem(index: number) {
//         this.setState(s => ({
//             items: s.items.map((item, i) => {
//                 if (index == i) return { ...item, done: !item.done }
//                 return item
//             })
//         }))
//     }

//     render() {
//         return React.createElement({
//             key: 'root',
//             tagname: 'div',
//             className: 'container',
//             children: [
//                 React.createComponent<NewItemFormProps>({
//                     key: 'form',
//                     component: NewItemForm,
//                     props: {
//                         addItem: n => this.setState(s => ({ items: s.items.concat([{ name: n, done: false }]) }))
//                     }
//                 }),
//                 React.createElement({
//                     tagname: 'ul',
//                     key: 'items',
//                     children: this.state.items.map((item, index) =>  React.createElement({
//                         tagname: 'li',
//                         key: index.toString(),
//                         children: [
//                             React.createElement({
//                                 tagname: 'button',
//                                 key: 'btn',
//                                 attributes:{
//                                     onclick:() => this.toggleItem(index)
//                                 },
//                                 children: [
//                                     React.createText({
//                                         value: item.done ? 'done' : '-'
//                                     })
//                                 ]
//                             }),
//                             React.createText({
//                                 value: item.name
//                             })
//                         ]
//                     }))
//                 })
//             ]
//         })
//     }
// }



renderDOM('root', React.createComponent({
    component: App,
    props: {},
    key: 'root'
}))

