import { Block } from "../../utils";

import compileTemplate from './button-test.pug';

interface ButtonTestProps {
  label: string;
  className: string;
  events: {
    click: () => void
  }
}


export class ButtonTest extends Block {
  constructor(props: ButtonTestProps) {
        // Создаём враппер DOM-элемент button
    super(props);

    // console.log('compileTemplate', compileTemplate)
  }

  render() {
    return this.compile(compileTemplate, {...this.props})
        // В данном случае render возвращает строкой разметку из шаблонизатора
    // return compile(template, this.props);
  }
}