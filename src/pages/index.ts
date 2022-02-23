import template from './index.pug';
// import './index.scss';

class LogingPage extends Block {
  constructor(props: {buttonLabel: string}) {
    super(props);
  }

  componentDidUpdate(oldProps: any, newProps: any): boolean {
      if(oldProps.buttonLabel !== newProps.buttonLabel) {
        this.children.ButtonTest.setProps({label: newProps.buttonLabel})
      }
      return true;
  }

  initChildren() {
    this.children.ButtonTest = new ButtonTest({
      className: 'my-class',
      label: this.props.buttonLabel,
      events: {
        click: () => {
          console.log('click')
        }
      }
    });
  }


  render() {
    return this.compile(template, {})
  }
}

const loginPage = new LogingPage({buttonLabel: 'first button'});

import {ButtonTest} from '../components/button-test/button-test';
import { Block, renderDOM } from '../utils';


setTimeout(() => {
  loginPage.setProps({buttonLabel: 'new text in button'})
}, 2000)

renderDOM("#app", loginPage);