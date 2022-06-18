import {FeactComponent} from "./app"
import {mixSpecIntoComponent, getTopLevelComponentInContainer, renderNewRootComponent, updateRootComponent} from "./functions"


export const Feact = {
    createElement(type, props, children) {
    const element = {
        type,
        props: props || {}
    };

    if (children) {
        element.props.children = children;
    }

    return element;
},

  createClass(spec) {
      function Constructor(props) {
            this.props = props;
        
        const initialState = this.getInitialState ? this.getInitialState() : null;
        this.state = initialState;
      }

      Constructor.prototype = new FeactComponent();
    
    mixSpecIntoComponent(Constructor, spec);
    
      return Constructor;
},

render(element, container) {
        const prevComponent = getTopLevelComponentInContainer(container);
    
    if (prevComponent) {
            return updateRootComponent(prevComponent, element);
    } else {
            return renderNewRootComponent(element, container);
    }
}
};