import {ReactCompositeComponentWrapper} from "./reactCompositeComponentWrapper"
import {ReactDOMComponent} from "./reactDOMComponent"
import {Feact} from "./react"
import {ReactReconciler} from "./reactReconciler"


export function instantiateFeactComponent(element) {
    if (typeof element.type === 'string') {
        return new ReactDOMComponent(element);
    } else if (typeof element.type === 'function') {
        return new ReactCompositeComponentWrapper(element);
    }
}

export function mixSpecIntoComponent(Constructor, spec) {
    const proto = Constructor.prototype;

    for (const key in spec) {
            proto[key] = spec[key];
    }
}

export function getTopLevelComponentInContainer(container) {
    return container.__feactComponentInstance;
}

const TopLevelWrapper = function(props) {
    this.props = props;
};

TopLevelWrapper.prototype.render = function() {
return this.props;
};

export function renderNewRootComponent(element, container) {
    const wrapperElement = Feact.createElement(TopLevelWrapper, element);
  const componentInstance = new ReactCompositeComponentWrapper(wrapperElement);

  const markUp = ReactReconciler.mountComponent(componentInstance, container);
container.__feactComponentInstance = componentInstance._renderedComponent;

return markUp;
}

export function updateRootComponent(prevComponent, nextElement) {
    ReactReconciler.receiveComponent(prevComponent, nextElement);
}