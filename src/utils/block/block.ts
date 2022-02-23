import EventBus from "../event-bus/event-bus";
import { nanoid } from 'nanoid';

type events = Record<string, () => void>

export abstract class Block {

  id = nanoid(6);

  protected props: any

  protected children: Record<string, Block>

  eventBus: () => EventBus

  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_RENDER: "flow:render",
    FLOW_CDU: "flow:component-did-update",
  };

  protected _element: HTMLElement | null = null;
  _meta = null;

  constructor(propsAndChildren = {}) {
    const eventBus = new EventBus();

    const {props, children} = this._getChildren(propsAndChildren);
    this.children = children;
    this._meta = {
      props
    };

    this.eventBus = () => eventBus;
    
    this.props = this._makePropsProxy(props);

    this.initChildren();

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }


  private _getChildren(propsAndChildren: any) {
    const children: any = {};
    const props: any = {}

    Object.entries(propsAndChildren).map(([key, value]) => {
      if(value instanceof Block) {
          children[key] = value;
      } else {
        props[key] = value;
      }
    })

    return {children, props};
  }

  protected initChildren() {

  }

  private _registerEvents(eventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
  }

  init() {
   this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(oldProps) {
    this.componentDidMount(oldProps);
  }
  
  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

	// Может переопределять пользователь, необязательно трогать
  componentDidMount(oldProps) {}

	dispatchComponentDidMoun() {}

  private _componentDidUpdate(oldProps, newProps) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if(response) {
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }
  }

	// Может переопределять пользователь, необязательно трогать
  componentDidUpdate(oldProps, newProps): boolean {
    if(oldProps === newProps) {
      return false;
    }

    return true;
  }

  setProps = nextProps => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  private _render() {
    const fragment = this.render();

    const newElement = fragment.firstElementChild as HTMLElement;
    if(this._element) {
      this._element.replaceWith(newElement)
    } 
    this._element = newElement;

    this._addEvents();
     this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  protected render(): DocumentFragment {
    return new DocumentFragment();
  }

  getContent() {
    return this.element;
  }

  private _makePropsProxy(props) {
    const self = this;
    
    const proxyProps = new Proxy(props, {
      get (target, prop) {
          const value = target[prop];
          return (typeof value === 'function') ? value.bind(target) : value;
      },

      set(target, prop, value): boolean {
        const oldValue = {...target};
        const newValue = target;
        target[prop] = value;
        
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldValue, newValue)
        return true;
      },

      deleteProperty(target, prop): boolean {
        return false;
      }

    });

    return proxyProps;
  }

  private _createDocumentElement(tagName) {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName);
  }

  private _addEvents() {
    const {events}: events = this.props;
    if(!events || !this._element) {
      return
    }

    Object.entries(events).forEach(([eventName, event]) => {
      
      this._element.addEventListener(eventName, event)
    })
  }


  show() {
    this.getContent().style.display = "block";
  }

  hide() {
    this.getContent().style.display = "none";
  }

  compile(template: (context: any) => string, context: any) {
    const fragment: HTMLTemplateElement = this._createDocumentElement('template');

    Object.entries(this.children).forEach(([key, child]) => {
      context[key] = `<div data-id="id-${child.id}"></div>`
    })

    const htmlString = template(context);

    fragment.innerHTML = htmlString;

    Object.entries(this.children).forEach(([key, child]) => {
      const stub = fragment.content.querySelector(`[data-id="id-${child.id}"]`);

      if(!stub) {
        return 
      }

      stub.replaceWith(child.getContent());
    })

    return fragment.content;
  }
}