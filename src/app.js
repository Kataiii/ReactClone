import {ReactInstanceMap} from "./reactInstanceMap"
import {ReactCompositeComponentWrapper} from "./reactCompositeComponentWrapper"
import {ReactReconciler} from "./reactReconciler"
import {Feact} from "./react"


export function FeactComponent() {
}

FeactComponent.prototype.setState = function(partialState) {
		const internalInstance = ReactInstanceMap.get(this);
    internalInstance._pendingPartialState = internalInstance._pendingPartialState || [];
    internalInstance._pendingPartialState.push(partialState);
    
    if (!internalInstance._updating) {
    		ReactReconciler.performUpdateIfNecessary(internalInstance);
    }
}


const MyComponent = Feact.createClass({
		componentWillMount() {
    		this.renderCount = 0;
    },
    
    getInitialState() {
    		return {
        		message: 'state from getInitialState'
        };
    },
    
    componentWillReceiveProps(nextProps) {
    		this.setState({ message: 'state from componentWillReceiveProps' });
    },
    
  	render() {
    		this.renderCount += 1;
    		return Feact.createElement('h1', null, 'this is render ' + this.renderCount + ', with state: ' + this.state.message + ', and this prop: ' + this.props.prop);
  	}
});

Feact.render(
		Feact.createElement(MyComponent, { prop: 'first prop' }),
  	document.getElementById('root')
);

setTimeout(function() {
		Feact.render(
  	  	Feact.createElement(MyComponent, { prop: 'second prop' }),
      	document.getElementById('root')
  	);
}, 2000);



